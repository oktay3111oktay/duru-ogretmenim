const path = require('node:path');
const {pathToFileURL} = require('node:url');
const modules = process.env.CODEX_BUNDLED_NODE_MODULES || 'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const {chromium} = require(path.join(modules, 'playwright'));
const assert = (ok, message) => { if (!ok) throw new Error(message); };

(async () => {
  const browser = await chromium.launch({headless:true, executablePath:process.env.BROWSER_EXECUTABLE || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const context = await browser.newContext({viewport:{width:390,height:844}});
  const seed = {
    points:91,
    done:{'Din Kültürü|0':true,'Din Kültürü|1':true,'Din Kültürü|2':true,'Din Kültürü|3':true},
    scores:{'Din Kültürü|0':90},
    badges:['first'], badgeDesigns:{first:{color:'#112233',strokes:[]}}, collection:{'Minik panda':true}
  };
  await context.addInitScript(value => {
    window.__DURU_SYNC_TEST_MODE__=true;
    localStorage.setItem('duru_teacher_reset_v6_5',JSON.stringify(value));
  },seed);
  const page = await context.newPage(), errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(pathToFileURL(path.resolve(__dirname,'../dist/index.html')).href,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!(window.__DURU_V651_TEST__&&window.__DURU_DIN_511_TEST__),undefined,{timeout:60000});
  const result = await page.evaluate(() => {
    const before=JSON.parse(localStorage.getItem('duru_teacher_reset_v6_5'));
    const topicBanks=RELIGION_DATA['Din Kültürü'].slice(0,4).map(item=>item.questions);
    openCourse('Din Kültürü');
    const courseCards=document.querySelectorAll('.din511-course-source').length;
    const courseLinks=[...document.querySelectorAll('.din511-course-source a')].map(a=>a.getAttribute('href'));
    lesson(0,RELIGION_DATA['Din Kültürü'][0].stages.length-1);
    const transition=[...document.querySelectorAll('.rel-actions button.primary')].pop();
    transition.click();
    const firstSource={title:document.querySelector('.din511-panel h2')?.textContent,link:document.querySelector('.din511-panel a')?.getAttribute('href')};
    startQuiz('Din Kültürü',0,'normal');
    const normalPrompts=session.qs.map(question=>question.prompt);
    const normalSourceCount=normalPrompts.filter(prompt=>topicBanks[0].slice(0,6).some(question=>question.prompt===prompt)).length;
    const gtt=window.__DURU_V651_TEST__.wrongPool('Din Kültürü');
    return {
      before,
      topicBanks:topicBanks.map(bank=>({count:bank.length,sourceCount:bank.filter(question=>question.din511Source).length,valid:bank.every(question=>Array.isArray(question.options)&&question.options.length===4&&new Set(question.options).size===4&&question.options.filter(option=>option===question.answer).length===1)})),
      courseCards,courseLinks,firstSource,normalPrompts,normalSourceCount,gttCount:gtt.length,gttTagged:gtt.every(question=>question.din511Source),gttOptions:gtt.every(question=>question.options.length===4&&question.options.filter(option=>option===question.answer).length===1),
      state:{points:state.points,done:state.done,badges:state.badges,badgeDesigns:state.badgeDesigns},width:document.documentElement.scrollWidth,innerWidth
    };
  });
  for(const key of ['points','done','badges','badgeDesigns']) assert(JSON.stringify(result.before[key])===JSON.stringify(seed[key]),`Öğrenci kaydı değişti: ${key}`);
  assert(result.topicBanks.every(bank=>bank.count===10&&bank.sourceCount===6&&bank.valid),'Her Din konusu 6 kaynak sorusu ve 4 seçenek içermiyor');
  assert(result.courseCards===4&&result.courseLinks.some(link=>link.includes('din-511-eba.pdf'))&&result.courseLinks.some(link=>link.includes('din-511-mebi.pdf')),'Kaynak PDF bağlantıları konu kartlarında yok');
  assert(result.firstSource.title==='Ölçü ve denge'&&result.firstSource.link.includes('din-511-eba.pdf#page=3'),'Kaynak konu anlatımı açılmadı');
  assert(result.normalSourceCount===6,'Yeni kaynak soruları konu testine girmedi');
  assert(result.gttCount===24&&result.gttTagged&&result.gttOptions,'Tamamlanmış Din konularının yeni soruları GTT havuzunda değil');
  assert(JSON.stringify(result.state.done)===JSON.stringify(seed.done)&&result.state.points===seed.points&&JSON.stringify(result.state.badgeDesigns)===JSON.stringify(seed.badgeDesigns),'İlerleme veya rozet tasarımı değişti');
  assert(result.width<=result.innerWidth+1,'390 pikselde yatay taşma var');
  assert(!errors.length,`Tarayıcı hatası: ${errors.join(' | ')}`);
  console.log(JSON.stringify({topicBanks:result.topicBanks,courseCards:result.courseCards,firstSource:result.firstSource,gttCount:result.gttCount,width:result.width,errors},null,2));
  await browser.close();
})().catch(error=>{console.error(error.stack||error);process.exitCode=1});
