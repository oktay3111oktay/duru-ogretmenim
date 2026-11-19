const fs = require('fs');
const path = require('path');
const { german: germanProfiles, english: englishProfiles } = require('./language-profiles-v6550.cjs');

const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'dist', 'index.html');
const lines = fs.readFileSync(indexPath, 'utf8').split(/\r?\n/);

function readConst(name) {
  const line = lines.find(row => row.startsWith(`const ${name}=`));
  if (!line) throw new Error(`${name} bulunamadı`);
  return JSON.parse(line.slice(line.indexOf('=') + 1, -1));
}

const datasets = {
  Almanca: {
    code: 'DE', lang: 'de-DE', data: readConst('GERMAN_MEB_DATA'), pages: readConst('GERMAN_MEB_PAGES'), profiles: germanProfiles,
    files: { L: 'almanca5dkckl.pdf', A: 'almanca5ckckl.pdf', H: 'almanca5okckl.pdf' },
  },
  İngilizce: {
    code: 'EN', lang: 'en-US', data: readConst('ENGLISH_MEB_DATA'), pages: readConst('ENGLISH_MEB_PAGES'), profiles: englishProfiles,
    files: { L: 'ingilizce5dk.pdf', A: 'ingilizce5ck.pdf', H: 'ingilizce5ok.pdf' },
  },
};

const unique = values => [...new Set(values.map(value => String(value).trim()).filter(Boolean))];
const cleanSentence = value => String(value || '').trim();

function options(answer, distractors) {
  const list = unique([answer, ...distractors]);
  if (list.length !== 4 || list[0] !== String(answer).trim()) {
    throw new Error(`Geçersiz seçenekler: ${answer} / ${JSON.stringify(distractors)}`);
  }
  return list;
}

function quoted(prompt) {
  return String(prompt || '').match(/[“"]([^”"]+)[”"]/)?.[1] || '';
}

function sentenceChoices(sentence) {
  const punctuation = /[?!]$/.test(sentence) ? sentence.slice(-1) : '.';
  const core = sentence.replace(/[.?!]+$/, '');
  const words = core.split(/\s+/).filter(Boolean);
  if (words.length < 3) throw new Error(`Cümle çok kısa: ${sentence}`);
  const swap = [...words]; [swap[0], swap[1]] = [swap[1], swap[0]];
  const rotate = [...words.slice(1), words[0]];
  const reverse = [...words].reverse();
  const list = unique([
    core + punctuation,
    swap.join(' ') + punctuation,
    rotate.join(' ') + punctuation,
    reverse.join(' ') + punctuation,
  ]);
  if (list.length !== 4) {
    const move = [words.at(-1), ...words.slice(1, -1), words[0]].join(' ') + punctuation;
    if (!list.includes(move)) list.push(move);
  }
  if (list.length !== 4) throw new Error(`Cümle seçenekleri üretilemedi: ${sentence}`);
  return list;
}

function item(prompt, answer, distractors, skillType, extra = {}) {
  return { prompt, answer, options: options(answer, distractors), skillType, ...extra };
}

function manualItem(row, skillType) {
  return item(row[0], row[1], row.slice(2), skillType);
}

function pageRefs(config, topic) {
  const refs = [];
  for (const [book, range] of Object.entries(topic.pages || {})) {
    const [start, end = start] = range;
    for (let page = start; page <= end; page += 1) {
      const key = `${book}:${page}`;
      if (config.pages[key]) refs.push({ book, page, file: config.files[book], image: config.pages[key] });
    }
  }
  if (!refs.length) throw new Error(`${topic.title}: görünür kaynak sayfası yok`);
  return refs;
}

function dialogueDistractors(allPairs, answer, type) {
  return unique(allPairs.map(pair => pair[type]).filter(value => value !== answer)).slice(0, 3);
}

function createBank(course, config, topic, topicIndex, profile, allPairs) {
  const rows = [];
  const original = topic.questions || [];
  if (original.length < 6) throw new Error(`${course} ${topic.title}: temel kelime soruları eksik`);

  for (let i = 0; i < 2; i += 1) {
    const source = original[i];
    rows.push(item(source.prompt, source.answer, source.options.filter(option => option !== source.answer), 'vocabulary', {
      hint: source.hint, explain: source.explain, origin: 'source-adapted',
    }));
  }

  for (let i = 2; i < 6; i += 1) {
    const source = original[i];
    const audioText = quoted(source.prompt);
    if (!audioText) throw new Error(`${course} ${topic.title}: dinleme metni çıkarılamadı`);
    rows.push(item(`${topic.title}: Dinleme ${i - 1}/4 - Dinlediğin sözcük veya ifade hangi anlama gelir?`, source.answer, source.options.filter(option => option !== source.answer), 'listening', {
      audioText, hint: 'Ses kaydını yeniden dinle ve bağlamı düşün.', explain: source.explain, origin: 'source-adapted',
    }));
  }

  profile.pairs.forEach(([question, response], pairIndex) => {
    rows.push(item(`${topic.title}: “${question}” sorusuna hangi cevap uygundur?`, response,
      dialogueDistractors(allPairs, response, 1), 'functional-language', {
        hint: 'Sorunun iletişim amacını belirle.', explain: `Uygun mini diyalog: ${question} — ${response}`, origin: 'source-based-original',
      }));
    rows.push(item(`${topic.title}: “${response}” cevabını ortaya çıkaran soru hangisidir?`, question,
      dialogueDistractors(allPairs, question, 0), 'functional-language', {
        hint: 'Cevabın hangi bilgiyi verdiğine dikkat et.', explain: `Uygun mini diyalog: ${question} — ${response}`, origin: 'source-based-original', pairIndex,
      }));
  });

  profile.sentences.forEach((sentence, sentenceIndex) => {
    const sentenceOptions = sentenceChoices(sentence);
    const tokens = sentence.replace(/[.?!]+$/, '').split(/\s+/).reverse().join(' / ');
    rows.push(item(`${topic.title}: “${tokens}” sözcükleriyle kurulan doğru cümle hangisidir?`, sentenceOptions[0], sentenceOptions.slice(1), 'sentence-building', {
      hint: 'Özne, fiil ve diğer ögelerin sırasını kontrol et.', explain: `Doğru söz dizimi: ${sentenceOptions[0]}`, origin: 'source-based-original', sentenceIndex,
    }));
  });

  profile.readingChecks.forEach(row => rows.push({
    ...manualItem(row, 'reading'),
    prompt: `${profile.readingText}\n\n${row[0]}`,
    hint: 'Kısa metindeki açık bilgiyi yeniden bul.',
    explain: `Metne göre doğru cevap: ${row[1]}`,
    readingText: profile.readingText,
    origin: 'source-based-original',
  }));

  profile.contextChecks.forEach(row => rows.push({
    ...manualItem(row, 'contextual-use'),
    prompt: `${topic.title}: ${row[0]}`,
    hint: 'Duruma en uygun ve dil bilgisi bakımından doğru ifadeyi seç.',
    explain: `Bu durumda doğru kullanım: ${row[1]}`,
    origin: 'source-based-original',
  }));

  profile.sentences.slice(3, 5).forEach((sentence, correctionIndex) => {
    const sentenceOptions = sentenceChoices(sentence);
    const wrong = sentenceOptions[1];
    rows.push(item(`${topic.title}: “${wrong}” cümlesinin doğru biçimi hangisidir?`, sentenceOptions[0], sentenceOptions.slice(1), 'grammar-correction', {
      hint: 'Yanlış cümledeki sözcük sırasını ve fiil biçimini kontrol et.', explain: `Doğru biçim: ${sentenceOptions[0]}`, origin: 'source-based-original', correctionIndex,
    }));
  });

  profile.pairs.forEach(([question, response], pairIndex) => {
    rows.push(item(`${topic.title}: Diyalog dinleme ${pairIndex + 1}/2 - Dinlediğin soruya uygun cevabı seç.`, response,
      dialogueDistractors(allPairs, response, 1), 'listening-dialogue', {
        audioText: question, hint: 'Soruyu yeniden dinle; istenen bilgiyi belirle.', explain: `${question} — ${response}`, origin: 'source-based-original',
      }));
  });

  if (rows.length !== 24) throw new Error(`${course} ${topic.title}: ${rows.length} soru üretildi`);
  const refs = pageRefs(config, topic);
  const byBook = Object.fromEntries(['L', 'A', 'H'].map(book => [book, refs.filter(ref => ref.book === book)]));
  const sourcePlan = [
    ['L', 0], ['L', 0], ['L', 0], ['L', 1], ['A', 0], ['A', 1],
    ['L', 1], ['H', 0], ['L', 1], ['H', 0],
    ['H', 0], ['H', 1], ['H', 0], ['H', 1], ['H', 0],
    ['A', 0], ['A', 1], ['A', 1], ['H', 1], ['A', 1],
    ['H', 0], ['H', 1], ['L', 0], ['L', 1],
  ];
  return rows.map((row, index) => {
    const [book, position] = sourcePlan[index];
    const candidates = byBook[book];
    const ref = candidates[Math.min(position, candidates.length - 1)] || refs[index % refs.length];
    const difficulty = index < 8 ? 'kolay' : index < 18 ? 'orta' : 'zor';
    return {
      c: course,
      t: topicIndex,
      skill: topic.title,
      ...row,
      id: `LANG-${config.code}-${String(topicIndex).padStart(2, '0')}-${String(index).padStart(2, '0')}`,
      difficulty,
      outcome: profile.outcome,
      sourceType: 'MEB',
      schoolSource: false,
      sourceRef: { ...ref, range: topic.pages[ref.book] },
      languageCode: config.lang,
    };
  });
}

const content = {};
const speaking = {};
const coverage = { version: 'V6.55.0', generatedAt: new Date().toISOString(), schoolSources: { Almanca: 0, İngilizce: 0 }, courses: {} };

for (const [course, config] of Object.entries(datasets)) {
  if (config.data.length !== config.profiles.length) throw new Error(`${course}: konu ve profil sayısı farklı`);
  const allPairs = config.profiles.flatMap(profile => profile.pairs);
  content[course] = [];
  speaking[course] = [];
  const promptSet = new Set();
  const sourceImages = new Set();
  const skills = {};
  config.data.forEach((topic, topicIndex) => {
    const bank = createBank(course, config, topic, topicIndex, config.profiles[topicIndex], allPairs);
    for (const question of bank) {
      const normalized = question.prompt.replace(/\s+/g, ' ').trim().toLocaleLowerCase('tr-TR');
      if (promptSet.has(normalized)) throw new Error(`${course}: yinelenen soru: ${question.prompt}`);
      promptSet.add(normalized);
      sourceImages.add(`${question.sourceRef.book}:${question.sourceRef.page}`);
      skills[question.skillType] = (skills[question.skillType] || 0) + 1;
    }
    content[course].push({ unit: topic.unit, title: topic.title, outcome: config.profiles[topicIndex].outcome, pages: topic.pages, questions: bank });
    speaking[course].push(config.profiles[topicIndex].speaking.map(([instruction, model], taskIndex) => ({
      id: `SPEAK-${config.code}-${String(topicIndex).padStart(2, '0')}-${taskIndex}`,
      instruction, model, languageCode: config.lang, outcome: config.profiles[topicIndex].outcome,
    })));
  });
  coverage.courses[course] = {
    topics: content[course].length,
    questions: content[course].reduce((sum, topic) => sum + topic.questions.length, 0),
    speakingTasks: speaking[course].reduce((sum, tasks) => sum + tasks.length, 0),
    sourceFiles: Object.values(config.files),
    linkedSourceImages: sourceImages.size,
    skillDistribution: skills,
  };
}

const runtime = `/* V6.55.0: Almanca ve İngilizce kaynak izlemeli beceri bankası. */
(function(){
  const VERSION='V6.55.0';
  const CONTENT=${JSON.stringify(content)};
  const SPEAKING=${JSON.stringify(speaking)};
  const COURSES=['Almanca','İngilizce'];
  const FIELD='languageBankV6550';
  const clone=value=>JSON.parse(JSON.stringify(value));
  const int=value=>Math.max(0,Math.floor(Number(value)||0));
  const isLanguage=courseName=>COURSES.includes(courseName);

  function ensureState(save=false){
    state[FIELD]=state[FIELD]&&typeof state[FIELD]==='object'?state[FIELD]:{};
    state[FIELD].attempts=state[FIELD].attempts&&typeof state[FIELD].attempts==='object'?state[FIELD].attempts:{};
    state[FIELD].speaking=state[FIELD].speaking&&typeof state[FIELD].speaking==='object'?state[FIELD].speaking:{};
    state[FIELD].version=6550;
    if(save)persist();
    return state[FIELD];
  }

  function bank(c,t){return CONTENT[c]?.[Number(t)]?.questions||[]}
  function rotateOptions(question,seed){
    const q=clone(question),shift=Math.abs(int(seed))%q.options.length;
    q.options=q.options.slice(shift).concat(q.options.slice(0,shift));
    return q;
  }
  function build(c,t,n){const rows=bank(c,t);if(!rows.length)throw Error(c+' konu bankası bulunamadı');return rotateOptions(rows[((Number(n)%rows.length)+rows.length)%rows.length],n)}

  const priorMake=window.makeQuestion;
  window.makeQuestion=makeQuestion=function(c,t,n){return isLanguage(c)?build(c,t,n):priorMake.apply(this,arguments)};

  const priorQuiz=window.startQuiz;
  window.startQuiz=startQuiz=function(c,t,kind){
    if(!isLanguage(c))return priorQuiz.apply(this,arguments);
    t=Number(t);kind=String(kind||'normal');
    const flow=window.__DURU_V6521_TEST_FLOW__;
    if(flow?.resumeForStart?.(c,t,kind))return true;
    if(t>0&&!unlockedAfter(c,t-1)){alert('Önce önceki konunun zorunlu testini tamamla.');return openCourse(c)}
    if(kind==='extra'&&!done(c,t)){alert('Ekstra test için önce konu testini tamamla.');return openCourse(c)}
    if(kind==='normal'&&state.pendingSession){const pending=state.pendingSession;if(pending.course===c&&pending.session?.keys?.includes(key(c,t))){resumePending();return}delete state.pendingSession;persist()}
    course=c;topic=t;
    const store=ensureState(false),attemptKey=c+'|'+t+'|'+kind,attempt=int(store.attempts[attemptKey]);
    const offset=(attempt*20+(kind==='extra'?10:0))%bank(c,t).length;
    store.attempts[attemptKey]=attempt+1;store.updatedAt=new Date().toISOString();persist();
    startSession(Array.from({length:10},(_,index)=>build(c,t,offset+index)),kind,[key(c,t)]);
  };

  const priorHint=window.helpfulHint;
  window.helpfulHint=helpfulHint=function(q,level){
    if(q?.id?.startsWith('LANG-'))return level===1?(q.hint||'Kaynak bağlamını ve cümle yapısını yeniden düşün.'):(q.explain||'Seçenekleri iletişim amacına göre karşılaştır.');
    return priorHint.apply(this,arguments);
  };

  function currentQuestion(){return session?.phase==='test'?session?.qs?.[session.idx]:session?.pending?.[0]}
  function sourceMap(c){return c==='Almanca'?(typeof GERMAN_MEB_PAGES!=='undefined'?GERMAN_MEB_PAGES:{}):(typeof ENGLISH_MEB_PAGES!=='undefined'?ENGLISH_MEB_PAGES:{})}
  function decorateQuestion(){
    const q=currentQuestion();if(!q?.id?.startsWith('LANG-'))return;
    const card=document.querySelector('#app .card');if(!card||card.querySelector('.language-question-v6550'))return;
    const box=document.createElement('section');box.className='language-question-v6550';
    const ref=q.sourceRef||{},key=ref.book+':'+ref.page,hasImage=!!sourceMap(q.c)[key];
    box.innerHTML=(q.audioText?'<button class="language-listen-v6550" type="button">🔊 Dinle</button>':'')+
      '<div class="language-meta-v6550"><span>'+esc(q.skillType)+'</span><span>'+esc(q.difficulty)+'</span><span>'+esc(q.outcome)+'</span></div>'+
      '<small>Kaynak: '+esc(ref.file||'MEB')+' · s. '+esc(ref.page)+' · konu aralığı '+esc((ref.range||[]).join('–'))+'</small>'+
      (hasImage?'<button class="language-source-v6550" type="button">📖 Doğru kaynak sayfasını aç</button>':'');
    box.querySelector('.language-listen-v6550')?.addEventListener('click',()=>speak(q.audioText,q.c));
    box.querySelector('.language-source-v6550')?.addEventListener('click',()=>q.c==='Almanca'?germanOpenPage(q.t,ref.book,ref.page):englishOpenPage(q.t,ref.book,ref.page));
    card.querySelector('h2')?.after(box);
  }

  const priorQuestion=window.question;
  window.question=question=function(){const result=priorQuestion.apply(this,arguments);decorateQuestion();return result};
  const priorRepair=window.repairQuestion;
  if(typeof priorRepair==='function')window.repairQuestion=repairQuestion=function(){const result=priorRepair.apply(this,arguments);decorateQuestion();return result};

  function courseStats(c){const rows=CONTENT[c]||[];return {topics:rows.length,questions:rows.reduce((sum,row)=>sum+row.questions.length,0),speaking:(SPEAKING[c]||[]).reduce((sum,row)=>sum+row.length,0)}}
  function decorateCourse(c){
    if(!isLanguage(c)||course!==c)return;
    const stats=courseStats(c),wrap=document.querySelector('.teacher-lang-wrap');if(!wrap||wrap.querySelector('.language-overview-v6550'))return;
    const overview=document.createElement('div');overview.className='language-overview-v6550';
    overview.innerHTML='<strong>🎯 Kaynak izlemeli beceri bankası</strong><p>'+stats.questions+' farklı soru · '+stats.speaking+' konuşma çalışması · Dinleme, diyalog, cümle kurma, okuma, bağlam ve dil bilgisi</p><small>Bu ders için ayrıca yüklenmiş MEB dışı okul kaynağı bulunmadı. Yeni okul kaynağı eklendiğinde öncelikli kapsama alınacaktır.</small>';
    wrap.querySelector('.teacher-lang-head')?.after(overview);
    [...wrap.querySelectorAll('.teacher-lang-topic')].slice(0,stats.topics).forEach((card,index)=>{
      if(card.querySelector('.language-topic-extra-v6550'))return;
      const row=document.createElement('div');row.className='language-topic-extra-v6550';
      row.innerHTML='<small>24 farklı soru · 3 konuşma çalışması · Kaynak ve beceri etiketli</small><button type="button">🎙️ Konuşma çalışması</button>';
      row.querySelector('button').onclick=()=>openLanguageSpeakingV6550(c,index);
      card.append(row);
    });
  }

  const priorOpen=window.openCourse;
  window.openCourse=openCourse=function(c){const result=priorOpen.apply(this,arguments);if(isLanguage(c))setTimeout(()=>decorateCourse(c),0);return result};

  window.openLanguageSpeakingV6550=function(c,t){
    const tasks=SPEAKING[c]?.[Number(t)]||[],title=CONTENT[c]?.[Number(t)]?.title||'';course=c;topic=Number(t);view='lesson';
    app.innerHTML='<div class="teacher-lang-wrap"><button class="home-red" onclick="openCourse(\\''+c+'\\')">← '+esc(c)+'</button><div class="language-speaking-v6550"><h2>🎙️ '+esc(title)+' · Konuşma çalışması</h2><p>Bu çalışma puan veya konu kilidini etkilemez. Mikrofon sonucu yalnızca anlık geri bildirimdir; ses kaydedilmez.</p>'+tasks.map((task,index)=>'<article><b>'+(index+1)+'. '+esc(task.instruction)+'</b><p>Örnek: '+esc(task.model)+'</p><div><button onclick="speak(decodeURIComponent(\\''+encodeURIComponent(task.model).replace(/'/g,'%27')+'\\'),\\''+c+'\\')">🔊 Örneği dinle</button><button onclick="languageSpeakV6550(\\''+c+'\\','+t+','+index+')">🎙️ Söyle</button></div><p id="language-speech-result-'+index+'" class="muted"></p></article>').join('')+'<button class="primary" onclick="completeLanguageSpeakingV6550(\\''+c+'\\','+t+')">Çalışmayı tamamladım</button></div></div>';
    window.scrollTo(0,0);
  };

  window.languageSpeakV6550=function(c,t,index){
    const task=SPEAKING[c]?.[t]?.[index],target=document.getElementById('language-speech-result-'+index);if(!task||!target)return;
    const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!Recognition){target.textContent='Bu cihaz ses tanımayı desteklemiyor. Örneği dinleyip kendin tekrar edebilirsin.';return}
    const recognition=new Recognition();recognition.lang=task.languageCode;recognition.interimResults=false;recognition.maxAlternatives=1;target.textContent='Dinliyorum…';
    recognition.onresult=event=>{target.textContent='Duyulan: '+event.results[0][0].transcript+' · Örnekle karşılaştır ve gerekirse yeniden dene.'};
    recognition.onerror=()=>{target.textContent='Ses anlaşılamadı. Daha yavaş ve net biçimde yeniden dene.'};recognition.start();
  };

  window.completeLanguageSpeakingV6550=function(c,t){const store=ensureState(false);store.speaking[c+'|'+t]=new Date().toISOString();store.updatedAt=new Date().toISOString();persist();openCourse(c)};

  const style=document.createElement('style');style.textContent='.language-overview-v6550{margin:14px 0;padding:15px;border:1px solid #70b99d88;border-radius:16px;background:linear-gradient(135deg,#1d5245,#29476b)}.language-overview-v6550 p{margin:7px 0}.language-topic-extra-v6550{display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-top:12px;padding-top:10px;border-top:1px solid #ffffff22}.language-topic-extra-v6550 button{margin:0}.language-question-v6550{display:grid;gap:9px;margin:12px 0;padding:12px;border:1px solid #7da9d966;border-radius:14px;background:#ffffff0b}.language-meta-v6550{display:flex;gap:6px;flex-wrap:wrap}.language-meta-v6550 span{padding:5px 9px;border-radius:999px;background:#dcecff;color:#24405f;font-size:12px;font-weight:800}.language-listen-v6550{font-size:17px;background:linear-gradient(135deg,#8758e8,#4d8bd8)!important}.language-source-v6550{justify-self:start}.language-speaking-v6550{margin-top:14px;padding:18px;border-radius:18px;background:#243249}.language-speaking-v6550 article{margin:13px 0;padding:14px;border-radius:14px;background:#ffffff0b}.language-speaking-v6550 article button{margin:8px 6px 0 0}@media(max-width:520px){.language-topic-extra-v6550{display:grid}.language-source-v6550{justify-self:stretch}.language-meta-v6550 span:last-child{width:100%}}';document.head.append(style);

  ensureState(true);
  if(isLanguage(course)&&view==='course')setTimeout(()=>decorateCourse(course),0);
  window.__DURU_LANGUAGE_V6550_TEST__={version:VERSION,content:CONTENT,speaking:SPEAKING,bank,build,courseStats,ensureState};
})();
`;

fs.writeFileSync(path.join(root, 'dist', 'language-skills-v6550.js'), runtime, 'utf8');
fs.writeFileSync(path.join(root, 'dist', 'language-coverage-v6550.json'), JSON.stringify(coverage, null, 2), 'utf8');

const rows = [];
for (const [course, topics] of Object.entries(content)) {
  topics.forEach((topic, index) => {
    rows.push(`| ${course} | ${index + 1} | ${topic.title} | ${topic.questions.length} | ${speaking[course][index].length} | ${[...new Set(topic.questions.map(q => `${q.sourceRef.book}:${q.sourceRef.page}`))].length} |`);
  });
}
const report = `# Öğretmenim V6.55.0 - Almanca ve İngilizce beceri bankası\n\nTarih: 19 Kasım 2026\n\n## Kaynak kapsamı\n\n- Almanca: 3 MEB kaynağı, 18 konu, ${coverage.courses.Almanca.questions} çoktan seçmeli soru, ${coverage.courses.Almanca.speakingTasks} konuşma çalışması.\n- İngilizce: 3 MEB kaynağı, 24 konu, ${coverage.courses.İngilizce.questions} çoktan seçmeli soru, ${coverage.courses.İngilizce.speakingTasks} konuşma çalışması.\n- Toplam: ${coverage.courses.Almanca.questions + coverage.courses.İngilizce.questions} soru ve ${coverage.courses.Almanca.speakingTasks + coverage.courses.İngilizce.speakingTasks} konuşma çalışması.\n- Her soru kaynak dosya, görünür kaynak sayfası, konu sayfa aralığı, öğrenme çıktısı, beceri ve zorluk bilgisi taşır.\n- Almanca ve İngilizce için ayrıca yüklenmiş MEB dışı okul/İELEV dosyası bulunmadığı için Okul Testi üretilmemiştir.\n\n## Beceri dağılımı\n\n${Object.entries(coverage.courses).map(([course, row]) => `### ${course}\n\n${Object.entries(row.skillDistribution).map(([skill, count]) => `- ${skill}: ${count}`).join('\n')}`).join('\n\n')}\n\n## Konu dökümü\n\n| Ders | No | Konu | Soru | Konuşma | Bağlı kaynak sayfası |\n|---|---:|---|---:|---:|---:|\n${rows.join('\n')}\n\n## Doğrulama sınırı\n\nKaynak kitapların metinleri ve konu sayfa aralıkları incelenmiş, görünür sayfa bağlantıları doğrulanmıştır. MEB kitaplarındaki her alıştırma birebir kopyalanmamıştır; öğrenme çıktıları farklı dinleme, işlevsel dil, cümle kurma, okuma ve bağlam sorularıyla ölçülmüştür. MEB dışı okul kaynağı bulunursa bu bankaya eklenmeden yüzde 100 okul kaynağı kapsamı iddia edilmeyecektir.\n`;
fs.writeFileSync(path.join(root, 'docs', 'release-v6550-language-bank.md'), report, 'utf8');

console.log(JSON.stringify(coverage, null, 2));
