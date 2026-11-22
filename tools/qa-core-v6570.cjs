const path=require('node:path');
const {pathToFileURL}=require('node:url');
const modules=process.env.CODEX_BUNDLED_NODE_MODULES||'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const {chromium}=require(path.join(modules,'playwright'));
const fail=message=>{throw new Error(message)};

(async()=>{
  const root=path.resolve(__dirname,'..'),browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'}),page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{
    window.__DURU_SYNC_TEST_MODE__=true;localStorage.clear();
    localStorage.setItem('duru_teacher_reset_v6_5',JSON.stringify({points:247,done:{'Matematik|0':'2026-11-01T10:00:00.000Z','Fen Bilimleri|0':'2026-11-01T10:00:00.000Z'},completedSchoolTestsV6519:{'Matematik|0|0':'2026-11-01T10:00:00.000Z','Fen Bilimleri|0|0':'2026-11-01T10:00:00.000Z'},schoolNewQuestionEligibleV6513:{'Matematik|0':true,'Fen Bilimleri|0':true},turkishV6520:{completed:{'ilelev-nokta-virgul':'2026-11-01T10:00:00.000Z'},schoolDone:{'ilelev-nokta-virgul':{0:'2026-11-01T10:00:00.000Z'}}},migrations:{mathOfficialV67:true},badges:['first'],collection:{'001':true}}));
  });
  const url=process.env.QA_URL||pathToFileURL(path.join(root,'dist','index.html')).href;
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>!!window.__DURU_CORE_V6570__,undefined,{timeout:60000});
  const audit=await page.evaluate(()=>{
    const api=window.__DURU_CORE_V6570__,norm=v=>String(v||'').toLocaleLowerCase('tr-TR').replace(/[^a-zçğıöşü0-9]+/g,' ').trim(),words=v=>new Set(norm(v).split(' ').filter(x=>x.length>2));
    const courses={},invalid=[],duplicates=[],near=[];
    for(const c of ['Matematik','Fen Bilimleri','Sosyal Bilgiler']){
      courses[c]=[];
      for(let t=0;t<(topics[c]||[]).length;t++){
        const bank=api.normalBank(c,t),seen=new Set();bank.forEach((q,i)=>{if(!q.prompt||q.options?.length!==4||new Set(q.options||[]).size!==4||(q.options||[]).filter(x=>x===q.answer).length!==1||!q.sourceRef||!q.skill||!q.difficulty)invalid.push(c+'|'+t+'|'+i);const key=norm(q.prompt);if(seen.has(key))duplicates.push(c+'|'+t+'|'+key);seen.add(key)});
        for(let i=0;i<bank.length;i++)for(let j=i+1;j<bank.length;j++){const a=words(bank[i].prompt),b=words(bank[j].prompt),u=new Set([...a,...b]),inter=[...a].filter(x=>b.has(x)).length,score=u.size?inter/u.size:0;if(score>=.9)near.push({c,t,i,j,score:Number(score.toFixed(2))})}
        courses[c].push({title:topics[c][t][0],normal:bank.length,school:window.__DURU_V651_TEST__.schoolQuestions(c,t).length,schoolTests:window.__DURU_V651_TEST__.schoolTestCount(c,t)});
      }
    }
    const tr=window.__DURU_TURKISH_V6520_TEST__,trRows=tr.curriculum.map((item,index)=>({group:item.group,title:item.title,normal:item.topicQuestions.length,school:tr.schoolParts(index).flat().length,schoolTests:tr.schoolParts(index).length}));
    return {title:document.title,courses,turkish:trRows,summary:api.summary(),invalid,duplicates,near:near.slice(0,20),nearCount:near.length,additions:{school:Object.fromEntries(Object.entries(api.schoolAdd).map(([k,v])=>[k,v.length])),turkish:api.trAdded.length},migration:{mathDone:state.done?.['Matematik|0'],mathKeys:Object.keys(state.completedSchoolTestsV6519||{}).filter(k=>k.startsWith('Matematik|0')),mathSecond:!!state.completedSchoolTestsV6519['Matematik|0|1'],fenSecond:!!state.completedSchoolTestsV6519['Fen Bilimleri|0|1'],turkishSecond:!!state.turkishV6520.schoolDone?.['ilelev-nokta-virgul']?.[1]},preserved:{points:state.points,badge:state.badges.includes('first'),collection:!!state.collection['001']},width:document.documentElement.scrollWidth,innerWidth:innerWidth};
  });
  const sourceUi=await page.evaluate(()=>{
    state.unlockAllV651=true;persist();
    const cases=[['Matematik',0,'#meb-source-overlay-v618 img'],['Fen Bilimleri',0,'#fen-source-modal img'],['Sosyal Bilgiler',0,'#social-modal img'],['Türkçe',16,'#turk-modal img']],out={};
    for(const [name,index,selector] of cases){
      localStorage.removeItem('duru_teacher_active_test_v617');delete state.pendingSession;session=null;
      startQuiz(name,index,'normal');question();
      const button=document.querySelector('.core-source-v6570 button'),label=button?.textContent||'';button?.click();
      const image=document.querySelector(selector);out[name]={label,src:image?.getAttribute('src')||''};
      document.querySelector('#meb-source-overlay-v618,#fen-source-modal,#social-modal,#turk-modal')?.remove();
    }
    return out;
  });
  if(!/V6\.59\.0/.test(audit.title))fail('Sürüm başlığı yanlış');
  if(audit.invalid.length||audit.duplicates.length)fail(JSON.stringify({invalid:audit.invalid,duplicates:audit.duplicates},null,2));
  if(audit.courses['Matematik'].some(x=>x.normal<15))fail('Matematik normal havuzu 15 sorudan az: '+JSON.stringify(audit.courses['Matematik'].filter(x=>x.normal<15)));
  if(audit.courses['Fen Bilimleri'].some(x=>x.normal<30))fail('Fen normal havuzu 30 sorudan az');
  if(audit.courses['Sosyal Bilgiler'].some(x=>x.normal<28))fail('Sosyal normal havuzu 28 sorudan az: '+JSON.stringify(audit.courses['Sosyal Bilgiler'].filter(x=>x.normal<28)));
  if(audit.turkish.filter(x=>x.group==='MEB Kaynakları').some(x=>x.normal<20))fail('Türkçe MEB havuzu 20 sorudan az');
  if(audit.summary.Matematik.schoolQuestions<=308||audit.summary['Fen Bilimleri'].schoolQuestions<=40||audit.summary.Türkçe.schoolQuestions<=712)fail('Okul havuzu büyümedi');
  if(!audit.migration.mathSecond||!audit.migration.fenSecond||!audit.migration.turkishSecond)fail('Tamamlanmış konu koruması başarısız: '+JSON.stringify(audit.migration));
  if(audit.preserved.points!==247||!audit.preserved.badge||!audit.preserved.collection)fail('Öğrenci kaydı korunmadı');
  if(audit.width>audit.innerWidth||errors.length)fail(JSON.stringify({width:audit.width,innerWidth:audit.innerWidth,errors},null,2));
  if(Object.values(sourceUi).some(row=>!row.label.includes('İlgili MEB konu sayfasını aç')||!row.src))fail('MEB kaynak düğmesi veya sayfa önizlemesi eksik: '+JSON.stringify(sourceUi));
  console.log(JSON.stringify({...audit,sourceUi,errors},null,2));await browser.close();
})().catch(error=>{console.error(error.stack||error);process.exitCode=1});
