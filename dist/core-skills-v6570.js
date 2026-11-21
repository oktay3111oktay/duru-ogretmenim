/* V6.57.0: Matematik, Türkçe, Fen ve Sosyal için MEB odaklı dönen bankalar ve okul kaynağı genişletmesi. */
(function(){
  'use strict';
  const COURSES=['Matematik','Türkçe','Fen Bilimleri','Sosyal Bilgiler'];
  const clone=value=>JSON.parse(JSON.stringify(value));
  const norm=value=>String(value||'').normalize('NFKC').toLocaleLowerCase('tr-TR').replace(/[^a-zçğıöşü0-9]+/g,' ').trim();
  const structure=value=>norm(value).replace(/\b\d+(?:\s+\d+)?\b/g,'#');
  const qid=q=>norm((q.c||'')+'|'+Number(q.t)+'|'+q.prompt+'|'+q.answer);
  const valid=(q,c,t)=>q&&String(q.prompt||'').trim()&&Array.isArray(q.options)&&q.options.length===4&&new Set(q.options.map(String)).size===4&&q.options.filter(x=>String(x)===String(q.answer)).length===1?{...clone(q),c,t:Number(t)}:null;
  const unique=(rows,c,t)=>{const seen=new Set(),out=[];(rows||[]).forEach(raw=>{const q=valid(raw,c,t);if(!q)return;const id=norm(q.prompt);if(seen.has(id))return;seen.add(id);out.push(q)});return out};
  const rotate=(rows,offset,count=10)=>{const out=[];for(let i=0;i<Math.min(count,rows.length);i++)out.push(clone(rows[(offset+i)%rows.length]));return out};
  const difficulty=i=>i%5===0?'zor':i%2?'orta':'kolay';
  const inferSkill=row=>{const text=norm(row?.prompt);if(/\bi\b.*\bii\b/.test(text))return'multi-statement';if(/yanlis|yanlıs|yanlıştır|hata|duzelt/.test(text))return'misconception-correction';if(/neden|cikarim|çıkarım|yorum|gerekce|gerekçe/.test(text))return'reasoning';if(/hesap|sonucu|kactir|kaçtır|uzunluk|alan|cevre|çevre|olcu|ölçü/.test(text))return'application';return'knowledge'};

  function sourceMeta(course,t){
    if(course==='Matematik'){
      const row=typeof MATH_MEB_OUTCOMES!=='undefined'?MATH_MEB_OUTCOMES[t]:null,code=row?.[0]||'',label=typeof MATH_BOOK_PAGES==='object'?MATH_BOOK_PAGES[code]||'':'';
      const m=String(label).match(/(\d)\. kitap[^\d]+(?:s\.)?(\d+)/i);return {file:'Matematik MEB '+(m?.[1]||'')+'. kitap',book:Number(m?.[1]||1),page:Number(m?.[2]||17),range:label,outcome:code+' · '+(row?.[1]||topics[course]?.[t]?.[0]||'')};
    }
    if(course==='Fen Bilimleri'){
      const row=typeof FEN_MODULE_DATA!=='undefined'?FEN_MODULE_DATA[t]:null;return {file:'Fen Bilimleri MEB '+(row?.book||1)+'. kitap',book:Number(row?.book||1),page:Number(row?.stages?.[0]?.page||row?.start||1),range:'s. '+(row?.start||'')+'–'+(row?.end||''),outcome:row?.title||topics[course]?.[t]?.[0]||''};
    }
    if(course==='Sosyal Bilgiler'){
      const row=typeof SOCIAL_LESSONS!=='undefined'?SOCIAL_LESSONS[t]:null;return {file:'Sosyal Bilgiler MEB '+(row?.book||1)+'. kitap',book:Number(row?.book||1),page:Number(row?.stages?.[0]?.page||row?.start||1),range:'s. '+(row?.start||'')+'–'+(row?.end||''),outcome:row?.title||topics[course]?.[t]?.[0]||''};
    }
    const item=window.__DURU_TURKISH_V6520_TEST__?.item?.(t),meb=item?.meb,text=meb?.texts?.[0];return {file:'Türkçe MEB '+(meb?.book||1)+'. kitap',book:Number(meb?.book||1),page:Number(text?.page||meb?.start||1),range:'s. '+(meb?.start||'')+'–'+(meb?.end||''),outcome:item?.title||topics[course]?.[t]?.[0]||''};
  }
  function tag(rows,course,t,origin='meb-source-adapted'){
    const src=sourceMeta(course,t);return unique(rows,course,t).map((row,index)=>({...row,id:row.id||'CORE-'+course.slice(0,3).toLocaleUpperCase('tr-TR')+'-'+t+'-'+index,skill:row.skill||inferSkill(row),difficulty:row.difficulty||difficulty(index),outcome:row.outcome||src.outcome,sourceRef:row.sourceRef||src,origin:row.origin||origin}));
  }
  function factRows(course,t,facts,base=[]){
    const clean=(facts||[]).map(row=>[String(row[0]||'').trim(),String(row[1]||'').trim()]).filter(row=>row[0]&&row[1]);if(clean.length<4)return tag(base,course,t);
    const rows=base.map(clone);
    clean.forEach(([term,description],i)=>{
      const wrong=[1,2,3].map(k=>clean[(i+k)%clean.length][0]);
      rows.push({prompt:'“'+description+'” açıklaması hangi kavram veya örnekle eşleşir?',answer:term,options:[term,...wrong],hint:'Açıklamadaki ayırt edici özelliği bul.',explain:term+': '+description+'.',skill:'source-reading'});
    });
    clean.forEach(([term,description],i)=>{
      const second=clean[(i+1)%clean.length],a=i%4,firstText=a===2||a===3?clean[(i+2)%clean.length][1]:description,secondText=a===1||a===3?clean[(i+3)%clean.length][1]:second[1];
      const answer=['I ve II','Yalnız I','Yalnız II','Hiçbiri'][a];
      rows.push({prompt:'I. '+term+': '+firstText+'\nII. '+second[0]+': '+secondText+'\nBu eşleştirmelerden hangileri doğrudur?',answer,options:[answer,...['I ve II','Yalnız I','Yalnız II','Hiçbiri'].filter(x=>x!==answer)],hint:'Her iki kavramı ayrı ayrı kontrol et.',explain:(a===0?'İki eşleştirme de':a===1?'Yalnız ilk eşleştirme':a===2?'Yalnız ikinci eşleştirme':'İki eşleştirme de yanlış')+'dır.',skill:'multi-statement',difficulty:a===0?'orta':'zor'});
    });
    return tag(rows,course,t);
  }
  function normalBank(course,t){
    t=Number(t);
    if(course==='Matematik'){
      const rows=typeof v622AllQuestions==='function'?v622AllQuestions(course,t):[];
      if(t===18)[
        ['18 - 3 × 4 işleminin sonucu kaçtır?','6',['60','15','48']],['24 ÷ 6 + 5 işleminin sonucu kaçtır?','9',['4','14','29']],
        ['7 + 2 × 8 işleminin sonucu kaçtır?','23',['72','56','16']],['(7 + 2) × 8 işleminin sonucu kaçtır?','72',['23','56','16']],
        ['40 - 18 ÷ 3 işleminin sonucu kaçtır?','34',['22','16','6']],['5 × (12 - 8) işleminin sonucu kaçtır?','20',['52','16','9']],
        ['36 ÷ (3 × 2) işleminin sonucu kaçtır?','6',['24','12','18']],['9 + 15 ÷ 5 × 2 işleminin sonucu kaçtır?','15',['12','24','6']],
        ['50 - 4 × 7 + 3 işleminin sonucu kaçtır?','25',['325','21','47']],['(50 - 4) ÷ 2 işleminin sonucu kaçtır?','23',['48','21','27']]
      ].forEach(([prompt,answer,wrong],i)=>rows.push({prompt,answer,options:[answer,...wrong],hint:'Önce parantez, sonra çarpma-bölme, en son toplama-çıkarma işlemlerini yap.',explain:'İşlem önceliği uygulanınca sonuç '+answer+' olur.',skill:i%2?'reasoning':'application'}));
      return tag(rows,course,t);
    }
    if(course==='Fen Bilimleri'){
      const row=typeof FEN_MODULE_DATA!=='undefined'?FEN_MODULE_DATA[t]:null,base=[];for(let n=0;n<15;n++){try{base.push(makeQuestion(course,t,n))}catch(_){}}
      return factRows(course,t,row?.facts||[],base);
    }
    if(course==='Sosyal Bilgiler'){
      const row=typeof SOCIAL_LESSONS!=='undefined'?SOCIAL_LESSONS[t]:null,base=row?.questions||[],facts=base.map(x=>{const m=String(x.prompt||'').match(/“([^”]+)”/);return [m?.[1]||'',x.answer]});
      return factRows(course,t,facts,base);
    }
    const item=window.__DURU_TURKISH_V6520_TEST__?.item?.(t);return tag(item?.topicQuestions||[],course,t);
  }

  state.coreBankAttemptsV6570=state.coreBankAttemptsV6570&&typeof state.coreBankAttemptsV6570==='object'?state.coreBankAttemptsV6570:{};
  const priorStartQuiz=window.startQuiz;
  window.startQuiz=startQuiz=function(c,t,kind){
    t=Number(t);if(!['Matematik','Fen Bilimleri','Sosyal Bilgiler'].includes(c)||kind!=='normal')return priorStartQuiz.apply(this,arguments);
    if(typeof topicAccessibleV651==='function'&&!topicAccessibleV651(c,t))return alert('Bu konu kilitli. Önce önceki konunun Konu Testini ve varsa Okul Testlerini tamamlamalısın.');
    if(typeof savedTestV617==='function'&&savedTestV617())return resumeSavedTestV617();if(state.pendingSession)return resumePending();
    const bank=normalBank(c,t),key=c+'|'+t,attempt=Number(state.coreBankAttemptsV6570[key]||0),rows=rotate(bank,attempt*10,10);if(rows.length<10)return alert('Bu konu için 10 farklı doğrulanmış soru hazırlanamadı.');
    state.coreBankAttemptsV6570[key]=attempt+1;state.startedTopicsV651=state.startedTopicsV651||{};state.startedTopicsV651[key]=state.startedTopicsV651[key]||new Date().toISOString();persist();course=c;topic=t;return startSession(rows,'normal',[key]);
  };

  function schoolSourceCopy(row){const q=clone(row);delete q._v651id;return q}
  function schoolTopicSource(course,t,index,fallback){
    const key=course+'|'+t,manifest=typeof SCHOOL_MANIFEST==='object'?SCHOOL_MANIFEST:null;
    const preferred=course==='Matematik'?'math_eck':course==='Fen Bilimleri'?'science_eck':'';
    const mapped=(manifest?.mappings?.[key]||[]).filter(row=>!preferred||row.sourceId===preferred).flatMap(row=>(row.pages||[]).map(page=>({sourceId:row.sourceId,page:Number(page)})));
    if(!mapped.length)return clone(fallback||null);
    const picked=mapped[index%mapped.length],meta=(manifest?.sources||[]).find(row=>row.id===picked.sourceId);
    return {sourceId:picked.sourceId,page:picked.page,label:(meta?.label||'Okul materyali')+' · konu sayfası '+picked.page};
  }
  const baseSchool=window.__DURU_V649_TEST__?.school?.bind(window.__DURU_V649_TEST__),schoolAdd={};
  if(baseSchool){
    for(const c of ['Matematik','Fen Bilimleri'])for(let t=0;t<(topics[c]||[]).length;t++){
      const base=baseSchool(c,t)||[],wanted=c==='Matematik'?10:(t<4?14:0);if(!base.length||!wanted)continue;
      const seen=new Set(base.map(q=>norm(q.prompt))),seenStructure=new Set(base.map(q=>structure(q.prompt))),fallback=base.find(q=>q.privateSource)?.privateSource,bank=normalBank(c,t),rows=[];
      for(const raw of bank){if(rows.length>=wanted)break;const promptKey=norm(raw.prompt),shapeKey=structure(raw.prompt);if(seen.has(promptKey)||seenStructure.has(shapeKey))continue;seen.add(promptKey);seenStructure.add(shapeKey);rows.push({...schoolSourceCopy(raw),id:'SCHOOL-V6570-'+(c==='Matematik'?'MAT':'FEN')+'-'+t+'-'+rows.length,privateSource:schoolTopicSource(c,t,rows.length,fallback),sourceRef:null,sourceType:'school',schoolSource:true,origin:'school-topic-original',newInV6513:true})}
      schoolAdd[c+'|'+t]=rows;
    }
    const oldCounts={},oldComplete={};for(const c of ['Matematik','Fen Bilimleri'])for(let t=0;t<(topics[c]||[]).length;t++){
      const count=window.__DURU_V651_TEST__?.schoolPartsFromRowsV6520?.(baseSchool(c,t)||[]).length||0,key=c+'|'+t;oldCounts[key]=count;oldComplete[key]=count>0&&Array.from({length:count},(_,i)=>!!state.completedSchoolTestsV6519?.[key+'|'+i]).every(Boolean);
    }
    window.__DURU_V649_TEST__.school=function(c,t){return (baseSchool(c,Number(t))||[]).concat(clone(schoolAdd[c+'|'+Number(t)]||[]))};
    Object.entries(schoolAdd).forEach(([key,rows])=>{if(!rows.length||!state.done?.[key])return;const [c,t0]=key.split('|'),count=window.__DURU_V651_TEST__.schoolPartsFromRowsV6520(window.__DURU_V649_TEST__.school(c,Number(t0))).length;for(let i=oldCounts[key];i<count;i++)state.completedSchoolTestsV6519[key+'|'+i]=state.completedSchoolTestsV6519[key+'|'+i]||new Date().toISOString();state.schoolNewQuestionEligibleV6513[key]=true});
  }

  const trApi=window.__DURU_TURKISH_V6520_TEST__,trAdded=[];
  if(trApi){
    (trApi.curriculum||[]).forEach((item,index)=>{
      if(item.group!=='MEB Kaynakları')return;
      const base=unique(item.topicQuestions||[],'Türkçe',index),inverse=base.map((row,i)=>({
        prompt:'“'+row.answer+'” yanıtı aşağıdaki sorulardan hangisine uygundur?',answer:row.prompt,
        options:[row.prompt,base[(i+1)%base.length].prompt,base[(i+2)%base.length].prompt,base[(i+3)%base.length].prompt],
        hint:'Yanıtın hangi bilgi veya çıkarımı karşıladığını düşün.',explain:row.explain,
        skill:'answer-question-match',difficulty:i%3===0?'zor':'orta',id:'TR-MEB-V6570-'+item.id+'-'+i
      }));
      item.topicQuestions=tag([...base,...inverse],'Türkçe',index);
    });
    const progress=state.turkishV6520||{},targets=(trApi.curriculum||[]).map((item,index)=>({item,index})).filter(({item})=>item.group==='İELEV Kaynakları');
    targets.forEach(({item,index})=>{
      const oldParts=trApi.schoolParts(index).length,wasComplete=trApi.isDone(index)&&trApi.schoolComplete(index),seen=new Set((item.schoolQuestions||[]).map(q=>norm(q.prompt))),src=item.schoolQuestions?.[0]||item.pages?.[0]||{},adds=[];
      for(const raw of item.topicQuestions||[]){if(adds.length>=10)break;if(seen.has(norm(raw.prompt)))continue;seen.add(norm(raw.prompt));adds.push({...clone(raw),id:'TR-SCHOOL-V6570-'+item.id+'-'+adds.length,sourceType:'school',schoolSource:true,origin:'school-source-original',newInV6570:true,visualUrl:raw.visualUrl||src.visualUrl||src.sourceUrl||'',sourceLabel:raw.sourceLabel||src.sourceLabel||item.title})}
      item.schoolQuestions.push(...adds);trAdded.push(...adds.map(q=>({...q,c:'Türkçe',t:index})));
      if(wasComplete){progress.schoolDone[item.id]=progress.schoolDone[item.id]||{};for(let i=oldParts;i<trApi.schoolParts(index).length;i++)progress.schoolDone[item.id][i]=progress.schoolDone[item.id][i]||new Date().toISOString();const existing=new Set((state.wrongQuestionLogV651||[]).map(x=>x.id));adds.forEach(q=>{const row={...q,c:'Türkçe',t:index},id=qid(row);if(existing.has(row.id))return;existing.add(row.id);state.wrongQuestionLogV651.push({eventId:'v6570-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),id:row.id,c:'Türkçe',t:index,prompt:row.prompt,answer:row.answer,options:row.options,chosen:null,kind:'new-school-source',sourceId:'turkish-v6570',privateSource:null,skill:row.skill||'school-source',loggedAt:new Date().toISOString()})})}
    });
  }
  persist();

  const priorQuestion=window.question;window.question=question=function(){const result=priorQuestion.apply(this,arguments),row=session?.phase==='test'?session?.qs?.[session.idx]:session?.pending?.[0];if(!row?.sourceRef||document.querySelector('.core-source-v6570'))return result;const card=document.querySelector('#app .card'),h=card?.querySelector('h2');if(!card||!h)return result;const src=row.sourceRef,box=document.createElement('div');box.className='core-source-v6570';box.innerHTML='<span>'+esc(row.skill||'kazanım')+'</span><span>'+esc(row.difficulty||'orta')+'</span><p><b>'+esc(row.outcome||'')+'</b><br>'+esc(src.file||'')+' · '+esc(src.range||('s. '+src.page))+'</p><button type="button">📖 İlgili MEB konu sayfasını aç</button>';box.querySelector('button').onclick=()=>{if(row.c==='Fen Bilimleri')fenOpenSource(src.book,src.page);else if(row.c==='Sosyal Bilgiler')socialOpenPage(src.book,src.page);else if(row.c==='Türkçe')turkOpenPage(src.book,src.page);else openMebBookV618(src.book,src.page,row.outcome||'Matematik')};h.after(box);return result};
  function summary(){return Object.fromEntries(COURSES.map(c=>[c,{topics:(topics[c]||[]).length,normalQuestions:(topics[c]||[]).reduce((sum,_,t)=>sum+normalBank(c,t).length,0),schoolQuestions:c==='Türkçe'?(trApi?.curriculum||[]).reduce((sum,_,t)=>sum+trApi.schoolParts(t).flat().length,0):(topics[c]||[]).reduce((sum,_,t)=>sum+(window.__DURU_V651_TEST__?.schoolQuestions(c,t)?.length||0),0)}]))}
  window.__DURU_CORE_V6570__={version:'V6.57.0',normalBank,schoolAdd,trAdded,summary};
})();
