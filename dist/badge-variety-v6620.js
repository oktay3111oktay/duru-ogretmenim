/* V6.62.0: Tek parca, cercevesiz, sevimli rozet karakterleri. */
(() => {
  'use strict';

  const previousRenderer=window.badgeMakeSVG;
  const CHARACTERS=[
    ['monster','Sevimli canavar','canavar'],['cat','Kedi','kedi'],['dog','Köpek','köpek'],
    ['rabbit','Tavşan','tavşan'],['fish','Balık','balık'],['robot','Robot','robot'],
    ['panda','Panda','panda'],['bird','Kuş','kuş'],['octopus','Ahtapot','ahtapot'],
    ['butterfly','Kelebek','kelebek'],['turtle','Kaplumbağa','kaplumbağa']
  ];
  const ACCESSORIES=[
    ['none','Yok'],['glasses','Komik gözlük'],['hat','Şapka'],['bow','Fiyonk'],['cape','Pelerin'],['wings','Kanatlar']
  ];
  const EXPRESSIONS=[['happy','Neşeli'],['surprised','Şaşkın'],['sleepy','Uykulu']];
  const EYES=[['normal','Normal'],['big','Kocaman'],['three','Üç gözlü']];
  const PATTERNS=[['plain','Düz'],['spots','Benekli']];
  const values=rows=>rows.map(row=>row[0]);
  const charValues=values(CHARACTERS),accessoryValues=values(ACCESSORIES),expressionValues=values(EXPRESSIONS),eyeValues=values(EYES),patternValues=values(PATTERNS);
  const tr=value=>String(value||'').toLocaleLowerCase('tr-TR');
  const safeColor=(value,fallback)=>/^#[0-9a-f]{6}$/i.test(String(value||''))?value:fallback;
  const escapeHtml=value=>String(value||'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const hash=value=>{let out=2166136261;for(const char of String(value||'')){out^=char.charCodeAt(0);out=Math.imul(out,16777619)}return out>>>0};
  const choose=(rows,seed,offset=0)=>rows[(seed+offset)%rows.length][0];
  const optionHtml=(rows,current)=>rows.map(([value,label])=>`<option value="${value}" ${value===current?'selected':''}>${label}</option>`).join('');
  const inferred=(text,rows)=>rows.find(([,label,word])=>tr(text).includes(tr(word||label)))?.[0]||'';

  function normalize(design={},id=''){
    const text=`${design.promptText||''} ${design.title||''}`,seed=hash(text||id||JSON.stringify(design));
    const stored=charValues.includes(design.variantCharacter)?design.variantCharacter:(charValues.includes(design.character)&&design.character!=='funny'?design.character:'');
    const character=stored||inferred(text,CHARACTERS)||choose(CHARACTERS,seed);
    let accessory=accessoryValues.includes(design.accessoryStyle)?design.accessoryStyle:'';
    if(!accessory){const p=tr(text);accessory=/gözlük/.test(p)?'glasses':/şapka/.test(p)?'hat':/fiyonk|papyon/.test(p)?'bow':/pelerin/.test(p)?'cape':/kanat/.test(p)?'wings':choose(ACCESSORIES,seed,5)}
    const expression=expressionValues.includes(design.expressionStyle)?design.expressionStyle:(expressionValues.includes(design.emotion)?design.emotion:choose(EXPRESSIONS,seed,7));
    let eyes=eyeValues.includes(design.eyeStyle)?design.eyeStyle:'';
    if(!eyes)eyes=design.bigEyes?'big':/üç göz|3 göz/.test(tr(text))?'three':choose(EYES,seed,11);
    const pattern=patternValues.includes(design.patternStyle)?design.patternStyle:(design.spots?'spots':choose(PATTERNS,seed,13));
    return {character,accessory,expression,eyes,pattern,primary:safeColor(design.primary,'#79aef7'),secondary:safeColor(design.edge,'#ffd77b'),seed};
  }

  function enhancedPrompt(design,n){
    const character=CHARACTERS.find(row=>row[0]===n.character)?.[2]||'canavar',parts=[design.promptText||'',character];
    if(n.accessory==='glasses')parts.push('komik gözlük');
    if(n.accessory==='hat')parts.push('şapka');
    if(n.accessory==='bow')parts.push('fiyonk');
    if(n.accessory==='cape')parts.push('pelerin');
    if(n.accessory==='wings')parts.push('kanatlı');
    if(n.eyes==='three')parts.push('üç göz');
    if(n.eyes==='big')parts.push('kocaman gözlü');
    if(n.pattern==='spots')parts.push('benekli');
    if(n.expression==='surprised')parts.push('şaşkın');
    if(n.expression==='sleepy')parts.push('uykulu');
    return parts.join(' ').trim();
  }

  window.badgeMakeSVG=function badgeMakeCuteCutout(design={},editable=false){
    const n=normalize(design,design.badgeId||'');
    const base={...design,character:n.character,emotion:n.expression,bigEyes:n.eyes==='big',spots:n.pattern==='spots',primary:n.primary,edge:n.secondary,promptText:enhancedPrompt(design,n)};
    const raw=typeof previousRenderer==='function'?previousRenderer(base,editable):'';
    return raw.replace('<svg class="bd-svg"',`<svg class="bd-svg badge-cutout-v6620" data-single-piece="true" data-character="${n.character}" data-accessory="${n.accessory}" data-pattern="${n.pattern}"`);
  };

  function selectedDesign(){return normalize(badgeDraft||{},badgeActiveId||'')}
  function controlsMarkup(n){
    return `<div class="badge-variety-controls-v6620"><label>Karakter<select onchange="badgeVarietySetV6620('variantCharacter',this.value)">${optionHtml(CHARACTERS,n.character)}</select></label><label>Aksesuar<select onchange="badgeVarietySetV6620('accessoryStyle',this.value)">${optionHtml(ACCESSORIES,n.accessory)}</select></label><label>Yüz ifadesi<select onchange="badgeVarietySetV6620('expressionStyle',this.value)">${optionHtml(EXPRESSIONS,n.expression)}</select></label><label>Gözler<select onchange="badgeVarietySetV6620('eyeStyle',this.value)">${optionHtml(EYES,n.eyes)}</select></label><label>Gövde deseni<select onchange="badgeVarietySetV6620('patternStyle',this.value)">${optionHtml(PATTERNS,n.pattern)}</select></label><label>Ana renk<input type="color" value="${n.primary}" onchange="badgeVarietySetV6620('primary',this.value)"></label><label>İkinci renk<input type="color" value="${n.secondary}" onchange="badgeVarietySetV6620('edge',this.value)"></label></div>`;
  }

  window.badgeStudio=function badgeStudioCute(id){
    if(!id||!(state.badges||[]).includes(id)){badges();return}
    view='badgeStudio';badgeActiveId=id;
    badgeDraft=JSON.parse(JSON.stringify((state.badgeDesigns&&state.badgeDesigns[id])||badgeDefault(id)));badgeDraft.badgeId=id;
    const n=selectedDesign(),titleValue=badgeDraft.title&&badgeDraft.title!==badgeLabel(id)?badgeDraft.title:'';
    app.innerHTML=`${nav()}<h1>🎨 Rozet Atölyesi</h1><div class="card pixar-badge-wrap"><p>Çerçevesiz, tek parça ve sevimli rozet karakterini oluştur.</p><div class="pixar-preview"><div id="badgeLiveSVG">${badgeMakeSVG(badgeDraft,true)}</div></div>${controlsMarkup(n)}<div class="bd-fields"><label for="badgeTitleInput">Rozetin adı</label><input id="badgeTitleInput" maxlength="32" value="${escapeHtml(titleValue)}" placeholder="Örneğin: Uçan Köpük" oninput="badgeVarietySetV6620('title',this.value)"><label for="badgePromptInput">Ek ayrıntıları tarif et</label><textarea id="badgePromptInput" rows="4" placeholder="Örneğin: Komik gözlüklü, kocaman gözlü şirin bir kedi olsun.">${escapeHtml(badgeDraft.promptText||'')}</textarea><div class="pixar-actions"><button type="button" onclick="badgeGenerateFromPrompt()">✨ Tarifi uygula</button><button type="button" onclick="badgeVarietySurpriseV6620()">🎲 Sürpriz tasarım</button><button class="green" type="button" onclick="badgeSaveDesign()">✅ Rozeti kaydet</button><button type="button" onclick="badges()">Geri dön</button></div></div></div>`;
  };

  window.badgeVarietySetV6620=function(field,value){if(!badgeDraft)return;badgeDraft[field]=field==='title'?String(value).slice(0,32):value;window.badgeRefreshSVG()};
  window.badgeVarietySurpriseV6620=function(){
    if(!badgeDraft)return;const seed=hash(`${Date.now()}|${badgeActiveId}|${Math.random()}`);
    Object.assign(badgeDraft,{variantCharacter:choose(CHARACTERS,seed),accessoryStyle:choose(ACCESSORIES,seed,4),expressionStyle:choose(EXPRESSIONS,seed,6),eyeStyle:choose(EYES,seed,8),patternStyle:choose(PATTERNS,seed,10)});badgeStudio(badgeActiveId);
  };
  window.badgeGenerateFromPrompt=function(){
    if(!badgeDraft)return;const prompt=((document.getElementById('badgePromptInput')||{}).value||'').trim(),title=((document.getElementById('badgeTitleInput')||{}).value||badgeDraft.title||'').trim();
    const parsed=typeof badgeAnalyzePrompt==='function'?badgeAnalyzePrompt(prompt,title||undefined):{},keep={variantCharacter:badgeDraft.variantCharacter,accessoryStyle:badgeDraft.accessoryStyle,expressionStyle:badgeDraft.expressionStyle,eyeStyle:badgeDraft.eyeStyle,patternStyle:badgeDraft.patternStyle};
    badgeDraft={...badgeDraft,...parsed,...keep,promptText:prompt,title:(title||parsed.title||badgeDraft.title||'Özel rozet')};window.badgeRefreshSVG();
  };
  window.badgeRefreshSVG=function(){const node=document.getElementById('badgeLiveSVG');if(node&&badgeDraft)node.innerHTML=window.badgeMakeSVG(badgeDraft,true)};
  window.badgeSaveDesign=function(){
    if(!badgeActiveId||!(state.badges||[]).includes(badgeActiveId)||!badgeDraft){badges();return}window.badgeGenerateFromPrompt();const n=selectedDesign();
    state.badgeDesigns=state.badgeDesigns||{};state.badgeDesigns[badgeActiveId]={title:(badgeDraft.title||'Özel rozet').slice(0,32),promptText:String(badgeDraft.promptText||''),primary:n.primary,edge:n.secondary,character:n.character,emotion:n.expression,bigEyes:n.eyes==='big',longEars:n.character==='rabbit',bigNose:!!badgeDraft.bigNose,cheeks:badgeDraft.cheeks!==false,teeth:!!badgeDraft.teeth,spots:n.pattern==='spots',funny:true,variantCharacter:n.character,accessoryStyle:n.accessory,expressionStyle:n.expression,eyeStyle:n.eyes,patternStyle:n.pattern,designedAt:new Date().toISOString()};persist();badges();
  };

  const style=document.createElement('style');style.id='badge-variety-style-v6620';
  style.textContent=`.badge-variety-controls-v6620{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:13px;border-radius:18px;background:linear-gradient(135deg,#eef9ff,#f7efff);color:#26324a}.badge-variety-controls-v6620 label{display:grid;gap:5px;font-size:13px;font-weight:850}.badge-variety-controls-v6620 select,.badge-variety-controls-v6620 input{width:100%;min-height:44px}.badge-variety-controls-v6620 input[type=color]{padding:3px}.pixar-mini .badge-cutout-v6620{width:170px;height:170px}.pixar-preview .badge-cutout-v6620{width:min(100%,340px);height:auto}@media(max-width:520px){.badge-variety-controls-v6620{grid-template-columns:1fr}}`;
  document.head.appendChild(style);
  window.__DURU_BADGE_VARIETY_V6620_TEST__={normalize,CHARACTERS,ACCESSORIES,EXPRESSIONS,EYES,PATTERNS};
})();
