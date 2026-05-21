/* SILVERGUARD 지식 챗봇 — 백엔드 불필요 스크립트형 봇
   검증된 사실만 사용. 금지 표현(TSP/ORB/RANSAC/95.4% 등) 회피. */
(function () {
  if (window.__sgbotLoaded) return;
  window.__sgbotLoaded = true;

  var MAIL_IR = "mailto:41quart@gmail.com?subject=" + encodeURIComponent("[실버가드] IR 자료 요청");
  var MAIL_PILOT = "mailto:41quart@gmail.com?subject=" + encodeURIComponent("[실버가드] 파일럿 도입 상담");

  // 지식 베이스: 키워드 매칭 기반
  var KB = [
    { id:"intro", kw:["실버가드","뭐","무엇","소개","어떤 회사","무슨","what","about","개요"],
      a:"실버가드는 <b>주식회사 마이스터랩</b>이 운영하는 B2G·B2B Tech-HR 플랫폼입니다. AI 정밀 매칭 · 다이내믹 디스패칭 · 온디맨드 휴먼 센서를 결합해, <b>도시의 사각지대를 데이터 자산으로</b> 전환합니다." },
    { id:"solution", kw:["솔루션","서비스","어떻게","작동","원리","플랫폼","기능","무얼","무엇을 하"],
      a:"11만 공공 API의 예측 신호를 시니어 Pro-Agent의 현장 데이터로 변환합니다.<br>• <b>AI 정밀 매칭</b> — 후보 시니어 자동 추천<br>• <b>다이내믹 디스패칭</b> — 위험 신호에 가장 가까운 요원 즉시 배정<br>• <b>온디맨드 휴먼 센서</b> — 현장 검증 데이터 수집" },
    { id:"agent", kw:["시니어","요원","pro-agent","프로에이전트","인력","고용","어르신","노인"],
      a:"전국 <b>600명 이상의 시니어 Pro-Agent</b>가 현장에서 활동합니다. <b>한국노인인력개발원 협약</b>을 통한 직접 고용 모델이며, 국내 65세 이상 잠재 풀은 약 1,100만 명입니다." },
    { id:"proof", kw:["실적","성과","숫자","지표","규모","커버리지","몇","효과"],
      a:"주요 지표입니다.<br>• <b>600+</b> 시니어 Pro-Agent<br>• <b>98%</b> HWP 보고서 자동 발행률<br>• <b>4×</b> 기존 점검 대비 커버리지<br>• <b>11만</b> 공공 API 통합<br>• <b>1,336</b> 시설관리 업체 네트워크" },
    { id:"tech", kw:["특허","기술","kipris","아이피","ip","알고리즘","엔진"],
      a:"<b>KIPRIS 특허 4건</b>을 출원했습니다 (10-2026-0050085 외 3건). 핵심 기술은 경로 최적화 엔진, 특징점 추출, 형상 매칭·정렬 검증, 객체 인식·메타 검증으로 구성됩니다." },
    { id:"trust", kw:["검증","신뢰","믿","증명","레퍼런스","협약","kbs","방송"],
      a:"신뢰 설계는 3겹입니다.<br>• <b>한국노인인력개발원</b> 협약 (운영 모델 검증)<br>• <b>KBS 생로병사의 비밀</b> 방영 (공영방송 사례)<br>• <b>메리츠 파트너스</b> 단체보험 (노무 리스크 흡수)<br>• <b>KIPRIS 특허 4건</b> (기술 IP)" },
    { id:"meritz", kw:["메리츠","보험","리스크","노무","중대재해","처벌법"],
      a:"메리츠 파트너스와의 단체보험 크로스셀로 노무 리스크를 흡수합니다. 중대재해처벌법 시대에 고객사의 노무 리스크를 구조적으로 흡수하는 모델입니다." },
    { id:"clients", kw:["고객","대상","누구","타겟","지자체","시설","보험사","페르소나"],
      a:"주요 고객은 <b>지자체</b>(도시 안전망), <b>시설관리 업체</b>(점검 커버리지), <b>보험사</b>(리스크 데이터), 그리고 <b>시니어</b>(일자리)입니다." },
    { id:"control", kw:["control","콘솔","관제","컨트롤","대시보드","모니터"],
      a:"운영 콘솔(Control)에서 600+ Pro-Agent를 실시간으로 보고, 매칭·디스패치합니다. 👉 <a href='/control'>Control 페이지 보기</a>" },
    { id:"data", kw:["data","데이터","대쉬보드","현황","리포트","통계"],
      a:"데이터 대시보드(Data)에서 11만 공공 API 신호와 현장 데이터가 검증 가능한 자산으로 통합됩니다. 👉 <a href='/data'>Data 페이지 보기</a>" },
    { id:"ir", kw:["ir","투자","자료","피칭","ir자료","invest","deck","ir 자료"],
      a:"IR 자료가 필요하시면 바로 요청하실 수 있습니다. 👉 <a href='" + MAIL_IR + "'>IR 자료 요청하기</a>" },
    { id:"pilot", kw:["도입","파일럿","문의","상담","견적","계약","시작","연락"],
      a:"파일럿 도입 상담을 도와드립니다. 👉 <a href='" + MAIL_PILOT + "'>파일럿 도입 상담 신청</a><br>또는 이메일 <b>41quart@gmail.com</b> 으로 연락 주세요." },
    { id:"company", kw:["대표","위치","주소","설립","회사정보","마이스터랩","조승연","어디","연락처","이메일"],
      a:"• 운영사: <b>주식회사 마이스터랩</b><br>• 대표: <b>조승연</b><br>• 위치: 경기 화성시 동탄<br>• 설립: 2026.04.29<br>• 이메일: <b>41quart@gmail.com</b>" }
  ];

  var GREETING = "안녕하세요! 실버가드 AI 안내봇입니다. 🛡️<br>회사·솔루션·실적·특허·도입 등 무엇이든 물어보세요.";
  var CHIPS = [
    ["실버가드가 뭐예요?","intro"],
    ["주요 실적이 궁금해요","proof"],
    ["특허·기술은?","tech"],
    ["도입 상담하고 싶어요","pilot"],
    ["IR 자료 요청","ir"]
  ];

  function answer(q) {
    var s = (q||"").toLowerCase();
    var best=null, bestScore=0;
    KB.forEach(function(item){
      var score=0;
      item.kw.forEach(function(k){ if(s.indexOf(k.toLowerCase())>=0) score++; });
      if(score>bestScore){ bestScore=score; best=item; }
    });
    logQ(q, best?best.id:null);
    if(best) return best.a;
    return "음, 정확히 이해하지 못했어요. 아래 주제로 다시 여쭤보시거나, 자세한 문의는 <b>41quart@gmail.com</b> 으로 부탁드립니다.";
  }

  // 질문 로그 (브라우저 localStorage — 추후 어드민/CMS 연동용)
  function logQ(q, cat){
    try{
      var key="sg_chat_log";
      var arr=JSON.parse(localStorage.getItem(key)||"[]");
      arr.push({ q:q, cat:cat, t:new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(arr.slice(-200)));
    }catch(e){}
  }

  var CSS = "\
  #sgbot-launch{position:fixed;right:22px;bottom:22px;z-index:99998;display:flex;align-items:center;gap:9px;\
    background:#00D9FF;color:#06121a;border:none;border-radius:40px;padding:13px 18px;font-weight:700;\
    font-family:'Pretendard Variable',system-ui,sans-serif;font-size:14px;cursor:pointer;box-shadow:0 8px 30px rgba(0,217,255,.35);transition:transform .15s}\
  #sgbot-launch:hover{transform:translateY(-2px)}\
  #sgbot-launch svg{width:20px;height:20px}\
  #sgbot-panel{position:fixed;right:22px;bottom:22px;z-index:99999;width:370px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100vh - 44px);\
    display:none;flex-direction:column;background:#0C111E;border:1px solid #1e2a40;border-radius:18px;overflow:hidden;\
    box-shadow:0 24px 70px rgba(0,0,0,.6);font-family:'Pretendard Variable',system-ui,sans-serif}\
  #sgbot-panel.open{display:flex}\
  .sgbot-hd{display:flex;align-items:center;gap:10px;padding:15px 16px;background:linear-gradient(135deg,#101a2c,#0C111E);border-bottom:1px solid #1e2a40}\
  .sgbot-dot{width:9px;height:9px;border-radius:50%;background:#C5F82A;box-shadow:0 0 8px #C5F82A;animation:sgblink 1.6s infinite}\
  @keyframes sgblink{0%,100%{opacity:1}50%{opacity:.3}}\
  .sgbot-hd b{color:#F5F7FA;font-size:14.5px}\
  .sgbot-hd span{color:#8A93A6;font-size:11px;font-family:'JetBrains Mono',monospace}\
  .sgbot-x{margin-left:auto;background:none;border:none;color:#8A93A6;font-size:20px;cursor:pointer;line-height:1}\
  .sgbot-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:11px}\
  .sgbot-msg{max-width:84%;padding:11px 13px;border-radius:13px;font-size:13.5px;line-height:1.6;word-break:break-word}\
  .sgbot-bot{align-self:flex-start;background:#16203200;background:#152033;color:#E7ECF5;border:1px solid #223149;border-top-left-radius:4px}\
  .sgbot-user{align-self:flex-end;background:#00D9FF;color:#06121a;border-top-right-radius:4px;font-weight:600}\
  .sgbot-bot a{color:#00D9FF;font-weight:700}\
  .sgbot-chips{display:flex;flex-wrap:wrap;gap:7px;padding:0 16px 12px}\
  .sgbot-chip{background:#152033;border:1px solid #28395a;color:#C7CCD8;border-radius:30px;padding:7px 12px;font-size:12px;cursor:pointer;transition:.15s}\
  .sgbot-chip:hover{border-color:#00D9FF;color:#fff}\
  .sgbot-input{display:flex;gap:8px;padding:12px;border-top:1px solid #1e2a40;background:#0a0f1a}\
  .sgbot-input input{flex:1;background:#11192a;border:1px solid #243450;border-radius:10px;color:#F5F7FA;padding:11px 12px;font-size:13.5px;outline:none}\
  .sgbot-input input:focus{border-color:#00D9FF}\
  .sgbot-input button{background:#C5F82A;color:#0a1400;border:none;border-radius:10px;padding:0 16px;font-weight:800;cursor:pointer;font-size:14px}\
  .sgbot-foot{text-align:center;font-size:10px;color:#5b6678;padding:0 0 9px;font-family:'JetBrains Mono',monospace}";

  function el(html){ var d=document.createElement('div'); d.innerHTML=html.trim(); return d.firstChild; }

  function init(){
    var style=document.createElement('style'); style.textContent=CSS; document.head.appendChild(style);

    var launch=el("<button id='sgbot-launch' aria-label='실버가드 AI 챗봇 열기'>\
      <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.4A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z'/></svg>실버가드 AI</button>");
    var panel=el("<div id='sgbot-panel' role='dialog' aria-label='실버가드 AI 챗봇'>\
      <div class='sgbot-hd'><span class='sgbot-dot'></span><b>실버가드 AI</b><span>LIVE</span><button class='sgbot-x' aria-label='닫기'>×</button></div>\
      <div class='sgbot-body' id='sgbot-body'></div>\
      <div class='sgbot-chips' id='sgbot-chips'></div>\
      <form class='sgbot-input' id='sgbot-form'><input id='sgbot-in' type='text' placeholder='무엇이든 물어보세요…' autocomplete='off'/><button type='submit'>↑</button></form>\
      <div class='sgbot-foot'>SILVERGUARD ASSISTANT · 안내용 정보 봇</div></div>");
    document.body.appendChild(launch); document.body.appendChild(panel);

    var body=panel.querySelector('#sgbot-body');
    var chips=panel.querySelector('#sgbot-chips');
    var form=panel.querySelector('#sgbot-form');
    var input=panel.querySelector('#sgbot-in');
    var greeted=false;

    function push(text, who){
      var m=document.createElement('div');
      m.className='sgbot-msg '+(who==='user'?'sgbot-user':'sgbot-bot');
      m.innerHTML=text; body.appendChild(m); body.scrollTop=body.scrollHeight;
    }
    function botReply(text){ setTimeout(function(){ push(text,'bot'); }, 280); }

    function renderChips(){
      chips.innerHTML='';
      CHIPS.forEach(function(c){
        var b=document.createElement('button'); b.className='sgbot-chip'; b.textContent=c[0];
        b.onclick=function(){ push(c[0],'user'); var item=KB.filter(function(k){return k.id===c[1];})[0]; logQ(c[0],c[1]); botReply(item?item.a:answer(c[0])); };
        chips.appendChild(b);
      });
    }
    function open(){ panel.classList.add('open'); launch.style.display='none'; if(!greeted){ greeted=true; push(GREETING,'bot'); renderChips(); } input.focus(); }
    function close(){ panel.classList.remove('open'); launch.style.display='flex'; }

    launch.onclick=open;
    panel.querySelector('.sgbot-x').onclick=close;
    form.onsubmit=function(e){ e.preventDefault(); var q=input.value.trim(); if(!q) return; push(q,'user'); input.value=''; botReply(answer(q)); };
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
