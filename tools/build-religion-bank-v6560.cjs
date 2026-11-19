const fs=require('fs');
const path=require('path');
const {din,hayat}=require('./religion-profiles-v6560.cjs');

const root=path.resolve(__dirname,'..');
const indexPath=path.join(root,'dist','index.html');
const lines=fs.readFileSync(indexPath,'utf8').split(/\r?\n/);
function readConst(name){const line=lines.find(row=>row.startsWith(`const ${name}=`));if(!line)throw Error(`${name} bulunamadı`);return JSON.parse(line.slice(line.indexOf('=')+1,-1))}
const DATA=readConst('RELIGION_DATA');
const PAGES=readConst('RELIGION_PAGES');
const configs={
  'Din Kültürü':{code:'DIN',profiles:din,file:'din-kulturu-ve-ahlak-bilgisi-5sinif-ders-kitabi_20261003_183932_159.pdf',schoolSources:['din-511-eba.pdf','din-511-mebi.pdf'],schoolQuestions:24,targets:[24,24,28,20,24,32,20,18,24,22,28,18,28,32,18,24,28,24]},
  'Peygamberimizin Hayatı':{code:'PH',profiles:hayat,file:'peygamberimizin-hayati-5sinif-ders-kitabi_20261003_213845_403.pdf',schoolSources:[],schoolQuestions:0,targets:[32,22,30,28,24,28,24,22,22,26,26,22]},
};
const unique=values=>[...new Set(values.map(value=>String(value).trim()).filter(Boolean))];
function item(prompt,answer,options,skillType,extra={}){const opts=unique(options);if(opts.length!==4||opts.filter(x=>x===String(answer).trim()).length!==1)throw Error(`Geçersiz seçenek: ${prompt}`);return {prompt,answer:String(answer).trim(),options:opts,skillType,...extra}}
function manual(row,skillType){return item(row[0],row[1],row.slice(1),skillType,{origin:'source-based-original'})}
function cleanQuestion(value){return String(value||'').replace(/[?？]\s*$/,'').trim()}
function baseRows(topic){return (topic.questions||[]).filter(q=>!q.prompt.includes('cevabını gerektiren')).slice(0,5)}
function statement(q,answer=q.answer){return `${cleanQuestion(q.prompt)} — ${answer}`}
function topicRefs(topic){const refs=[];for(let p=topic.start;p<=topic.end;p+=1){const image=PAGES[`${topic.book}:${p}`];if(image)refs.push({book:topic.book,page:p,image})}if(!refs.length)throw Error(`${topic.title}: kaynak görseli yok`);return refs}

function createBank(course,topic,topicIndex,profile,allTopics,allProfiles,config){
  const base=baseRows(topic);if(base.length!==5)throw Error(`${course} ${topic.title}: beş temel soru yok`);
  const rows=[];
  base.forEach(q=>rows.push(item(q.prompt,q.answer,q.options,'knowledge',{hint:q.hint,explain:q.explain,origin:'source-adapted'})));
  profile.application.forEach(row=>rows.push(manual(row,'daily-life-application')));
  profile.reasoning.forEach(row=>rows.push(manual(row,'reasoning')));
  base.forEach((q,index)=>{
    const wrong=q.options.find(option=>option!==q.answer);
    rows.push(item(`Bir öğrenci “${wrong}” cevabını verdi. “${cleanQuestion(q.prompt)}” sorusunun doğru cevabı hangisidir?`,q.answer,q.options,'misconception-correction',{
      hint:'Yanlış cevabı konu bilgisini kullanarak düzelt.',explain:`Doğru bilgi: ${statement(q)}`,origin:'source-based-original',baseIndex:index,
    }));
  });
  base.forEach((q,index)=>{
    const pairs=q.options.map(option=>statement(q,option));
    rows.push(item(`${topic.title}: “${cleanQuestion(q.prompt)}” bilgisini denetleyen kartlardan hangisi doğrudur?`,pairs[0],pairs,'evidence-match',{
      hint:'Soru ile cevabın anlam ilişkisini birlikte kontrol et.',explain:`Doğru eşleştirme: ${pairs[0]}`,origin:'source-based-original',baseIndex:index,
    }));
  });
  const truthOptions=['Yalnız I','Yalnız II','I ve II','I ve II de yanlış'];
  base.forEach((q,index)=>{
    const next=base[(index+1)%base.length],mode=index%4;
    const first=mode===1||mode===3?statement(q,q.options.find(x=>x!==q.answer)):statement(q);
    const second=mode===0||mode===3?statement(next,next.options.find(x=>x!==next.answer)):statement(next);
    const answer=mode===0?'Yalnız I':mode===1?'Yalnız II':mode===2?'I ve II':'I ve II de yanlış';
    rows.push(item(`${topic.title} konusunda iki not verilmiştir:\nI. ${first}\nII. ${second}\nHangileri doğrudur?`,answer,truthOptions,'multi-statement',{
      hint:'İki ifadeyi birbirinden bağımsız değerlendir.',explain:`Doğru değerlendirme: ${answer}.`,origin:'source-based-original',baseIndex:index,
    }));
  });
  const otherTitles=allTopics.map(x=>x.title).filter(x=>x!==topic.title).slice((topicIndex*3)%Math.max(1,allTopics.length-4));
  const titleDistractors=unique([...otherTitles, ...allTopics.map(x=>x.title).filter(x=>x!==topic.title)]).slice(0,3);
  rows.push(item(`${topic.stages[0].body}\n\nBu kaynak parçasının ana konusu hangisidir?`,topic.title,[topic.title,...titleDistractors],'source-reading',{
    hint:'Parçada en çok açıklanan kavram ve olaylara bak.',explain:`Parçanın ana konusu ${topic.title}.`,origin:'source-adapted',readingText:topic.stages[0].body,
  }));
  const outcomes=unique(allProfiles.map(x=>x.outcome).filter(x=>x!==profile.outcome));
  rows.push(item(`${topic.stages[0].body}\n\nBu parçayı çalışan öğrencinin öncelikle hangi kazanıma ulaşması beklenir?`,profile.outcome,[profile.outcome,...outcomes.slice((topicIndex*2)%Math.max(1,outcomes.length-3)).concat(outcomes).filter((x,i,a)=>a.indexOf(x)===i).slice(0,3)],'outcome-inference',{
    hint:'Metindeki bilgi ile yapılması beklenen düşünme işlemini birlikte değerlendir.',explain:`İlgili kazanım: ${profile.outcome}`,origin:'source-adapted',readingText:topic.stages[0].body,
  }));
  rows.push(item(`${topic.title} konusundaki bilgilerin doğruluğunu denetlemek isteyen Duru için en güvenilir yol hangisidir?`,'İlgili MEB sayfasını açıp bilgi ve örnekleri karşılaştırmak',[
    'İlgili MEB sayfasını açıp bilgi ve örnekleri karşılaştırmak','Kaynağa bakmadan ilk tahmini doğru saymak','Yalnız arkadaşının hatırladığına güvenmek','Seçeneklerin en uzununu doğru kabul etmek'], 'source-literacy',{
      hint:'Bilgiyi doğrudan kaynağından doğrula.',explain:'Kaynak sayfası, konu bilgisi ve örnekleri birlikte kontrol edilmelidir.',origin:'source-based-original',
    }));
  rows.push(item(`${topic.title} konusunu günlük yaşama aktardığını en iyi gösteren çalışma hangisidir?`,'Öğrendiği ilkeyi yeni bir olayda gerekçesiyle uygulamak',[
    'Öğrendiği ilkeyi yeni bir olayda gerekçesiyle uygulamak','Cevabı anlamadan ezberlemek','Aynı seçeneği her soruda işaretlemek','Yanlış bilgiyi kontrol etmeden paylaşmak'], 'transfer',{
      hint:'Bilgiyi yeni bir durumda kullanmayı düşün.',explain:'Kazanım, bilgi yeni bir olayda doğru gerekçeyle kullanılabildiğinde güçlenir.',origin:'source-based-original',
    }));
  if(rows.length!==34)throw Error(`${course} ${topic.title}: ${rows.length} soru üretildi`);
  const priority=[0,5,10,15,20,25,30,31,1,6,11,16,21,26,2,7,12,17,22,27,3,8,13,18,23,28,4,9,14,19,24,29];
  const target=config.targets[topicIndex];
  const selected=priority.slice(0,target).map(index=>rows[index]);
  const refs=topicRefs(topic),promptSet=new Set();
  return selected.map((row,index)=>{
    const normalized=row.prompt.replace(/\s+/g,' ').trim().toLocaleLowerCase('tr-TR');if(promptSet.has(normalized))throw Error(`${course} ${topic.title}: yinelenen soru`);promptSet.add(normalized);
    const directIndex=base.findIndex(question=>question.prompt===row.prompt);
    const stagePage=directIndex>=0?topic.stages[Math.min(directIndex+1,topic.stages.length-1)]?.page:null;
    const ref=stagePage&&PAGES[`${topic.book}:${stagePage}`]?{book:topic.book,page:stagePage,image:PAGES[`${topic.book}:${stagePage}`]}:refs[index%refs.length];
    return {c:course,t:topicIndex,skill:topic.title,...row,hint:row.hint||'Kavramı, örneği ve gerekçeyi birlikte düşün.',explain:row.explain||`Doğru cevap: ${row.answer}.`,id:`RELX-${config.code}-${String(topicIndex).padStart(2,'0')}-${String(index).padStart(2,'0')}`,
      difficulty:index<10?'kolay':index<25?'orta':'zor',outcome:profile.outcome,sourceType:'MEB',schoolSource:false,
      sourceRef:{...ref,file:config.file,range:[topic.start,topic.end]},unit:topic.unit};
  });
}

const content={};
const coverage={version:'V6.56.0',generatedAt:new Date().toISOString(),courses:{}};
for(const [course,config] of Object.entries(configs)){
  const topics=DATA[course];if(topics.length!==config.profiles.length)throw Error(`${course}: profil sayısı uyuşmuyor`);
  const allPromptSet=new Set(),skills={},origins={},images=new Set();
  content[course]=topics.map((topic,index)=>{
    const questions=createBank(course,topic,index,config.profiles[index],topics,config.profiles,config);
    questions.forEach(q=>{const n=q.prompt.replace(/\s+/g,' ').trim().toLocaleLowerCase('tr-TR');if(allPromptSet.has(n))throw Error(`${course}: yinelenen soru ${q.prompt}`);allPromptSet.add(n);skills[q.skillType]=(skills[q.skillType]||0)+1;origins[q.origin]=(origins[q.origin]||0)+1;images.add(`${q.sourceRef.book}:${q.sourceRef.page}`)});
    return {unit:topic.unit,title:topic.title,outcome:config.profiles[index].outcome,start:topic.start,end:topic.end,book:topic.book,questions};
  });
  coverage.courses[course]={topics:topics.length,questions:content[course].reduce((sum,topic)=>sum+topic.questions.length,0),topicQuestionCounts:content[course].map(topic=>({title:topic.title,count:topic.questions.length})),sourceFiles:[config.file],schoolSources:config.schoolSources,schoolQuestions:config.schoolQuestions,linkedSourceImages:images.size,skillDistribution:skills,originDistribution:origins};
}

const runtime=`/* V6.56.0: Din Kültürü ve Peygamberimizin Hayatı kaynak izlemeli kazanım bankası. */
(function(){
  const VERSION='V6.56.0',CONTENT=${JSON.stringify(content)},COURSES=['Din Kültürü','Peygamberimizin Hayatı'],FIELD='religionBankV6560';
  const clone=value=>JSON.parse(JSON.stringify(value)),int=value=>Math.max(0,Math.floor(Number(value)||0)),isCourse=c=>COURSES.includes(c);
  function ensureState(save=false){state[FIELD]=state[FIELD]&&typeof state[FIELD]==='object'?state[FIELD]:{};state[FIELD].attempts=state[FIELD].attempts&&typeof state[FIELD].attempts==='object'?state[FIELD].attempts:{};state[FIELD].version=6560;if(save)persist();return state[FIELD]}
  function bank(c,t){return CONTENT[c]?.[Number(t)]?.questions||[]}
  function build(c,t,n){const rows=bank(c,t);if(!rows.length)throw Error(c+' konu bankası bulunamadı');const q=clone(rows[((Number(n)%rows.length)+rows.length)%rows.length]),shift=Math.abs(int(n))%4;q.options=q.options.slice(shift).concat(q.options.slice(0,shift));return q}
  const priorMake=window.makeQuestion;window.makeQuestion=makeQuestion=function(c,t,n){return isCourse(c)?build(c,t,n):priorMake.apply(this,arguments)};
  const priorQuiz=window.startQuiz;window.startQuiz=startQuiz=function(c,t,kind){kind=String(kind||'normal');if(!isCourse(c)||!['normal','extra'].includes(kind))return priorQuiz.apply(this,arguments);t=Number(t);const flow=window.__DURU_V6521_TEST_FLOW__;if(flow?.resumeForStart?.(c,t,kind))return true;if(t>0&&!unlockedAfter(c,t-1)){alert('Önce önceki konunun zorunlu testini tamamla.');return openCourse(c)}if(kind==='extra'&&!done(c,t)){alert('Ekstra test için önce konu testini tamamla.');return openCourse(c)}course=c;topic=t;const store=ensureState(false),attemptKey=c+'|'+t+'|'+kind,attempt=int(store.attempts[attemptKey]),offset=(attempt*10+(kind==='extra'?5:0))%bank(c,t).length;store.attempts[attemptKey]=attempt+1;store.updatedAt=new Date().toISOString();persist();startSession(Array.from({length:10},(_,i)=>build(c,t,offset+i)),kind,[key(c,t)])};
  const priorHint=window.helpfulHint;window.helpfulHint=helpfulHint=function(q,level){if(q?.id?.startsWith('RELX-'))return level===1?(q.hint||'Kavramı, örneği ve gerekçeyi birlikte düşün.'):(q.explain||'Kaynak bilgisini günlük durumla ilişkilendir.');return priorHint.apply(this,arguments)};
  function currentQuestion(){return session?.phase==='test'?session?.qs?.[session.idx]:session?.pending?.[0]}
  function decorateQuestion(){const q=currentQuestion();if(!q?.id?.startsWith('RELX-'))return;const card=document.querySelector('#app .card');if(!card||card.querySelector('.religion-question-v6560'))return;const r=q.sourceRef||{},box=document.createElement('section');box.className='religion-question-v6560';box.innerHTML='<div class="religion-meta-v6560"><span>'+esc(q.skillType)+'</span><span>'+esc(q.difficulty)+'</span><span>'+esc(q.outcome)+'</span></div><small>Kaynak: '+esc(r.file||'MEB')+' · s. '+esc(r.page)+' · konu aralığı '+esc((r.range||[]).join('–'))+'</small><button class="religion-source-v6560" type="button">📖 Doğru kaynak sayfasını aç</button>';box.querySelector('button').onclick=()=>relOpenPage(q.c,q.t,r.page);card.querySelector('h2')?.after(box)}
  const priorQuestion=window.question;window.question=question=function(){const result=priorQuestion.apply(this,arguments);decorateQuestion();return result};const priorRepair=window.repairQuestion;if(typeof priorRepair==='function')window.repairQuestion=repairQuestion=function(){const result=priorRepair.apply(this,arguments);decorateQuestion();return result};
  function stats(c){const rows=CONTENT[c]||[];return {topics:rows.length,questions:rows.reduce((n,x)=>n+x.questions.length,0)}}
  function decorateCourse(c){if(!isCourse(c)||course!==c||document.querySelector('.religion-overview-v6560'))return;const root=document.querySelector('.rel-block,.teacher-lang-wrap')||app,head=root.querySelector('.rel-top,.teacher-lang-head,h1'),s=stats(c),box=document.createElement('section');box.className='religion-overview-v6560';box.innerHTML='<strong>🎯 Kaynak izlemeli kazanım bankası</strong><p>'+s.questions+' farklı soru · '+s.topics+' konu · Bilgi, vaka, çıkarım, kanıt ve çoklu önerme</p><small>'+(c==='Din Kültürü'?'EBA ve MEBİ okul kaynaklarındaki 24 soru ilk üniteyle eşleştirilerek ayrıca korunmuştur.':'Bu ders için ayrıca yüklenmiş MEB dışı okul materyali bulunmamaktadır.')+'</small>';head?.after(box);[...root.querySelectorAll('.rel-item')].slice(0,s.topics).forEach((card,index)=>{if(card.querySelector('.religion-topic-count-v6560'))return;const note=document.createElement('small');note.className='religion-topic-count-v6560';note.textContent=(CONTENT[c]?.[index]?.questions?.length||0)+' farklı soru · 8 beceri türü';card.append(note)})}
  const priorOpen=window.openCourse;window.openCourse=openCourse=function(c){const result=priorOpen.apply(this,arguments);if(isCourse(c))setTimeout(()=>decorateCourse(c),0);return result};
  const style=document.createElement('style');style.textContent='.religion-overview-v6560{margin:14px 0;padding:15px;border:1px solid #65c3b388;border-radius:16px;background:linear-gradient(135deg,#174b46,#3a3f68)}.religion-overview-v6560 p{margin:7px 0}.religion-question-v6560{display:grid;gap:9px;margin:12px 0;padding:12px;border:1px solid #72b9ab66;border-radius:14px;background:#ffffff0b}.religion-meta-v6560{display:flex;gap:6px;flex-wrap:wrap}.religion-meta-v6560 span{padding:5px 9px;border-radius:999px;background:#dcf5e9;color:#214c40;font-size:12px;font-weight:800}.religion-source-v6560{justify-self:start}@media(max-width:520px){.religion-source-v6560{justify-self:stretch}.religion-meta-v6560 span:last-child{width:100%}}';document.head.append(style);ensureState(true);
  window.__DURU_RELIGION_V6560__={version:VERSION,content:CONTENT,bank,build,stats};
})();`;

fs.writeFileSync(path.join(root,'dist','religion-skills-v6560.js'),runtime,'utf8');
fs.writeFileSync(path.join(root,'dist','religion-coverage-v6560.json'),JSON.stringify(coverage,null,2)+'\n','utf8');
const rows=Object.entries(coverage.courses).map(([course,row])=>`| ${course} | ${row.topics} | ${row.questions} | ${row.schoolQuestions} | ${row.linkedSourceImages} |`).join('\n');
const total=Object.values(coverage.courses).reduce((sum,row)=>sum+row.questions,0);
const topicRows=Object.entries(coverage.courses).flatMap(([course,row])=>row.topicQuestionCounts.map((topic,index)=>`| ${course} | ${index+1} | ${topic.title} | ${topic.count} |`)).join('\n');
const sourceAdapted=Object.values(coverage.courses).reduce((sum,row)=>sum+(row.originDistribution['source-adapted']||0),0),original=total-sourceAdapted;
const report=`# Öğretmenim V6.56.0 - Din dersleri kazanım bankası\n\nTarih: 19 Kasım 2026\n\n| Ders | Konu | Yenilenmiş havuz | Okul sorusu | Bağlı MEB sayfası |\n|---|---:|---:|---:|---:|\n${rows}\n\nToplam 30 konu için ${total} soruluk yenilenmiş havuz hazırlanmıştır: ${sourceAdapted} temel soru kaynak bilgisinden uyarlanmış, ${original} soru ise kaynak kazanımlarına dayalı özgün vaka ve akıl yürütme sorusudur. Konu havuzları kapsamlarına göre 18–32 soru arasında değişir; tek bir yapay sayıya tamamlanmamıştır. Her soru kaynak dosya, sayfa, konu aralığı, kazanım, beceri ve zorluk bilgisi taşır. Soru türleri doğrudan bilgiyle sınırlı değildir; günlük yaşam uygulaması, akıl yürütme, yanlış bilgiyi düzeltme, kanıt eşleştirme, çoklu önerme ve metinden kazanım çıkarmayı kapsar.\n\n## Konu bazında soru sayıları\n\n| Ders | No | Konu | Soru |\n|---|---:|---|---:|\n${topicRows}\n\n## Pedagojik karar\n\nSayı yerine kazanım kapsamı esas alınmıştır. İyi tasarlanmış kısa ustalık ölçümleri ve geri bildirimli tekrarlar, aynı oturumda çok sayıda benzer soru çözmekten daha değerlidir. Bu nedenle dar kapsamlı dua ve sure konularında 18–20; birden çok kavram, olay veya aşama içeren konularda 24–32 farklı soru kullanılmıştır. Sorular 10'arlı oturumlarla döner; yanlışlar GTT/GDS ve uygulamanın aralıklı tekrar sistemiyle yeniden gelir.\n\nDin Kültürü için mevcut EBA ve MEBİ dosyalarındaki 24 okul sorusu yalnız içerikle eşleşen ilk ünitede korunmuştur. Peygamberimizin Hayatı için MEB dışı okul materyali bulunmadığından okul sorusu üretilmemiştir.\n`;
fs.writeFileSync(path.join(root,'docs','release-v6560-religion-bank.md'),report,'utf8');
console.log(JSON.stringify(coverage,null,2));
