/* V6.63.0: Odul bakiyesi kurtarma ve cihazlar arasi kayipsiz esitleme. */
(() => {
  'use strict';

  const FIELD = 'blindMansBuffRewardsV6530';
  const STORE_FIELD = 'rewardStoreV6600';
  const SESSION_FIELD = '_rewardStoreV6600';
  const KOREBE_IMAGE = './assets/korebe-reward-v6530.png';
  const HOME_REWARD_IMAGE = './assets/reward-home-v6610.webp';
  const REWARD_IMAGE_DIR = './assets/rewards-v6610';
  const DAY_MS = 24 * 60 * 60 * 1000;
  const legacy = window.__DURU_REWARDS_V6530_TEST__;
  const integer = value => Math.max(0, Math.floor(Number(value) || 0));
  const round = value => Math.round((Number(value) || 0) * 100) / 100;
  const pad = value => String(value).padStart(2, '0');
  const dayKey = (date = new Date()) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const nowIso = () => new Date().toISOString();

  const CATALOG = [
    {id:'korebe',name:'Körebe',cost:100,group:'Hareketli Oyunlar',image:'korebe'},
    {id:'balon',name:'Balon Oyunları',cost:150,group:'Hareketli Oyunlar',x:25,y:100},
    {id:'basketbol',name:'Basketbol',cost:350,group:'Hareketli Oyunlar',x:0,y:0},
    {id:'masa-tenisi',name:'Masa Tenisi',cost:350,group:'Hareketli Oyunlar',x:25,y:0},
    {id:'sicak-soguk',name:'Sıcak–Soğuk',cost:150,group:'Saklama ve Bulma',x:0,y:100},
    {id:'hazine-avi',name:'Mini Hazine Avı',cost:300,group:'Saklama ve Bulma',x:100,y:0},
    {id:'kutu-oyunlari',name:'Diğer Kutu Oyunları',cost:300,group:'Kutu Oyunları',x:75,y:0},
    {id:'monopoly',name:'Monopoly',cost:450,group:'Kutu Oyunları',x:50,y:0},
    {id:'patlamis-misir',name:'Patlamış Mısır',cost:200,group:'Özel Aile Ödülleri'},
    {id:'film-gecesi',name:'Ailece Film Gecesi',cost:400,group:'Özel Aile Ödülleri',x:50,y:100},
    {id:'evde-sushi',name:'Evde Sushi',cost:750,group:'Özel Aile Ödülleri',x:75,y:100,sushi:true,cooldownDays:14},
    {id:'restoranda-sushi',name:'Restoranda Sushi',cost:1000,group:'Özel Aile Ödülleri',x:100,y:100,sushi:true,cooldownDays:30}
  ];
  const BY_ID = Object.fromEntries(CATALOG.map(item => [item.id,item]));

  function freshStoreDaily(day = dayKey()) {
    return {day,points:0,correct:0,bonusCorrect:0,updatedAt:nowIso()};
  }

  function addTransaction(store, type, amount, rewardId = '', label = '') {
    const date = nowIso();
    store.transactions.unshift({id:`rw-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,type,amount:round(amount),rewardId,label,date});
    store.transactions = store.transactions.slice(0,20);
    store.updatedAt = date;
  }

  function ensureStore(save = false) {
    const reward = legacy?.ensureReward?.(false) || (state[FIELD] = state[FIELD] || {});
    const hadStore = !!(reward[STORE_FIELD] && typeof reward[STORE_FIELD] === 'object');
    let store = reward[STORE_FIELD] && typeof reward[STORE_FIELD] === 'object' ? reward[STORE_FIELD] : {};
    let changed = reward[STORE_FIELD] !== store;
    store.version = 6600;
    store.balance = Math.max(0,Number(store.balance)||0);
    store.inventory = store.inventory && typeof store.inventory === 'object' ? store.inventory : {};
    store.sushiQueue = Array.isArray(store.sushiQueue) ? store.sushiQueue : [];
    store.transactions = Array.isArray(store.transactions) ? store.transactions : [];
    if (!store.daily || store.daily.day !== dayKey()) { store.daily = freshStoreDaily(); changed = true; }
    else {
      store.daily.points = Math.max(0,Number(store.daily.points)||0);
      store.daily.correct = integer(store.daily.correct);
      store.daily.bonusCorrect = integer(store.daily.bonusCorrect);
    }
    if (!store.migratedLegacyRights) {
      const oldRights = integer(reward.rights);
      if (oldRights) store.inventory.korebe = integer(store.inventory.korebe) + oldRights;
      const partial = Math.max(0,(Number(reward.daily?.credit)||0) % 100);
      if (partial) store.balance = round(store.balance + partial);
      store.migratedLegacyRights = true;
      store.migratedAt = nowIso();
      store.updatedAt = store.migratedAt;
      changed = true;
    }
    if (!store.updatedAt) {
      store.updatedAt = String(store.transactions[0]?.date || store.migratedAt || '');
      if (store.updatedAt) changed = true;
    }
    if (hadStore && !store.recoveryV6630) {
      const before = round(store.balance);
      store.balance = Math.max(before,20);
      const appliedAt = nowIso();
      store.recoveryV6630 = {targetBalance:20,added:round(store.balance-before),appliedAt,reason:'approved-missing-reward-recovery'};
      if (store.balance > before) {
        store.transactions.unshift({id:'rw-recovery-v6630',type:'recovery',amount:round(store.balance-before),rewardId:'',label:'Onaylı kayıp ödül puanı kurtarma',date:appliedAt});
        store.transactions = store.transactions.slice(0,20);
      }
      store.updatedAt = appliedAt;
      changed = true;
    }
    CATALOG.forEach(item => { store.inventory[item.id] = integer(store.inventory[item.id]); });
    reward.rights = store.inventory.korebe;
    reward[STORE_FIELD] = store;
    refreshSushiQueue(store);
    if (save && changed) persist();
    return {reward,store};
  }

  function rewardVisual(item, compact = false) {
    if (item.image === 'korebe') return `<img class="reward-art-img-v6600" src="${KOREBE_IMAGE}" alt="Körebe oynayan çocuklar">`;
    return `<img class="reward-art-img-v6600 ${compact?'compact':''}" src="${REWARD_IMAGE_DIR}/${item.id}.webp" alt="${esc(item.name)} ödülü">`;
  }

  function availableBalance(store) { return Math.floor(Math.max(0,Number(store.balance)||0)); }
  function bagCount(store) { return CATALOG.reduce((sum,item) => sum + integer(store.inventory[item.id]),0); }
  function isSushi(item) { return !!item?.sushi; }

  function refreshSushiQueue(store) {
    const now = Date.now();
    store.sushiQueue.forEach(row => {
      if (row.status === 'waiting' && Date.parse(row.availableAt || '') <= now) {
        row.status = 'ready'; row.availableAt = ''; row.updatedAt = nowIso();
      }
    });
    const active = store.sushiQueue.some(row => row.status === 'ready' || row.status === 'waiting');
    if (!active) {
      const next = store.sushiQueue.find(row => row.status === 'queued');
      if (next) { next.status = 'ready'; next.updatedAt = nowIso(); }
    }
  }

  function queueSushi(store,item) {
    refreshSushiQueue(store);
    const active = store.sushiQueue.some(row => ['ready','waiting','queued'].includes(row.status));
    store.sushiQueue.push({id:`sushi-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,rewardId:item.id,purchasedAt:nowIso(),status:active?'queued':'ready',availableAt:'',updatedAt:nowIso()});
  }

  function purchase(itemId) {
    const item = BY_ID[itemId]; if (!item) return false;
    const {reward,store} = ensureStore(false), balance = availableBalance(store);
    if (balance < item.cost) { alert(`${item.name} için ${item.cost-balance} puan daha gerekiyor.`); return false; }
    if (!confirm(`${item.name}, ${item.cost} ödül puanıyla satın alınsın mı?`)) return false;
    store.balance = round(store.balance - item.cost);
    store.inventory[item.id] = integer(store.inventory[item.id]) + 1;
    if (isSushi(item)) queueSushi(store,item);
    reward.rights = store.inventory.korebe;
    addTransaction(store,'purchase',-item.cost,item.id,`${item.name} satın alındı`);
    reward.updatedAt = nowIso(); persist();
    openStore('shop');
    return true;
  }

  function nextQueuedSushi(store) {
    return store.sushiQueue.find(row => row.status === 'queued');
  }

  function useReward(itemId, queueId = '') {
    const item = BY_ID[itemId]; if (!item) return false;
    const {reward,store} = ensureStore(false);
    if (!integer(store.inventory[item.id])) return false;
    if (isSushi(item)) {
      refreshSushiQueue(store);
      const row = store.sushiQueue.find(q => q.id === queueId && q.rewardId === item.id) || store.sushiQueue.find(q => q.rewardId === item.id && q.status === 'ready');
      if (!row || row.status !== 'ready') { alert('Bu Sushi ödülünün sırası henüz gelmedi.'); return false; }
      if (!confirm(`${item.name} kullanıldı olarak işaretlensin mi?`)) return false;
      row.status='used';row.usedAt=nowIso();row.updatedAt=nowIso();
      store.inventory[item.id] = Math.max(0,integer(store.inventory[item.id])-1);
      const next = nextQueuedSushi(store);
      if (next) {
        const nextItem=BY_ID[next.rewardId],days=integer(nextItem?.cooldownDays);
        next.status='waiting';next.availableAt=new Date(Date.now()+days*DAY_MS).toISOString();next.updatedAt=nowIso();
      }
    } else {
      if (!confirm(`${item.name} kullanıldı olarak çantadan düşülsün mü?`)) return false;
      store.inventory[item.id] = Math.max(0,integer(store.inventory[item.id])-1);
    }
    reward.rights = store.inventory.korebe;
    addTransaction(store,'use',0,item.id,`${item.name} kullanıldı`);
    reward.updatedAt=nowIso();persist();
    if (typeof view !== 'undefined' && view === 'parent') decorateParent(); else openStore('bag');
    return true;
  }

  function dailyStudyActive() {
    try { window.__DURU_DAILY_V6519_TEST__?.ensureToday?.(true); } catch (_) {}
    return !!state.dailyStudyV6519?.active && state.dailyStudyV6519.day === dayKey();
  }

  function questionId(question) {
    return String(question?.id || [question?.sourceCourseId||question?.c,question?.sourceTopicId??question?.t,question?.prompt,question?.answer].join('|'));
  }

  function sessionMeta(testSession) {
    if (!testSession) return null;
    const identity = legacy?.sessionIdentity?.(testSession) || `${testSession.kind||'test'}|${testSession.keys||''}`;
    if (!testSession[SESSION_FIELD] || testSession[SESSION_FIELD].identity !== identity) testSession[SESSION_FIELD]={identity,rawPoints:0,correct:0,bonusCorrect:0,seen:{},finalized:false};
    return testSession[SESSION_FIELD];
  }

  function recordCorrect(testSession,question,selected,phase,index) {
    if (!testSession || !question || selected == null || !dailyStudyActive() || testSession._rewardPointBlockedV6540) return false;
    if (selected !== question.answer || (phase === 'repair' && question.saw)) return false;
    const meta=sessionMeta(testSession);if(!meta||meta.finalized)return false;
    const token=`${phase}|${index}|${questionId(question)}|${selected}`;
    if(meta.seen[token])return false;meta.seen[token]=true;
    const bonus=testSession._wrongOnlyV651?1:0;
    meta.rawPoints=round((Number(meta.rawPoints)||0)+1+bonus);
    meta.correct=integer(meta.correct)+1;
    meta.bonusCorrect=integer(meta.bonusCorrect)+bonus;
    return true;
  }

  function formatPoints(value) {
    const n=round(value);return Number.isInteger(n)?String(n):n.toLocaleString('tr-TR',{maximumFractionDigits:2});
  }

  function awardFinishedSession(active,beforeRights) {
    if (!active) return null;
    const meta=sessionMeta(active),{reward,store}=ensureStore(false);
    reward.rights=beforeRights;
    if(!meta||meta.finalized)return null;
    meta.finalized=true;meta.finalizedAt=nowIso();
    const key=legacy?.sessionIdentity?.(active)||meta.identity;
    const attempt=integer(reward.completions?.[key])||1;
    const threshold=legacy?.thresholdForAttempt?.(attempt)||100;
    const points=round((Number(meta.rawPoints)||0)*100/threshold);
    if(points>0){
      store.balance=round(store.balance+points);
      store.daily.points=round((Number(store.daily.points)||0)+points);
      store.daily.correct=integer(store.daily.correct)+integer(meta.correct);
      store.daily.bonusCorrect=integer(store.daily.bonusCorrect)+integer(meta.bonusCorrect);
      store.daily.updatedAt=nowIso();
      addTransaction(store,'earn',points,'',`${displayCourse(active)} · ${formatPoints(points)} puan`);
    }
    reward.updatedAt=nowIso();persist();
    return {points,balance:store.balance,correct:meta.correct,bonusCorrect:meta.bonusCorrect,attempt,threshold};
  }

  function displayCourse(active) {
    const q=active?.qs?.[0]||{};return String(q.sourceCourseId||q.c||window.course||'Test');
  }

  function replaceCompletionNotice(outcome) {
    if(!outcome)return;const card=document.querySelector('.completion-card');if(!card)return;
    let box=card.querySelector('.korebe-earned-v6530');
    if(!box){box=document.createElement('div');box.className='korebe-earned-v6530';const btn=card.querySelector('button.primary:last-child');if(btn)btn.before(box);else card.append(box)}
    box.classList.toggle('bonus',outcome.bonusCorrect>0);
    if(outcome.points>0)box.innerHTML=`<strong>${outcome.bonusCorrect?'⚡ Bonus ödül puanı!':'🪙 Ödül puanı kazandın!'}</strong><p>${outcome.correct} doğru veya düzeltilmiş soru${outcome.bonusCorrect?` · ${outcome.bonusCorrect} bonus katkı`:''}. Çantanda kullanılabilir <b>${formatPoints(outcome.balance)} puan</b> var.</p>`;
    else box.innerHTML='<strong>🌱 Öğrenmeye devam!</strong><p>Bu oturumda ödül puanı kazandıran doğru veya düzeltilmiş soru bulunmadı.</p>';
  }

  function homeMarkup() {
    const {store}=ensureStore(false),points=availableBalance(store),progress=Math.min(100,(points%100));
    return `<div class="reward-home-art-v6600"><img src="${HOME_REWARD_IMAGE}" alt="Ödül sandığını açan neşeli çocuklar"></div><div class="reward-home-copy-v6600"><h2>🎭 Ödüllerim</h2><div class="reward-wallet-v6600"><span>🪙</span><strong>${points}</strong><b>Ödül Puanı</b></div><div class="reward-daily-v6600">Bugünkü katkı: <b>${formatPoints(store.daily.points)}</b></div><div class="reward-home-progress-v6600"><i style="width:${progress}%"></i></div><div class="reward-home-actions-v6600"><button type="button" class="reward-shop-open-v6600" onclick="openRewardStoreV6600('shop')">🛍️ Ödül Mağazası</button><button type="button" onclick="openRewardStoreV6600('bag')">🎒 Çantamda ${bagCount(store)} ödül</button></div></div>`;
  }

  function reorderHome(card) {
    const grid=document.querySelector('#app .teacher-card-grid');if(grid)grid.insertAdjacentElement('afterend',card);
    const headings=[...document.querySelectorAll('#app h2')];
    const badge=headings.find(h=>/Rozetlerim/.test(h.textContent||''))?.closest('.card');
    const world=headings.find(h=>/Duru'nun Dünyası|Hayal Adası/.test(h.textContent||''))?.closest('.card');
    if(badge&&world)world.insertAdjacentElement('afterend',badge);
  }

  function decorateHome() {
    if(typeof view!=='undefined'&&view!=='home')return;
    let card=document.getElementById('korebe-reward-v6530');
    if(!card){card=document.createElement('section');card.id='korebe-reward-v6530';card.className='card'}
    card.className='card reward-home-v6600';card.innerHTML=homeMarkup();reorderHome(card);
  }

  function cardMarkup(item,store) {
    const balance=availableBalance(store),count=integer(store.inventory[item.id]),missing=Math.max(0,item.cost-balance),percent=Math.min(100,Math.round(balance/item.cost*100));
    return `<article class="reward-shop-card-v6600"><div class="reward-shop-art-v6600">${rewardVisual(item)}<span class="reward-price-v6600">🪙 ${item.cost.toLocaleString('tr-TR')}</span></div><h3>${esc(item.name)}</h3>${count?`<span class="reward-owned-v6600">Çantada ${count}</span>`:''}<div class="reward-item-progress-v6600"><i style="width:${percent}%"></i></div><button type="button" ${missing?'disabled':''} onclick="purchaseRewardV6600('${item.id}')">${missing?`${missing} puan kaldı`:'Satın Al'}</button></article>`;
  }

  function daysRemaining(value) {return Math.max(1,Math.ceil((Date.parse(value||'')-Date.now())/DAY_MS));}
  function queueStatus(row) {
    if(row.status==='ready')return '<span class="reward-ready-v6600">✓ Kullanıma hazır</span>';
    if(row.status==='waiting')return `<span class="reward-wait-v6600">⏱ Sırası bekliyor · ${daysRemaining(row.availableAt)} gün</span>`;
    return '<span class="reward-queued-v6600">🔒 Önceki Sushi ödülünü bekliyor</span>';
  }

  function bagMarkup(store,parentMode=false) {
    refreshSushiQueue(store);
    const regular=CATALOG.filter(item=>!item.sushi&&integer(store.inventory[item.id]));
    const sushi=store.sushiQueue.filter(row=>row.status!=='used');
    if(!regular.length&&!sushi.length)return '<div class="reward-empty-v6600">🎒 Çantan şimdilik boş. Mağazadan ilk ödülünü seçebilirsin!</div>';
    const regularHtml=regular.map(item=>`<article class="reward-bag-item-v6600"><div class="reward-bag-art-v6600">${rewardVisual(item,true)}</div><div><h3>${esc(item.name)}</h3><p>Adet: ${integer(store.inventory[item.id])}</p></div><button type="button" onclick="useRewardV6600('${item.id}')">Kullanıldı</button></article>`).join('');
    const sushiHtml=sushi.map(row=>{const item=BY_ID[row.rewardId];return `<article class="reward-bag-item-v6600 sushi ${row.status}"><div class="reward-bag-art-v6600">${rewardVisual(item,true)}</div><div><h3>${esc(item.name)}</h3><p>Adet: ${integer(store.inventory[item.id])}</p>${queueStatus(row)}</div>${row.status==='ready'?`<button type="button" onclick="useRewardV6600('${item.id}','${row.id}')">Kullanıldı</button>`:''}</article>`}).join('');
    return `<div class="reward-bag-list-v6600">${regularHtml}${sushiHtml}</div>`;
  }

  function shopMarkup(store) {
    const groups=[...new Set(CATALOG.map(item=>item.group))];
    return groups.map(group=>`<section class="reward-group-v6600"><h2>${group==='Hareketli Oyunlar'?'🎮':group==='Saklama ve Bulma'?'🔎':group==='Kutu Oyunları'?'🎲':'👨‍👩‍👧'} ${esc(group)}</h2><div class="reward-grid-v6600">${CATALOG.filter(item=>item.group===group).map(item=>cardMarkup(item,store)).join('')}</div></section>`).join('');
  }

  function openStore(tab='shop') {
    const {store}=ensureStore(true);view='reward-store-v6600';refreshSushiQueue(store);
    app.innerHTML=`${nav()}<div class="reward-store-v6600"><header class="reward-store-head-v6600"><div><h1>${tab==='bag'?'🎒 Ödül Çantam':'✨ Ödül Mağazası'}</h1><p>Puanlarını sevdiğin ödüllerle değiştir.</p></div><div class="reward-store-wallet-v6600">🪙 <strong>${availableBalance(store)}</strong></div></header><div class="reward-tabs-v6600"><button class="${tab==='shop'?'active':''}" onclick="openRewardStoreV6600('shop')">Mağaza</button><button class="${tab==='bag'?'active':''}" onclick="openRewardStoreV6600('bag')">Ödül Çantam (${bagCount(store)})</button></div>${tab==='bag'?bagMarkup(store):shopMarkup(store)}</div>`;
    window.scrollTo(0,0);
  }

  function parentMarkup() {
    const {store}=ensureStore(false);
    return `<div class="reward-parent-head-v6600"><div><h2>🎭 Ödül yönetimi</h2><p><strong>${availableBalance(store)}</strong> kullanılabilir ödül puanı</p><p class="muted small">Satın alınan ödülleri kullanıldığında buradan düşebilirsin.</p></div><button type="button" onclick="openRewardStoreV6600('shop')">Mağazayı aç</button></div>${bagMarkup(store,true)}`;
  }

  function decorateParent() {
    let card=document.getElementById('korebe-parent-v6530');
    const anchor=document.querySelector('.teacher-parent-card')||document.querySelector('#app .card');if(!anchor)return;
    if(!card){card=document.createElement('section');card.id='korebe-parent-v6530';anchor.insertAdjacentElement('afterend',card)}
    card.className='card reward-parent-v6600';card.innerHTML=parentMarkup();
  }

  const nextBefore=window.nextQuestion;
  if(typeof nextBefore==='function')window.nextQuestion=nextQuestion=function(){
    if(session&&chosenAnswer!==null&&session.qs?.[session.idx])recordCorrect(session,session.qs[session.idx],chosenAnswer,'test',session.idx);
    return nextBefore.apply(this,arguments);
  };

  const repairBefore=window.repairChoose;
  if(typeof repairBefore==='function')window.repairChoose=repairChoose=function(i){
    const active=session,q=active?.pending?.[0],selected=q?.options?.[i];
    if(active&&q)recordCorrect(active,q,selected,'repair',`${active.repair||0}-${active.pending.length}`);
    return repairBefore.apply(this,arguments);
  };

  const finishBefore=window.finishSession;
  if(typeof finishBefore==='function')window.finishSession=finishSession=function(){
    const active=session,ready=!!active&&(!Array.isArray(active.pending)||active.pending.length===0),beforeRights=integer(state[FIELD]?.rights);
    const result=finishBefore.apply(this,arguments);
    if(ready&&active)replaceCompletionNotice(awardFinishedSession(active,beforeRights));
    return result;
  };

  const homeBefore=window.home;
  if(typeof homeBefore==='function')window.home=home=function(){const result=homeBefore.apply(this,arguments);decorateHome();setTimeout(decorateHome,0);return result;};
  const parentBefore=window.parentView;
  if(typeof parentBefore==='function')window.parentView=parentView=function(){const result=parentBefore.apply(this,arguments);decorateParent();setTimeout(decorateParent,0);return result;};

  const style=document.createElement('style');style.id='reward-store-style-v6600';style.textContent=`
    .reward-home-v6600{display:grid;grid-template-columns:minmax(200px,300px) 1fr;gap:20px;align-items:center;overflow:hidden;background:linear-gradient(145deg,#fffbd7,#e8fff4 52%,#eee9ff)!important;color:#25324b!important}.reward-home-art-v6600{align-self:stretch;display:flex;align-items:center;justify-content:center;min-height:220px}.reward-home-art-v6600 img{display:block;width:100%;max-height:270px;object-fit:contain;filter:drop-shadow(0 9px 9px #663b1833)}.reward-home-copy-v6600 h2{font-size:30px;margin:0 0 12px}.reward-wallet-v6600{display:flex;align-items:baseline;gap:9px;padding:11px 15px;border:1px solid #a783e988;border-radius:18px;background:linear-gradient(135deg,#fff,#efe6ff);color:#6027a8;box-shadow:0 8px 20px #673aaa18}.reward-wallet-v6600 span{font-size:29px}.reward-wallet-v6600 strong{font-size:clamp(44px,7vw,70px);line-height:1}.reward-wallet-v6600 b{font-size:18px}.reward-daily-v6600{margin:13px 2px 8px;font-size:17px}.reward-home-progress-v6600,.reward-item-progress-v6600{height:10px;overflow:hidden;border-radius:99px;background:#fff;border:1px solid #8c78b755}.reward-home-progress-v6600 i,.reward-item-progress-v6600 i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#ffb52e,#ff4f8b,#7b55e7)}.reward-home-actions-v6600{display:grid;grid-template-columns:1.25fr 1fr;gap:9px;margin-top:13px}.reward-shop-open-v6600{background:linear-gradient(135deg,#b92ff1,#6e35d9)!important;color:#fff!important;font-weight:900!important}
    .reward-store-v6600{max-width:1120px;margin:auto}.reward-store-head-v6600{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:12px 0 14px}.reward-store-head-v6600 h1{margin:0}.reward-store-head-v6600 p{margin:5px 0;color:#bcc8da}.reward-store-wallet-v6600{padding:10px 18px;border-radius:999px;background:linear-gradient(135deg,#fff7c8,#f4e7ff);color:#6628a9;font-size:22px;box-shadow:0 8px 22px #0003}.reward-store-wallet-v6600 strong{font-size:30px}.reward-tabs-v6600{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:12px 0 18px}.reward-tabs-v6600 button{background:#5d6d8e;color:#fff}.reward-tabs-v6600 .active{background:linear-gradient(135deg,#d79cff,#8655ee);color:#2e1755;font-weight:900}.reward-group-v6600{margin:15px 0;padding:14px;border:1px solid #7694b844;border-radius:20px;background:#24334a}.reward-group-v6600>h2{margin:0 0 12px;padding:8px 12px;border-radius:13px;background:linear-gradient(90deg,#bff4dc,#dcfff0);color:#183b40;font-size:19px}.reward-grid-v6600{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.reward-shop-card-v6600{position:relative;padding:10px;border-radius:17px;background:linear-gradient(150deg,#fffef0,#f2f7ff);color:#26324a;box-shadow:0 6px 18px #0e182b32}.reward-shop-card-v6600 h3{margin:8px 1px 5px;font-size:17px}.reward-shop-art-v6600{position:relative;height:210px;overflow:hidden;border-radius:14px;background:linear-gradient(#f6ffdf,#ddf7ef)}.reward-art-img-v6600{display:block;width:100%;height:100%;object-fit:contain}.reward-price-v6600{position:absolute;right:7px;bottom:7px;padding:5px 10px;border-radius:999px;background:linear-gradient(135deg,#7336da,#4d1aa8);color:#fff;font-size:18px;font-weight:950;box-shadow:0 5px 12px #3f227055;border:2px solid #f8dc62}.reward-owned-v6600{position:absolute;left:18px;top:18px;padding:3px 7px;border-radius:99px;background:#d8f9e5;color:#17643a;font-size:11px;font-weight:850;box-shadow:0 3px 8px #173e2944}.reward-item-progress-v6600{height:7px;margin:7px 1px 9px}.reward-shop-card-v6600>button{width:100%;background:linear-gradient(135deg,#a638ec,#6d31d7);color:#fff}.reward-shop-card-v6600>button:disabled{background:#7b879b;color:#e9eef7;opacity:.86}.reward-bag-list-v6600{display:grid;gap:12px}.reward-bag-item-v6600{display:grid;grid-template-columns:150px 1fr auto;align-items:center;gap:14px;padding:13px;border-radius:18px;background:linear-gradient(135deg,#e5fff1,#f4ecff);color:#26324a;border:1px solid #94d7b899}.reward-bag-item-v6600.waiting,.reward-bag-item-v6600.queued{background:linear-gradient(135deg,#f6f0ff,#fff7df)}.reward-bag-art-v6600{height:105px;overflow:hidden;border-radius:13px}.reward-bag-art-v6600 img{width:100%;height:100%;object-fit:contain}.reward-bag-item-v6600 h3{margin:0 0 5px}.reward-bag-item-v6600 p{margin:0 0 7px}.reward-ready-v6600,.reward-wait-v6600,.reward-queued-v6600{display:inline-block;padding:5px 9px;border-radius:999px;font-weight:850;font-size:13px}.reward-ready-v6600{background:#c8f4d8;color:#17643a}.reward-wait-v6600{background:#ffeaa8;color:#684500}.reward-queued-v6600{background:#e7ddf8;color:#56358d}.reward-empty-v6600{padding:28px;text-align:center;border-radius:18px;background:#ffffff12}.reward-parent-v6600{background:linear-gradient(135deg,#fff9d8,#e9fff3)!important;color:#26324a!important}.reward-parent-head-v6600{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:13px}.reward-parent-head-v6600 h2{margin:0}.reward-parent-head-v6600 strong{font-size:34px;color:#6628a9}
    body.dark .reward-home-v6600 h2,body.dark .reward-home-v6600 b,body.dark .reward-parent-v6600 h2{color:#26324a!important}
    @media(max-width:820px){.reward-grid-v6600{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:640px){.reward-home-v6600{grid-template-columns:1fr;gap:6px}.reward-home-art-v6600{min-height:150px}.reward-home-art-v6600 img{max-height:220px}.reward-home-copy-v6600 h2{font-size:27px}.reward-home-actions-v6600{grid-template-columns:1fr}.reward-grid-v6600{gap:8px}.reward-group-v6600{padding:10px}.reward-shop-card-v6600{padding:7px}.reward-shop-art-v6600{height:132px}.reward-price-v6600{font-size:15px;padding:4px 8px}.reward-shop-card-v6600 h3{font-size:14px;min-height:36px}.reward-owned-v6600{left:14px;top:14px}.reward-bag-item-v6600{grid-template-columns:95px 1fr}.reward-bag-item-v6600>button{grid-column:1/-1}.reward-bag-art-v6600{height:82px}.reward-wallet-v6600 strong{font-size:48px}.reward-wallet-v6600 b{font-size:16px}}
  `;document.head.appendChild(style);

  window.openRewardStoreV6600=openStore;
  window.purchaseRewardV6600=purchase;
  window.useRewardV6600=useReward;
  window.__DURU_REWARD_STORE_V6600_TEST__={CATALOG,ensureStore,purchase,useReward,recordCorrect,awardFinishedSession,refreshSushiQueue,bagCount,availableBalance,decorateHome,decorateParent};
  ensureStore(true);
  if(typeof view!=='undefined'&&view==='home')decorateHome();
  if(typeof view!=='undefined'&&view==='parent')decorateParent();
  setInterval(()=>{const before=state[FIELD]?.[STORE_FIELD]?.daily?.day;ensureStore(true);if(before!==dayKey()&&typeof view!=='undefined'&&view==='home')decorateHome();},30000);
})();
