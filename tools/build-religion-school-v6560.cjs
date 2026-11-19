const fs=require('fs');
const path=require('path');
const additions=require('./religion-school-profiles-v6560.cjs');
const root=path.resolve(__dirname,'..');
if(additions.length!==4||additions.some(rows=>rows.length!==14))throw Error('Her ilk ünite konusu için 14 ek soru gerekli');
const prompts=new Set();
additions.forEach((rows,topicIndex)=>rows.forEach((row,index)=>{
  if(!row.prompt||!row.answer||!['EBA','MEBI'].includes(row.source)||!row.page)throw Error(`${topicIndex}/${index}: eksik alan`);
  if(row.options.length!==4||new Set(row.options).size!==4||row.options.filter(option=>option===row.answer).length!==1)throw Error(`${topicIndex}/${index}: seçenek hatası`);
  const normalized=row.prompt.replace(/\s+/g,' ').trim().toLocaleLowerCase('tr-TR');if(prompts.has(normalized))throw Error(`Yinelenen soru: ${row.prompt}`);prompts.add(normalized);
}));

const runtime=`/* V6.56.0: Din Kültürü EBA + MEBİ okul soru bankası genişletmesi. */
(function(){
  const COURSE='Din Kültürü',ADDITIONS=${JSON.stringify(additions)},SOURCES={EBA:{file:'./assets/din-511-eba.pdf',label:'511 EBA · Açık Uçlu Çalışma Soruları'},MEBI:{file:'./assets/din-511-mebi.pdf',label:'511 MEBİ · Yazılıya Hazırlanıyorum'}};
  const previous=window.__DURU_DIN_511_TEST__;if(!previous?.school)return;
  const baseSchool=previous.school.bind(previous);
  function extra(topicIndex){return (ADDITIONS[Number(topicIndex)]||[]).map((row,index)=>({c:COURSE,t:Number(topicIndex),skill:(typeof RELIGION_DATA==='object'?RELIGION_DATA[COURSE]?.[Number(topicIndex)]?.title:'')||'Din Kültürü',prompt:row.prompt,answer:row.answer,options:row.options.slice(),hint:'EBA/MEBİ kaynak örneğini ve kavramın günlük yaşamdaki karşılığını düşün.',explain:'Doğru cevap: '+row.answer+'. Bu soru '+SOURCES[row.source].label+' belgesinin '+row.page+'. sayfasındaki içerik ve öğrenme çıktısından oluşturuldu.',sourceRef:{source:row.source,page:row.page,file:SOURCES[row.source].file},sourceType:'school',schoolSource:true,origin:'school-source-original',din511Source:true,id:'DIN-511X-'+topicIndex+'-'+index}))}
  window.__DURU_DIN_511_TEST__={...previous,version:'2026-11-19-v6560',school(courseName,topicIndex){if(courseName!==COURSE||Number(topicIndex)<0||Number(topicIndex)>3)return[];return baseSchool(courseName,Number(topicIndex)).concat(extra(Number(topicIndex)))},additions:ADDITIONS};
  function preserveCompleted(){state.completedSchoolTestsV6519=state.completedSchoolTestsV6519&&typeof state.completedSchoolTestsV6519==='object'?state.completedSchoolTestsV6519:{};state.din511SourceGttEligibleV6514=state.din511SourceGttEligibleV6514&&typeof state.din511SourceGttEligibleV6514==='object'?state.din511SourceGttEligibleV6514:{};let changed=false;for(let t=0;t<4;t+=1){const base=COURSE+'|'+t,first=base+'|0',second=base+'|1';if(state.done?.[base]&&state.completedSchoolTestsV6519[first]&&!state.completedSchoolTestsV6519[second]){state.completedSchoolTestsV6519[second]=new Date().toISOString();state.din511SourceGttEligibleV6514[base]=true;changed=true}}if(changed)persist()}
  function patchCards(){if(course!==COURSE||view!=='course')return;[...document.querySelectorAll('.din511-course-source')].slice(0,4).forEach(box=>{const p=box.querySelector('p');if(p)p.textContent='Bu konu için 20 farklı okul sorusu ve 2 adet 10 soruluk Okul Testi.'})}
  preserveCompleted();const priorOpen=window.openCourse;window.openCourse=openCourse=function(name){const result=priorOpen.apply(this,arguments);if(name===COURSE)setTimeout(patchCards,0);return result};if(view==='course'&&course===COURSE)patchCards();
  window.__DURU_RELIGION_SCHOOL_V6560__={version:'V6.56.0',additions:ADDITIONS,school:window.__DURU_DIN_511_TEST__.school};
})();`;
fs.writeFileSync(path.join(root,'dist','religion-school-v6560.js'),runtime,'utf8');
console.log(JSON.stringify({topics:additions.length,added:additions.flat().length,totalSchool:80,testsPerTopic:2},null,2));
