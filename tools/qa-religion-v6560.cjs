const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const modules=process.env.CODEX_BUNDLED_NODE_MODULES||'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const {chromium}=require(path.join(modules,'playwright'));
const assert=(value,message)=>{if(!value)throw Error(message)};

(async()=>{
  const root=path.resolve(__dirname,'..');
  const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const context=await browser.newContext({viewport:{width:390,height:844}});
  await context.addInitScript(()=>{window.__DURU_SYNC_TEST_MODE__=true;localStorage.clear();localStorage.setItem('duru_teacher_reset_v6_5',JSON.stringify({points:417,done:{'Din Kültürü|0':'2026-11-10T10:00:00.000Z'},history:{},scores:{},mistakes:{},badges:['first'],badgeDesigns:{first:{color:'#123456'}},collection:{kept:true},migrations:{mathOfficialV67:true},completedSchoolTestsV6519:{'Din Kültürü|0|0':'2026-11-10T11:00:00.000Z'},wrongQuestionLogV651:[],wrongGttMasteryV6519:{},unlockAllV651:true}))});
  const page=await context.newPage(),errors=[],alerts=[];page.on('pageerror',error=>errors.push(error.message));page.on('dialog',async dialog=>{alerts.push(dialog.message());await dialog.accept()});
  const url=process.env.QA_URL||pathToFileURL(path.join(root,'dist','index.html')).href;
  const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});if(url.startsWith('http'))assert(response?.ok(),'Canlı uygulama açılamadı');
  await page.waitForFunction(()=>!!window.__DURU_RELIGION_V6560__&&!!window.__DURU_V651_TEST__,undefined,{timeout:60000});
  const audit=await page.evaluate(async()=>{
    const api=window.__DURU_RELIGION_V6560__,invalid=[],globalPrompts=new Map(),summary={};
    for(const courseName of ['Din Kültürü','Peygamberimizin Hayatı']){
      const rows=api.content[courseName]||[],skills={},topicRows=[];
      rows.forEach((topic,topicIndex)=>{
        const local=new Set(),sourcePages=new Set();
        topic.questions.forEach((q,questionIndex)=>{
          const label=`${courseName}/${topicIndex+1}/${questionIndex+1}`,normalized=q.prompt.replace(/\s+/g,' ').trim().toLocaleLowerCase('tr-TR');
          if(!q.prompt||!q.answer||!q.hint||!q.explain)invalid.push(`${label}: metin/ipucu/açıklama eksik`);
          if(!Array.isArray(q.options)||q.options.length!==4||new Set(q.options).size!==4||q.options.filter(option=>option===q.answer).length!==1)invalid.push(`${label}: seçenek yapısı bozuk`);
          if(!q.sourceRef?.file||!q.sourceRef?.page||!q.sourceRef?.image||!q.outcome||!q.skillType||!q.difficulty)invalid.push(`${label}: kaynak/kazanım/beceri/zorluk eksik`);
          if(q.sourceType!=='MEB'||q.schoolSource!==false)invalid.push(`${label}: kaynak türü yanlış`);
          if(local.has(normalized))invalid.push(`${label}: konu içi tekrar`);local.add(normalized);
          if(globalPrompts.has(normalized))invalid.push(`${label}: genel tekrar (${globalPrompts.get(normalized)})`);else globalPrompts.set(normalized,label);
          skills[q.skillType]=(skills[q.skillType]||0)+1;sourcePages.add(`${q.sourceRef.book}:${q.sourceRef.page}`);
        });
        topicRows.push({title:topic.title,count:topic.questions.length,skills:[...new Set(topic.questions.map(q=>q.skillType))],sources:sourcePages.size});
      });
      summary[courseName]={topics:rows.length,questions:rows.reduce((sum,row)=>sum+row.questions.length,0),skills,topicRows};
    }
    const school={},schoolPrompts=new Set(),schoolInvalid=[],schoolOriginal=[];for(const courseName of ['Din Kültürü','Peygamberimizin Hayatı'])school[courseName]=(topics[courseName]||[]).map((_,index)=>{const rows=window.__DURU_V651_TEST__.schoolQuestions(courseName,index);rows.forEach((q,questionIndex)=>{const label=`${courseName}/${index+1}/${questionIndex+1}`,normalized=String(q.prompt||'').replace(/\s+/g,' ').trim().toLocaleLowerCase('tr-TR');if(!q.prompt||!q.answer||!Array.isArray(q.options)||q.options.length!==4||new Set(q.options).size!==4||q.options.filter(option=>option===q.answer).length!==1)schoolInvalid.push(label);if(schoolPrompts.has(normalized)||globalPrompts.has(normalized))schoolInvalid.push(`${label}: tekrar`);schoolPrompts.add(normalized);if(String(q.id||'').startsWith('DIN-511X-'))schoolOriginal.push(q.id)});return rows.length});
    const schoolParts=(topics['Din Kültürü']||[]).map((_,index)=>window.__DURU_V651_TEST__.schoolTestCount('Din Kültürü',index));
    openCourse('Din Kültürü');await new Promise(resolve=>setTimeout(resolve,0));
    const dinOverview=document.querySelector('.religion-overview-v6560')?.textContent||'',dinTopicCounts=[...document.querySelectorAll('.religion-topic-count-v6560')].map(x=>x.textContent);
    startQuiz('Din Kültürü',0,'normal');const firstIds=session.qs.map(q=>q.id);session.idx=2;question();
    const sourceText=document.querySelector('.religion-question-v6560')?.textContent||'',expectedDinSource=session.qs[2].sourceRef.image;
    document.querySelector('.religion-source-v6560')?.click();const openedDinSource=document.querySelector('#rel-modal img')?.getAttribute('src')||'';document.getElementById('rel-modal')?.remove();
    exitTestV617();delete state.pendingSession;state.optionalRetrySessionsV6516={};localStorage.removeItem('duru_teacher_active_test_v617');session=null;persist();
    startQuiz('Din Kültürü',0,'normal');const secondIds=session.qs.map(q=>q.id);exitTestV617();
    delete state.pendingSession;state.optionalRetrySessionsV6516={};localStorage.removeItem('duru_teacher_active_test_v617');session=null;persist();
    openCourse('Peygamberimizin Hayatı');await new Promise(resolve=>setTimeout(resolve,0));const hayatOverview=document.querySelector('.religion-overview-v6560')?.textContent||'',hayatTopicCounts=[...document.querySelectorAll('.religion-topic-count-v6560')].map(x=>x.textContent);
    startQuiz('Peygamberimizin Hayatı',0,'normal');session.idx=2;question();const expectedHayatSource=session.qs[2].sourceRef.image;document.querySelector('.religion-source-v6560')?.click();const openedHayatSource=document.querySelector('#rel-modal img')?.getAttribute('src')||'';document.getElementById('rel-modal')?.remove();
    const syncMerged=window.__DURU_SYNC_V646_TEST__.conservativeInitialMerge({appState:{religionBankV6560:{attempts:{'Din Kültürü|0|normal':1},updatedAt:'2026-11-18T10:00:00.000Z'}},aux:{}},{appState:{religionBankV6560:{attempts:{'Din Kültürü|0|normal':3,'Peygamberimizin Hayatı|0|normal':2},updatedAt:'2026-11-19T10:00:00.000Z'}},aux:{}}).appState.religionBankV6560;
    return {title:document.title,summary,invalid,school,schoolInvalid,schoolOriginal:schoolOriginal.length,schoolParts,migratedSecondSchool:!!state.completedSchoolTestsV6519['Din Kültürü|0|1'],ui:{dinOverview,hayatOverview,dinTopicCounts,hayatTopicCounts,sourceText,expectedDinSource,openedDinSource,expectedHayatSource,openedHayatSource},rotation:{firstIds,secondIds,same:firstIds.join('|')===secondIds.join('|')},syncMerged,preserved:{points:state.points,badge:state.badges.includes('first'),badgeDesign:!!state.badgeDesigns.first,collection:!!state.collection.kept},width:document.documentElement.scrollWidth,innerWidth};
  });
  assert(audit.title.includes('V6.56.0'),'Sürüm başlığı yanlış');
  assert(!audit.invalid.length,`Soru bankası hataları: ${audit.invalid.slice(0,10).join(' | ')}`);
  assert(audit.summary['Din Kültürü'].topics===18&&audit.summary['Din Kültürü'].questions===436,'Din Kültürü sayıları yanlış');
  assert(audit.summary['Peygamberimizin Hayatı'].topics===12&&audit.summary['Peygamberimizin Hayatı'].questions===306,'Peygamberimizin Hayatı sayıları yanlış');
  for(const courseName of ['Din Kültürü','Peygamberimizin Hayatı']){
    const row=audit.summary[courseName];assert(row.topicRows.every(topic=>topic.count>=18&&topic.count<=32),`${courseName}: konu havuzu sınırı yanlış`);assert(row.topicRows.every(topic=>topic.skills.length>=8),`${courseName}: beceri çeşitliliği eksik`);
    for(const skill of ['knowledge','daily-life-application','reasoning','misconception-correction','evidence-match','multi-statement','source-reading','outcome-inference'])assert(row.skills[skill]>0,`${courseName}: ${skill} yok`);
  }
  assert(audit.school['Din Kültürü'].reduce((a,b)=>a+b,0)===80&&audit.school['Din Kültürü'].slice(0,4).every(count=>count===20)&&audit.school['Din Kültürü'].slice(4).every(count=>count===0),'Din okul soruları doğru konularla sınırlı değil');
  assert(!audit.schoolInvalid.length&&audit.schoolOriginal===56,'Okul soru bankasında tekrar, seçenek veya özgün soru sayısı hatası var');
  assert(audit.schoolParts.slice(0,4).every(count=>count===2)&&audit.schoolParts.slice(4).every(count=>count===0),'İlk dört konuda ikişer Okul Testi oluşmadı');
  assert(audit.migratedSecondSchool,'Tamamlanmış eski konu yeni Okul Testi nedeniyle yeniden kilitlendi');
  assert(audit.school['Peygamberimizin Hayatı'].every(count=>count===0),'Olmayan Peygamberimizin Hayatı okul sorusu üretilmiş');
  assert(/436 farklı soru/.test(audit.ui.dinOverview)&&/306 farklı soru/.test(audit.ui.hayatOverview),'Ders özetleri yanlış');
  assert(audit.ui.dinTopicCounts.length===18&&audit.ui.hayatTopicCounts.length===12&&audit.ui.dinTopicCounts.every(text=>/farklı soru/.test(text)),'Konu bazında soru sayıları görünmüyor');
  assert(/Kaynak:/.test(audit.ui.sourceText),'Soru kaynak bilgisi görünmüyor');
  assert(audit.ui.openedDinSource===audit.ui.expectedDinSource,'Din kaynak düğmesi yanlış sayfayı açtı');
  assert(audit.ui.openedHayatSource===audit.ui.expectedHayatSource,'Peygamberimizin Hayatı kaynak düğmesi yanlış sayfayı açtı');
  assert(!audit.rotation.same,'İkinci Din testinde aynı 10 soru açıldı');
  assert(audit.syncMerged.attempts['Din Kültürü|0|normal']===3&&audit.syncMerged.attempts['Peygamberimizin Hayatı|0|normal']===2,'Din bankası eşitlemede korunmadı');
  assert(audit.preserved.points===417&&audit.preserved.badge&&audit.preserved.badgeDesign&&audit.preserved.collection,'Öğrenci verileri korunmadı');
  assert(audit.width<=audit.innerWidth,`Mobil yatay taşma var: ${audit.width}/${audit.innerWidth}`);
  const content=await page.evaluate(()=>window.__DURU_RELIGION_V6560__.content),missing=[],nearDuplicates=[];
  const tokens=value=>new Set(String(value).toLocaleLowerCase('tr-TR').replace(/[^a-zçğıöşü0-9]+/g,' ').split(/\s+/).filter(word=>word.length>2));
  for(const [courseName,topics] of Object.entries(content))for(const topic of topics){for(const q of topic.questions){const file=path.join(root,'dist',q.sourceRef.image.replace(/^\.\//,''));if(!fs.existsSync(file))missing.push(file)}for(let i=0;i<topic.questions.length;i+=1)for(let j=i+1;j<topic.questions.length;j+=1){const a=tokens(topic.questions[i].prompt),b=tokens(topic.questions[j].prompt),intersection=[...a].filter(token=>b.has(token)).length,score=intersection/(a.size+b.size-intersection);if(score>=0.82)nearDuplicates.push(`${courseName}/${topic.title}/${i+1}-${j+1}:${score.toFixed(2)}`)}}
  assert(!nearDuplicates.length,`Anlamca aşırı benzer sorular: ${nearDuplicates.slice(0,8).join(' | ')}`);
  assert(!missing.length,`Eksik kaynak görselleri: ${missing.slice(0,5).join(', ')}`);assert(!alerts.length,`Beklenmeyen uyarılar: ${alerts.join(' | ')}`);assert(!errors.length,`Tarayıcı hataları: ${errors.join(' | ')}`);
  if(process.env.QA_SCREENSHOT){await page.evaluate(()=>{state.optionalRetrySessionsV6516={};localStorage.removeItem('duru_teacher_active_test_v617');delete state.pendingSession;session=null;persist();openCourse('Din Kültürü');startQuiz('Din Kültürü',0,'normal');session.idx=2;question()});await page.screenshot({path:path.resolve(process.env.QA_SCREENSHOT),fullPage:true})}
  console.log(JSON.stringify({url,audit,missingAssets:missing,alerts,errors},null,2));await browser.close();
})().catch(error=>{console.error(error.stack||error);process.exitCode=1});
