/* SILVERGUARD 지식 챗봇 v2 — 백엔드 불필요 스크립트형 봇
   검증된 사실만 사용. 금지 표현(TSP/ORB/RANSAC/95.4% 등) 회피.
   - 띄어쓰기/구어체/오타에 강한 유추 매칭
   - 시니어 '지원' 의도 자동 감지 → 성함·연락처 접수 → 관리자 누적
   - 인사/감사/가격 등 소액대화 인텐트 포함 */
(function () {
  if (window.__sgbotLoaded) return;
  window.__sgbotLoaded = true;

  var MAIL_IR    = "mailto:41quart@gmail.com?subject=" + encodeURIComponent("[실버가드] IR 자료 요청");
  var MAIL_PILOT = "mailto:41quart@gmail.com?subject=" + encodeURIComponent("[실버가드] 파일럿 도입 상담");
  var MAIL_APPLY = "mailto:41quart@gmail.com?subject=" + encodeURIComponent("[실버가드] 시니어 지원/참여 문의");

  /* 외부 알림 엔드포인트(Formspree 등). 값을 넣으면 접수가 이메일로도 자동 발송됩니다.
     비워두면 기존처럼 브라우저(localStorage)에만 저장합니다. 예) "https://formspree.io/f/xxxxxxx" */
  var LEAD_ENDPOINT = "https://formspree.io/f/mjgzwnvr";

  /* ---------------- 지식 베이스 ---------------- */
  /* kw: 일반 키워드, strong: 가중치 높은 핵심 키워드(특정 의도를 강하게 지목) */
  var KB = [
    { id:"intro", strong:["실버가드가뭐","무슨회사","어떤회사","회사소개"],
      kw:["실버가드","뭐","무엇","무어","소개","어떤 회사","무슨","what","about","개요","정체","하는 일","뭐하는","무슨 회사","뭔가요","뭐예요","뭐에요","어떤곳","어떤 곳"],
      a:"실버가드는 <b>주식회사 마이스터랩</b>이 운영하는 B2G·B2B Tech-HR 플랫폼입니다. AI 정밀 매칭 · 다이내믹 디스패칭 · 온디맨드 휴먼 센서를 결합해, <b>도시의 사각지대를 데이터 자산으로</b> 전환합니다." },

    { id:"solution", strong:["어떻게작동","어떻게돌아","원리"],
      kw:["솔루션","서비스","어떻게","작동","원리","플랫폼","기능","무얼","무엇을 하","어떤 일","어떻게 하","구조","방식","돌아가","동작"],
      a:"11만 공공 API의 예측 신호를 시니어 Pro-Agent의 현장 데이터로 변환합니다.<br>• <b>AI 정밀 매칭</b> — 후보 시니어 자동 추천<br>• <b>다이내믹 디스패칭</b> — 위험 신호에 가장 가까운 요원 즉시 배정<br>• <b>온디맨드 휴먼 센서</b> — 현장 검증 데이터 수집" },

    { id:"agent", strong:["시니어가몇","요원몇명","인력어디서"],
      kw:["시니어","요원","pro-agent","프로에이전트","프로 에이전트","인력","고용","어르신","노인","에이전트","현장 요원","몇 명","어디서 구","사람"],
      a:"전국 <b>600명 이상의 시니어 Pro-Agent</b>가 현장에서 활동합니다. 시니어를 <b>직접 고용</b>하는 모델이며, 국내 65세 이상 잠재 풀은 약 1,100만 명입니다.<br>시니어 지원을 원하시면 '<b>지원</b>'이라고 입력해 주세요!" },

    { id:"proof", strong:["실적이","성과가","지표가"],
      kw:["실적","성과","숫자","지표","규모","커버리지","몇","효과","트랙레코드","레코드","얼마나","결과","수치"],
      a:"주요 지표입니다.<br>• <b>600+</b> 시니어 Pro-Agent<br>• <b>98%</b> HWP 보고서 자동 발행률<br>• <b>4×</b> 기존 점검 대비 커버리지<br>• <b>11만</b> 공공 API 통합<br>• <b>1,336</b> 시설관리 업체 네트워크" },

    { id:"tech", strong:["특허몇","특허가","기술이"],
      kw:["특허","기술","kipris","아이피","ip","알고리즘","엔진","개발","r&d","연구","원천기술","기술력"],
      a:"<b>KIPRIS 특허 4건</b>을 출원했습니다 (10-2026-0050085 외 3건). 핵심 기술은 경로 최적화 엔진, 특징점 추출, 형상 매칭·정렬 검증, 객체 인식·메타 검증으로 구성됩니다." },

    { id:"trust", strong:["믿을수","검증된","신뢰할"],
      kw:["검증","신뢰","믿","증명","레퍼런스","협약","kbs","방송","사실","진짜","공신력","입증"],
      a:"신뢰 설계는 다음과 같습니다.<br>• <b>KBS 생로병사의 비밀</b> 방영 (공영방송 사례)<br>• <b>KIPRIS 특허 4건</b> (기술 IP)<br>• <b>지자체·시설 운영 레퍼런스</b>" },

    { id:"apply", strong:["지원","지원하","지원할","지원방법","채용","모집","구직","취업","일자리","일하고싶","일하고 싶","합류","에이전트지원","요원지원","활동하고싶","해보고싶","해보고 싶"],
      kw:["지원","채용","참여","모집","가입","일자리","합류","지원 방법","시니어 지원","일하","활동","근무","취업","구직","해보고","하고 싶","뽑","모집중","들어가","신청"],
      a:"" /* apply는 동적 안내 — askApply() 사용 */ },

    { id:"clients", strong:["고객이누구","대상이누구","누가쓰"],
      kw:["고객","대상","누구","타겟","지자체","시설","보험사","페르소나","쓰는 곳","사용처","수요","시청","구청","고객사"],
      a:"주요 고객은 <b>지자체</b>(도시 안전망), <b>시설관리 업체</b>(점검 커버리지), <b>보험사</b>(리스크 데이터), 그리고 <b>시니어</b>(일자리)입니다." },

    { id:"control", strong:["control페이지","관제화면","컨트롤보"],
      kw:["control","콘솔","관제","컨트롤","대시보드","모니터","관제화면","운영 콘솔"],
      a:"운영 콘솔(Control)에서 600+ Pro-Agent를 실시간으로 보고, 매칭·디스패치합니다. 👉 <a href='/control'>Control 페이지 보기</a>" },

    { id:"data", strong:["data페이지","데이터보드","데이터대시보드","데이터대쉬보드","데이터화면"],
      kw:["data","데이터","대쉬보드","현황","리포트","통계","데이터보드","데이터 페이지"],
      a:"데이터 대시보드(Data)에서 11만 공공 API 신호와 현장 데이터가 검증 가능한 자산으로 통합됩니다. 👉 <a href='/data'>Data 페이지 보기</a>" },

    { id:"ir", strong:["ir자료","ir받","투자자료","ir덱","ir deck"],
      kw:["ir","투자","자료","피칭","invest","deck","투자유치","라운드","ir 자료","데이터룸","ir덱"],
      a:"IR 자료가 필요하시면 바로 요청하실 수 있습니다. 👉 <a href='" + MAIL_IR + "'>IR 자료 요청하기</a><br>또는 <b>41quart@gmail.com</b> 으로 연락 주세요." },

    { id:"price", strong:["가격이","비용이","얼마","견적"],
      kw:["가격","비용","요금","견적","얼마","단가","수수료","price","cost","가격대","금액","예산"],
      a:"도입 형태(지자체·시설·보험)와 규모에 따라 <b>맞춤 견적</b>으로 안내드립니다.<br>정확한 견적은 👉 <a href='" + MAIL_PILOT + "'>도입 상담 신청</a> 또는 <b>41quart@gmail.com</b> 으로 문의 주세요." },

    { id:"pilot", strong:["도입하려","파일럿","도입상담","계약하","시작하려"],
      kw:["도입","파일럿","문의","상담","계약","시작","연락","제휴","협업","미팅","제안","구매","쓰고 싶","도입하"],
      a:"파일럿 도입 상담을 도와드립니다. 👉 <a href='" + MAIL_PILOT + "'>파일럿 도입 상담 신청</a><br>또는 이메일 <b>41quart@gmail.com</b> 으로 연락 주세요." },

    { id:"company", strong:["대표가누구","회사위치","회사주소","연락처가"],
      kw:["대표","위치","주소","설립","회사정보","마이스터랩","조승연","어디","연락처","이메일","전화","문의처","본사","어디 있"],
      a:"• 운영사: <b>주식회사 마이스터랩</b><br>• 대표: <b>조승연</b><br>• 위치: 경기 화성시 동탄<br>• 설립: 2026.04.29<br>• 이메일: <b>41quart@gmail.com</b>" },

    { id:"greet", strong:[],
      kw:["안녕","하이","ㅎㅇ","반가","좋은 아침","좋은아침","hello","hi","헬로","여보세요"],
      a:"안녕하세요! 실버가드 AI 안내봇입니다. 🛡️<br>회사·솔루션·시니어 지원·도입 상담 등 무엇이든 편하게 물어보세요. 😊" },

    { id:"thanks", strong:[],
      kw:["감사","고마","고맙","thank","ㄱㅅ","수고"],
      a:"도움이 되었다니 기뻐요! 😊 더 궁금한 점이 있으면 언제든지 물어봐 주세요." }
  ];

  var GREETING = "안녕하세요! 실버가드 AI 안내봇입니다. 🛡️<br>회사·솔루션·실적·특허·도입이 궁금하시거나, <b>시니어 일자리에 지원</b>하고 싶으시면 편하게 말씀해 주세요.";
  var CHIPS = [
    ["실버가드가 뭐예요?","intro"],
    ["시니어 일자리 지원할래요","apply"],
    ["주요 실적이 궁금해요","proof"],
    ["특허·기술은?","tech"],
    ["도입 상담하고 싶어요","pilot"],
    ["IR 자료 요청","ir"]
  ];

  /* ---------------- 텍스트 정규화 / 매칭 ---------------- */
  function norm(x){ return (x||"").toLowerCase().replace(/[\s.,!?~^"'`()·\-_/]/g,""); }

  // 의도 점수 계산: strong은 큰 가중치, kw는 길이가중. 양방향 부분일치 허용.
  function scoreItem(item, nq){
    var score=0, matchedLen=0;
    (item.strong||[]).forEach(function(k){
      var nk=norm(k); if(nk && nq.indexOf(nk)>=0){ score+=4; matchedLen+=nk.length; }
    });
    (item.kw||[]).forEach(function(k){
      var nk=norm(k); if(!nk) return;
      if(nq.indexOf(nk)>=0){ score += (nk.length>=4?2:(nk.length>=2?1.3:0.7)); matchedLen+=nk.length; }
    });
    return {score:score, len:matchedLen};
  }

  function bestMatch(q){
    var nq=norm(q);
    if(!nq) return null;
    var best=null, bestScore=0, bestLen=0, ranked=[];
    KB.forEach(function(item){
      var r=scoreItem(item, nq);
      if(r.score>0) ranked.push({id:item.id, item:item, s:r.score, l:r.len});
      if(r.score>bestScore || (r.score===bestScore && r.len>bestLen)){
        bestScore=r.score; bestLen=r.len; best=item;
      }
    });
    ranked.sort(function(a,b){ return (b.s-a.s)||(b.l-a.l); });
    return { best:best, score:bestScore, ranked:ranked };
  }

  // apply(시니어 지원) 의도인지 — 아주 짧은 입력도 유추
  function isApplyIntent(q){
    var nq=norm(q);
    var applyItem=KB.filter(function(k){return k.id==="apply";})[0];
    var hit=false;
    (applyItem.strong||[]).concat(applyItem.kw||[]).forEach(function(k){
      var nk=norm(k); if(nk && nq.indexOf(nk)>=0) hit=true;
    });
    return hit;
  }

  function answer(q){
    var m=bestMatch(q);
    var id = m && m.best ? m.best.id : null;
    logQ(q, id);
    if(m && m.best){
      // 추천 칩: 차순위 주제 1~2개
      var sugg = (m.ranked||[]).filter(function(r){return r.id!==id && r.id!=="greet" && r.id!=="thanks";}).slice(0,2);
      return { a:m.best.a, id:id, sugg:sugg };
    }
    // 못 알아들음 → 가까운 주제 추천
    return { a:"음, 정확히 이해하지 못했어요. 😅 아래 주제 중에서 골라주시거나, 자세한 문의는 <b>41quart@gmail.com</b> 으로 부탁드립니다.", id:null, sugg:"fallback" };
  }

  /* ---------------- 지원(apply) 동적 안내 ---------------- */
  function askApply(){
    return "지원해 주셔서 감사합니다! 🙌<br>실버가드 시니어 Pro-Agent는 만 <b>60세 이상</b>이면 누구나 지원하실 수 있어요.<br><b>성함과 휴대폰 번호</b>만 남겨주시면 바로 접수해 드릴게요.<br>예) <b>홍길동 010-1234-5678</b>";
  }
  function askPhone(name){
    return (name?("<b>"+name+"</b>님, 반가워요! 😊<br>"):"")+"이제 연락 가능한 <b>휴대폰 번호</b>만 남겨주시면 지원 접수가 완료됩니다.<br>예) 010-1234-5678";
  }
  function askContactAgain(){
    return "접수를 위해 <b>휴대폰 번호</b>(또는 이메일)가 필요해요.<br>예) 홍길동 010-1234-5678 처럼 성함과 함께 남겨주세요. 🙏";
  }
  function applyDone(name, c){
    var via=(c.email&&c.phone)?(c.phone+" / "+c.email):(c.phone||c.email);
    return "🎉 <b>지원 접수가 완료되었습니다!</b><br>"+(name?("<b>"+name+"</b>님, "):"")+"남겨주신 연락처(<b>"+via+"</b>)로 담당자가 빠르게 연락드릴게요.<br>실버가드와 함께해 주셔서 감사합니다. 🛡️";
  }
  function inquiryDone(c){
    var via=(c.email&&c.phone)?(c.phone+" / "+c.email):(c.phone||c.email);
    return "접수가 완료되었습니다! ✅<br>남겨주신 연락처(<b>"+via+"</b>)로 담당자가 빠르게 연락드리겠습니다.<br>소속과 관심 분야를 함께 남겨주시면 더 정확히 안내해 드려요. 🙏";
  }

  /* ---------------- 질문 로그 ---------------- */
  function logQ(q, cat){
    try{
      var key="sg_chat_log";
      var arr=JSON.parse(localStorage.getItem(key)||"[]");
      arr.push({ q:q, cat:cat, t:new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(arr.slice(-200)));
    }catch(e){}
  }

  /* ---------------- 연락처/이름 감지 + 접수 저장 ---------------- */
  var RE_EMAIL=/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  var RE_PHONE=/(01[0-9][-.\s]?\d{3,4}[-.\s]?\d{4})|(0\d{1,2}[-.\s]?\d{3,4}[-.\s]?\d{4})|(\d{3}[-.\s]\d{3,4}[-.\s]\d{4})/;
  function detectContact(s){
    var email=(s.match(RE_EMAIL)||[])[0]||"";
    var phoneRaw=(s.match(RE_PHONE)||[])[0]||"";
    var phone=phoneRaw?phoneRaw.replace(/[.\s]/g,"-").replace(/-+/g,"-"):"";
    return (email||phone) ? {email:email, phone:phone} : null;
  }
  var NAME_STOP={"지원":1,"문의":1,"상담":1,"연락":1,"전화":1,"번호":1,"이메일":1,"휴대폰":1,"핸드폰":1,"감사":1,"안녕":1,"실버가드":1,"가능":1,"입니다":1,"부탁":1,"드립니다":1,"해주세요":1,"하고":1,"싶어":1,"싶어요":1,"채용":1,"참여":1,"가입":1,"근무":1,"활동":1,"이에요":1,"예요":1,"네요":1,"여기":1,"제가":1,"저는":1,"이름":1,"성함":1,"입니당":1,"이라고":1,"합니다":1,"메일":1,"주소":1};
  function extractName(s){
    var t=(s||"").replace(/\s+/g,' ').trim();
    var pats=[
      /([가-힣]{2,4})\s*(?:입니다|이라고\s*합니다|이에요|예요|이라고해요|이라구요|입니당|이고요|이구요|이라고요|이라고)/,
      /(?:저는|제\s*이름은|이름은|성함은|나는|제이름은)\s*([가-힣]{2,4})/,
      /(?:이름|성함)\s*[:：]?\s*([가-힣]{2,4})/
    ];
    for(var i=0;i<pats.length;i++){ var m=t.match(pats[i]); if(m && m[1] && !NAME_STOP[m[1]]) return m[1]; }
    var toks=t.match(/[가-힣]{2,4}/g)||[];
    for(var j=0;j<toks.length;j++){ if(!NAME_STOP[toks[j]] && toks[j].length<=4) return toks[j]; }
    return "";
  }
  function postLead(payload){
    if(!LEAD_ENDPOINT) return;            // 엔드포인트 미설정 → 발송 안 함(무해)
    try{
      fetch(LEAD_ENDPOINT, {
        method:"POST",
        headers:{ "Content-Type":"application/json", "Accept":"application/json" },
        body:JSON.stringify(payload)
      }).catch(function(){});
    }catch(e){}
  }
  function saveLead(msg, c, kind, name){
    var rec={ msg:msg, name:name||"", email:c.email||"", phone:c.phone||"", kind:kind||"inquiry", t:new Date().toISOString(), st:"new" };
    try{
      var key="sg_leads";
      var arr=JSON.parse(localStorage.getItem(key)||"[]");
      arr.push(rec);
      localStorage.setItem(key, JSON.stringify(arr.slice(-200)));
    }catch(e){}
    var isApply=(kind==="apply");
    postLead({
      _subject: isApply ? "[실버가드] 🙋 시니어 지원 접수" : "[실버가드] 상담 연락처 접수",
      "유형": isApply ? "시니어 지원" : "상담 문의",
      "성함": rec.name||"(미입력)",
      "연락처": rec.phone||rec.email||"(미입력)",
      "전화": rec.phone||"",
      "이메일": rec.email||"",
      "메시지": msg||"",
      "페이지": (typeof location!=="undefined" && location.href)||"",
      "접수시각": rec.t
    });
  }

  /* ---------------- UI ---------------- */
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
  .sgbot-bot{align-self:flex-start;background:#152033;color:#E7ECF5;border:1px solid #223149;border-top-left-radius:4px}\
  .sgbot-user{align-self:flex-end;background:#00D9FF;color:#06121a;border-top-right-radius:4px;font-weight:600}\
  .sgbot-bot a{color:#00D9FF;font-weight:700}\
  .sgbot-inline{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}\
  .sgbot-inline button{background:#11192a;border:1px solid #28395a;color:#9fe9ff;border-radius:20px;padding:5px 11px;font-size:11.5px;cursor:pointer;font-family:inherit}\
  .sgbot-inline button:hover{border-color:#00D9FF;color:#fff}\
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

    // 대화 상태
    var applyPending=false;   // 지원 의도 후 연락처 대기중
    var pendingName="";       // 먼저 받은 성함 보관

    function push(text, who, inlineChips){
      var m=document.createElement('div');
      m.className='sgbot-msg '+(who==='user'?'sgbot-user':'sgbot-bot');
      m.innerHTML=text;
      if(inlineChips && inlineChips.length){
        var wrap=document.createElement('div'); wrap.className='sgbot-inline';
        inlineChips.forEach(function(c){
          var b=document.createElement('button'); b.textContent=c.label;
          b.onclick=function(){ handleChip(c.label, c.id); };
          wrap.appendChild(b);
        });
        m.appendChild(wrap);
      }
      body.appendChild(m); body.scrollTop=body.scrollHeight;
    }
    function botReply(text, inlineChips){ setTimeout(function(){ push(text,'bot',inlineChips); }, 280); }

    function chipObjs(ranked){
      return (ranked||[]).map(function(r){
        var item=KB.filter(function(k){return k.id===r.id;})[0];
        return { id:r.id, label:chipLabel(r.id) };
      });
    }
    function chipLabel(id){
      var m={intro:"실버가드 소개",solution:"솔루션 작동방식",agent:"시니어 인력",proof:"주요 실적",tech:"특허·기술",trust:"검증·신뢰",apply:"시니어 지원",clients:"주요 고객",control:"Control 보기",data:"Data 보기",ir:"IR 자료",price:"가격·견적",pilot:"도입 상담",company:"회사 정보"};
      return m[id]||id;
    }

    function renderChips(){
      chips.innerHTML='';
      CHIPS.forEach(function(c){
        var b=document.createElement('button'); b.className='sgbot-chip'; b.textContent=c[0];
        b.onclick=function(){ handleChip(c[0], c[1]); };
        chips.appendChild(b);
      });
    }

    function handleChip(label, id){
      push(label,'user');
      logQ(label, id);
      if(id==="apply"){ applyPending=true; pendingName=""; botReply(askApply()); return; }
      var item=KB.filter(function(k){return k.id===id;})[0];
      botReply(item?item.a:answer(label).a);
    }

    function open(){ panel.classList.add('open'); launch.style.display='none'; if(!greeted){ greeted=true; push(GREETING,'bot'); renderChips(); } input.focus(); }
    function close(){ panel.classList.remove('open'); launch.style.display='flex'; }

    launch.onclick=open;
    panel.querySelector('.sgbot-x').onclick=close;

    form.onsubmit=function(e){
      e.preventDefault();
      var q=input.value.trim(); if(!q) return;
      push(q,'user'); input.value='';

      var c=detectContact(q);
      var nm=extractName(q);
      var applyNow=isApplyIntent(q);

      // 1) 연락처가 들어옴 → 접수 저장
      if(c){
        var kind=(applyPending||applyNow)?"apply":"inquiry";
        var nameFinal=nm||pendingName||"";
        saveLead(q, c, kind, nameFinal);
        logQ(q, kind==="apply"?"apply":null);
        applyPending=false; pendingName="";
        botReply(kind==="apply"?applyDone(nameFinal,c):inquiryDone(c));
        return;
      }

      // 2) 지원 대기 상태에서 연락처 없이 답함
      if(applyPending){
        logQ(q,"apply");
        if(nm){ pendingName=nm; botReply(askPhone(nm)); }
        else botReply(askContactAgain());
        return;
      }

      // 3) 새로운 지원 의도(연락처 없음) → 접수 안내 시작
      if(applyNow){
        applyPending=true; pendingName=nm||"";
        logQ(q,"apply");
        botReply(askApply());
        return;
      }

      // 4) 일반 지식 응답
      var res=answer(q);
      if(res.sugg==="fallback"){
        botReply(res.a, chipObjs([{id:"intro"},{id:"apply"},{id:"pilot"},{id:"company"}]));
      } else {
        botReply(res.a, chipObjs(res.sugg));
      }
    };
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
