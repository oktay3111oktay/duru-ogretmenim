/* V6.61.0: Rozetlerde karakter, cerceve, aksesuar, ifade ve desen cesitliligi. */
(() => {
  'use strict';

  const previousRenderer = window.badgeMakeSVG;
  const CHARACTERS = [
    ['monster','Sevimli canavar','canavar'],['cat','Kedi','kedi'],['dog','Köpek','köpek'],
    ['rabbit','Tavşan','tavşan'],['fish','Balık','balık'],['robot','Robot','robot'],
    ['panda','Panda','panda'],['bird','Kuş','kuş'],['octopus','Ahtapot','ahtapot'],
    ['butterfly','Kelebek','kelebek'],['turtle','Kaplumbağa','kaplumbağa']
  ];
  const FRAMES = [
    ['medal','Madalya'],['shield','Kalkan'],['star','Yıldız'],['flower','Çiçek'],
    ['crystal','Kristal'],['cloud','Bulut'],['hex','Altıgen'],['laurel','Defne tacı']
  ];
  const ACCESSORIES = [
    ['none','Yok'],['crown','Taç'],['glasses','Gözlük'],['hat','Şapka'],
    ['bow','Fiyonk'],['cape','Pelerin'],['headphones','Kulaklık'],['wings','Kanatlar'],['flower','Çiçek toka']
  ];
  const EXPRESSIONS = [['happy','Neşeli'],['surprised','Şaşkın'],['sleepy','Uykulu'],['angry','Kararlı']];
  const EYES = [['normal','Normal'],['big','Kocaman'],['three','Üç gözlü'],['sleepy','Kapalı']];
  const PATTERNS = [['sparkles','Işıltılı'],['spots','Benekli'],['stripes','Çizgili'],['stars','Yıldızlı'],['scales','Pullu'],['patches','Yamalı']];
  const values = rows => rows.map(row => row[0]);
  const charValues=values(CHARACTERS),frameValues=values(FRAMES),accessoryValues=values(ACCESSORIES),expressionValues=values(EXPRESSIONS),eyeValues=values(EYES),patternValues=values(PATTERNS);
  const tr = value => String(value || '').toLocaleLowerCase('tr-TR');
  const safeColor = (value, fallback) => /^#[0-9a-f]{6}$/i.test(String(value || '')) ? value : fallback;
  const escapeHtml = value => String(value || '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const hash = value => { let out=2166136261; for(const char of String(value||'')){out^=char.charCodeAt(0);out=Math.imul(out,16777619)} return out>>>0; };
  const choose = (rows,seed,offset=0) => rows[(seed+offset)%rows.length][0];
  const optionHtml = (rows,current) => rows.map(([value,label])=>`<option value="${value}" ${value===current?'selected':''}>${label}</option>`).join('');

  function inferred(text, rows) {
    return rows.find(([,label,word]) => tr(text).includes(tr(word || label)))?.[0] || '';
  }

  function normalize(design = {}, id = '') {
    const text=`${design.promptText||''} ${design.title||''}`;
    const seed=hash(text||id||JSON.stringify(design));
    const storedCharacter=charValues.includes(design.variantCharacter)?design.variantCharacter:(charValues.includes(design.character)&&design.character!=='funny'?design.character:'');
    const character=storedCharacter||inferred(text,CHARACTERS)||choose(CHARACTERS,seed);
    const frame=frameValues.includes(design.frameStyle)?design.frameStyle||'':choose(FRAMES,seed,3);
    let accessory=accessoryValues.includes(design.accessoryStyle)?design.accessoryStyle:'';
    if(!accessory){
      const p=tr(text);
      accessory=/taç/.test(p)?'crown':/gözlük/.test(p)?'glasses':/şapka/.test(p)?'hat':/fiyonk|papyon/.test(p)?'bow':/pelerin/.test(p)?'cape':/kulaklık/.test(p)?'headphones':/kanat/.test(p)?'wings':/çiçek/.test(p)?'flower':choose(ACCESSORIES,seed,5);
    }
    const expression=expressionValues.includes(design.expressionStyle)?design.expressionStyle:(expressionValues.includes(design.emotion)?design.emotion:choose(EXPRESSIONS,seed,7));
    let eyes=eyeValues.includes(design.eyeStyle)?design.eyeStyle:'';
    if(!eyes) eyes=design.bigEyes?'big':/üç göz|3 göz/.test(tr(text))?'three':expression==='sleepy'?'sleepy':choose(EYES,seed,11);
    const pattern=patternValues.includes(design.patternStyle)?design.patternStyle:(design.spots?'spots':choose(PATTERNS,seed,13));
    return {character,frame,accessory,expression,eyes,pattern,primary:safeColor(design.primary,'#79aef7'),secondary:safeColor(design.edge,'#ffd77b'),seed};
  }

  function frameMarkup(n, gradientId) {
    const fill=`url(#${gradientId})`,stroke='#263f5e';
    switch(n.frame){
      case 'shield': return `<path d="M120 8 L218 43 L207 143 Q197 199 120 232 Q43 199 33 143 L22 43 Z" fill="${fill}" stroke="${stroke}" stroke-width="8"/><path d="M72 25 Q120 8 168 25" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="6"/>`;
      case 'star': return `<path d="M120 5 L149 68 L218 48 L188 112 L235 160 L166 170 L154 234 L102 194 L48 230 L39 164 L5 119 L58 88 L53 27 Z" fill="${fill}" stroke="${stroke}" stroke-width="8" stroke-linejoin="round"/>`;
      case 'flower': return `<g fill="${fill}" stroke="${stroke}" stroke-width="6">${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6,x=120+Math.cos(a)*84,y=120+Math.sin(a)*84;return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="34"/>`}).join('')}<circle cx="120" cy="120" r="92"/></g>`;
      case 'crystal': return `<path d="M120 5 L205 48 L232 132 L181 222 L59 222 L8 132 L35 48 Z" fill="${fill}" stroke="${stroke}" stroke-width="8"/><path d="M35 48 L120 92 L205 48 M120 92 L120 222" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="5"/>`;
      case 'cloud': return `<path d="M54 207 Q14 190 26 151 Q3 119 31 91 Q30 52 70 48 Q91 10 129 32 Q166 10 187 49 Q226 52 220 91 Q245 117 221 149 Q235 190 193 207 Z" fill="${fill}" stroke="${stroke}" stroke-width="8"/>`;
      case 'hex': return `<path d="M120 5 L215 60 L215 180 L120 235 L25 180 L25 60 Z" fill="${fill}" stroke="${stroke}" stroke-width="8"/><path d="M53 73 L120 34 L187 73" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="6"/>`;
      case 'laurel': return `<circle cx="120" cy="120" r="100" fill="${fill}" stroke="${stroke}" stroke-width="7"/><g fill="#68b95e" stroke="${stroke}" stroke-width="2">${Array.from({length:7},(_,i)=>`<ellipse cx="${35+i*7}" cy="${172-i*18}" rx="9" ry="18" transform="rotate(${-38+i*8} ${35+i*7} ${172-i*18})"/><ellipse cx="${205-i*7}" cy="${172-i*18}" rx="9" ry="18" transform="rotate(${38-i*8} ${205-i*7} ${172-i*18})"/>`).join('')}</g>`;
      default: return `<path d="M78 191 L53 235 L111 212 L120 226 L129 212 L187 235 L162 191" fill="${n.secondary}" stroke="${stroke}" stroke-width="7"/><circle cx="120" cy="112" r="104" fill="${fill}" stroke="${stroke}" stroke-width="8"/><circle cx="120" cy="112" r="88" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="5"/>`;
    }
  }

  function patternMarkup(n) {
    const opacity='.42';
    if(n.pattern==='spots') return `<g fill="#fff" opacity="${opacity}"><circle cx="45" cy="74" r="8"/><circle cx="196" cy="64" r="6"/><circle cx="211" cy="158" r="9"/><circle cx="43" cy="171" r="6"/></g>`;
    if(n.pattern==='stripes') return `<g fill="none" stroke="#fff" stroke-width="8" opacity="${opacity}"><path d="M25 78 Q120 35 215 78"/><path d="M19 116 Q120 73 221 116"/><path d="M24 158 Q120 115 216 158"/></g>`;
    if(n.pattern==='stars') return `<g fill="#fff" opacity=".7"><path d="M43 65 l5 11 12 1-9 8 3 12-11-6-10 6 2-12-9-8 12-1z"/><path d="M198 145 l5 11 12 1-9 8 3 12-11-6-10 6 2-12-9-8 12-1z"/></g>`;
    if(n.pattern==='scales') return `<g fill="none" stroke="#fff" stroke-width="4" opacity="${opacity}"><path d="M29 79 Q48 58 67 79 Q86 58 105 79"/><path d="M136 190 Q155 169 174 190 Q193 169 212 190"/></g>`;
    if(n.pattern==='patches') return `<g fill="#fff" opacity=".38"><path d="M31 57 q24-14 39 9 q-5 27-31 26z"/><path d="M178 170 q24-14 36 11 q-8 25-32 20z"/></g>`;
    return `<g fill="#fff"><path d="M35 89 l4 10 10 4-10 4-4 10-4-10-10-4 10-4z"/><path d="M205 120 l4 10 10 4-10 4-4 10-4-10-10-4 10-4z"/><circle cx="193" cy="62" r="4"/><circle cx="52" cy="164" r="4"/></g>`;
  }

  function accessoryOverlay(n) {
    const dark='#263f5e',gold='#ffd34e';
    if(n.accessory==='crown') return `<path d="M91 55 L101 24 L120 45 L140 22 L151 56 Z" fill="${gold}" stroke="${dark}" stroke-width="5"/><circle cx="101" cy="30" r="4" fill="#ff6f91"/><circle cx="140" cy="28" r="4" fill="#6bc9ff"/>`;
    if(n.accessory==='headphones') return `<path d="M77 90 Q120 43 163 90" fill="none" stroke="${dark}" stroke-width="8"/><rect x="67" y="86" width="20" height="44" rx="9" fill="${gold}" stroke="${dark}" stroke-width="5"/><rect x="153" y="86" width="20" height="44" rx="9" fill="${gold}" stroke="${dark}" stroke-width="5"/>`;
    if(n.accessory==='flower') return `<g transform="translate(164 59)" stroke="${dark}" stroke-width="2"><circle r="8" fill="${gold}"/><circle cy="-12" r="8" fill="#fff"/><circle cx="12" r="8" fill="#fff"/><circle cy="12" r="8" fill="#fff"/><circle cx="-12" r="8" fill="#fff"/></g>`;
    return '';
  }

  function enhancedPrompt(design,n) {
    const character=CHARACTERS.find(row=>row[0]===n.character)?.[2]||'canavar';
    const parts=[design.promptText||'',character];
    if(n.accessory==='glasses')parts.push('gözlük');
    if(n.accessory==='hat')parts.push('şapka');
    if(n.accessory==='bow')parts.push('fiyonk');
    if(n.accessory==='cape')parts.push('pelerin');
    if(n.accessory==='wings')parts.push('kanatlı');
    if(n.eyes==='three')parts.push('üç göz');
    if(n.eyes==='big')parts.push('kocaman gözlü');
    if(n.pattern==='spots')parts.push('benekli');
    return parts.join(' ');
  }

  window.badgeMakeSVG=function badgeMakeVariedSVG(design={},editable=false){
    const n=normalize(design,design.badgeId||'');
    const key=`badgeGrad${hash(`${design.title}|${design.promptText}|${n.primary}|${n.secondary}|${n.frame}`).toString(36)}`;
    const baseDesign={...design,character:n.character,emotion:n.eyes==='sleepy'?'sleepy':n.expression,bigEyes:n.eyes==='big',spots:n.pattern==='spots',primary:n.primary,edge:n.secondary,promptText:enhancedPrompt(design,n)};
    const raw=typeof previousRenderer==='function'?previousRenderer(baseDesign,true):'';
    const inner=(raw.match(/<svg[^>]*>([\s\S]*)<\/svg>/i)||[])[1]||'';
    const title=escapeHtml(design.title||'Özel rozet');
    return `<svg class="bd-svg badge-variety-v6610" data-character="${n.character}" data-frame="${n.frame}" data-accessory="${n.accessory}" data-pattern="${n.pattern}" viewBox="0 0 240 240" role="img" aria-label="${title}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="${key}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${n.secondary}"/><stop offset=".48" stop-color="${n.primary}"/><stop offset="1" stop-color="${n.primary}" stop-opacity=".82"/></linearGradient><filter id="${key}Shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#172b44" flood-opacity=".28"/></filter></defs><g filter="url(#${key}Shadow)">${frameMarkup(n,key)}${patternMarkup(n)}</g><g transform="translate(36 35) scale(.7)">${inner}</g>${accessoryOverlay(n)}<title>${title}</title><desc>${escapeHtml(design.promptText||'')}</desc></svg>`;
  };

  function selectedDesign() {
    return normalize(badgeDraft||{},badgeActiveId||'');
  }

  function controlsMarkup(n) {
    return `<div class="badge-variety-controls-v6610"><label>Karakter<select onchange="badgeVarietySetV6610('variantCharacter',this.value)">${optionHtml(CHARACTERS,n.character)}</select></label><label>Rozet biçimi<select onchange="badgeVarietySetV6610('frameStyle',this.value)">${optionHtml(FRAMES,n.frame)}</select></label><label>Aksesuar<select onchange="badgeVarietySetV6610('accessoryStyle',this.value)">${optionHtml(ACCESSORIES,n.accessory)}</select></label><label>Yüz ifadesi<select onchange="badgeVarietySetV6610('expressionStyle',this.value)">${optionHtml(EXPRESSIONS,n.expression)}</select></label><label>Gözler<select onchange="badgeVarietySetV6610('eyeStyle',this.value)">${optionHtml(EYES,n.eyes)}</select></label><label>Desen<select onchange="badgeVarietySetV6610('patternStyle',this.value)">${optionHtml(PATTERNS,n.pattern)}</select></label><label>Ana renk<input type="color" value="${n.primary}" onchange="badgeVarietySetV6610('primary',this.value)"></label><label>İkinci renk<input type="color" value="${n.secondary}" onchange="badgeVarietySetV6610('edge',this.value)"></label></div>`;
  }

  window.badgeStudio=function badgeStudioVariety(id){
    if(!id||!(state.badges||[]).includes(id)){badges();return}
    view='badgeStudio';badgeActiveId=id;
    badgeDraft=JSON.parse(JSON.stringify((state.badgeDesigns&&state.badgeDesigns[id])||badgeDefault(id)));
    badgeDraft.badgeId=id;
    const n=selectedDesign(),titleValue=badgeDraft.title&&badgeDraft.title!==badgeLabel(id)?badgeDraft.title:'';
    app.innerHTML=`${nav()}<h1>🎨 Rozet Atölyesi</h1><div class="card pixar-badge-wrap"><p>Karakteri, rozet biçimini, aksesuarı, yüz ifadesini, gözleri, deseni ve renkleri ayrı ayrı değiştirebilirsin.</p><div class="pixar-preview"><div id="badgeLiveSVG">${badgeMakeSVG(badgeDraft,true)}</div></div>${controlsMarkup(n)}<div class="bd-fields"><label for="badgeTitleInput">Rozetin adı</label><input id="badgeTitleInput" maxlength="32" value="${escapeHtml(titleValue)}" placeholder="Örneğin: Uçan Köpük" oninput="badgeVarietySetV6610('title',this.value)"><label for="badgePromptInput">Ek ayrıntıları tarif et</label><textarea id="badgePromptInput" rows="4" placeholder="Örneğin: Kuyruğu çok uzun olsun, komik gözlük taksın.">${escapeHtml(badgeDraft.promptText||'')}</textarea><div class="pixar-actions"><button type="button" onclick="badgeGenerateFromPrompt()">✨ Tarifi uygula</button><button type="button" onclick="badgeVarietySurpriseV6610()">🎲 Sürpriz tasarım</button><button class="green" type="button" onclick="badgeSaveDesign()">✅ Rozeti kaydet</button><button type="button" onclick="badges()">Geri dön</button></div></div></div>`;
  };

  window.badgeVarietySetV6610=function(field,value){
    if(!badgeDraft)return;
    badgeDraft[field]=field==='title'?String(value).slice(0,32):value;
    window.badgeRefreshSVG();
  };

  window.badgeVarietySurpriseV6610=function(){
    if(!badgeDraft)return;
    const seed=hash(`${Date.now()}|${badgeActiveId}|${Math.random()}`);
    Object.assign(badgeDraft,{variantCharacter:choose(CHARACTERS,seed),frameStyle:choose(FRAMES,seed,2),accessoryStyle:choose(ACCESSORIES,seed,4),expressionStyle:choose(EXPRESSIONS,seed,6),eyeStyle:choose(EYES,seed,8),patternStyle:choose(PATTERNS,seed,10)});
    badgeStudio(badgeActiveId);
  };

  window.badgeGenerateFromPrompt=function(){
    if(!badgeDraft)return;
    const prompt=((document.getElementById('badgePromptInput')||{}).value||'').trim();
    const title=((document.getElementById('badgeTitleInput')||{}).value||badgeDraft.title||'').trim();
    const parsed=typeof badgeAnalyzePrompt==='function'?badgeAnalyzePrompt(prompt,title||undefined):{};
    const keep={variantCharacter:badgeDraft.variantCharacter,frameStyle:badgeDraft.frameStyle,accessoryStyle:badgeDraft.accessoryStyle,expressionStyle:badgeDraft.expressionStyle,eyeStyle:badgeDraft.eyeStyle,patternStyle:badgeDraft.patternStyle};
    badgeDraft={...badgeDraft,...parsed,...keep,promptText:prompt,title:(title||parsed.title||badgeDraft.title||'Özel rozet')};
    window.badgeRefreshSVG();
  };

  window.badgeRefreshSVG=function(){
    const node=document.getElementById('badgeLiveSVG');
    if(node&&badgeDraft)node.innerHTML=window.badgeMakeSVG(badgeDraft,true);
  };

  window.badgeSaveDesign=function(){
    if(!badgeActiveId||!(state.badges||[]).includes(badgeActiveId)||!badgeDraft){badges();return}
    window.badgeGenerateFromPrompt();
    const n=selectedDesign();
    state.badgeDesigns=state.badgeDesigns||{};
    state.badgeDesigns[badgeActiveId]={title:(badgeDraft.title||'Özel rozet').slice(0,32),promptText:String(badgeDraft.promptText||''),primary:n.primary,edge:n.secondary,character:n.character,emotion:n.expression,bigEyes:n.eyes==='big',longEars:n.character==='rabbit',bigNose:!!badgeDraft.bigNose,cheeks:badgeDraft.cheeks!==false,teeth:!!badgeDraft.teeth,spots:n.pattern==='spots',funny:true,variantCharacter:n.character,frameStyle:n.frame,accessoryStyle:n.accessory,expressionStyle:n.expression,eyeStyle:n.eyes,patternStyle:n.pattern,designedAt:new Date().toISOString()};
    persist();badges();
  };

  const style=document.createElement('style');
  style.id='badge-variety-style-v6610';
  style.textContent=`.badge-variety-controls-v6610{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:13px;border-radius:18px;background:linear-gradient(135deg,#eef9ff,#f7efff);color:#26324a}.badge-variety-controls-v6610 label{display:grid;gap:5px;font-size:13px;font-weight:850}.badge-variety-controls-v6610 select,.badge-variety-controls-v6610 input{width:100%;min-height:44px}.badge-variety-controls-v6610 input[type=color]{padding:3px}.pixar-mini .badge-variety-v6610{width:160px;height:160px}.pixar-preview .badge-variety-v6610{width:min(100%,340px);height:auto}@media(max-width:520px){.badge-variety-controls-v6610{grid-template-columns:1fr}}`;
  document.head.appendChild(style);

  window.__DURU_BADGE_VARIETY_V6610_TEST__={normalize,CHARACTERS,FRAMES,ACCESSORIES,EXPRESSIONS,EYES,PATTERNS};
})();
