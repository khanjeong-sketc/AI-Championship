// === Countdown Timer ===
var DEADLINE = new Date('2026-04-15T18:00:00+09:00');
function updateCountdown() {
  var now = new Date();
  var diff = DEADLINE - now;
  var d = document.getElementById('cd-days');
  var h = document.getElementById('cd-hours');
  var m = document.getElementById('cd-mins');
  var s = document.getElementById('cd-secs');
  if (!d) return;
  if (diff <= 0) { d.textContent='0'; h.textContent='00'; m.textContent='00'; s.textContent='00'; return; }
  d.textContent = Math.floor(diff/(1000*60*60*24));
  h.textContent = String(Math.floor((diff%(1000*60*60*24))/(1000*60*60))).padStart(2,'0');
  m.textContent = String(Math.floor((diff%(1000*60*60))/(1000*60))).padStart(2,'0');
  s.textContent = String(Math.floor((diff%(1000*60))/1000)).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// === Section-based Scroll Reveal ===
// Each section's children start hidden and reveal when the SECTION enters viewport
function initSectionReveal() {
  // Mark all revealable children inside each .section as hidden
  document.querySelectorAll('.section, .cta-section').forEach(function(section) {
    var children = section.querySelectorAll(
      '.section-label, .section-title, .section-desc, .sub-section-title, ' +
      '.persona-card, .prize-hero, .prize-card, .prize-extra, ' +
      '.track-card, .tl-step, .step, .step-arrow, .steps-divider, ' +
      '.kiro-demo, .support-card, .partners, ' +
      '.faq-item, .cta-content, .prize-card-group, .prize-track-title'
    );
    children.forEach(function(el) {
      el.classList.add('reveal-hidden');
    });
  });

  // Observe each section
  var sectionObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        revealSection(entry.target);
        sectionObs.unobserve(entry.target); // only once
      }
    });
  }, { threshold: 0.35 });

  document.querySelectorAll('.section, .cta-section').forEach(function(section) {
    sectionObs.observe(section);
  });
}

function revealSection(section) {
  var children = section.querySelectorAll('.reveal-hidden');
  children.forEach(function(el, i) {
    setTimeout(function() {
      el.classList.add('reveal-visible');
    }, i * 80); // stagger 80ms per element
  });
}

// === Prize Counter (scroll-triggered) ===
function initPrizeCounter() {
  var el = document.getElementById('prize-counter');
  var section = document.getElementById('prizes');
  if (!el || !section) return;
  var fired = false;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting && !fired) {
        fired = true;
        var start = 1000000, end = 10000000, dur = 3000, t0 = performance.now();
        function tick(now) {
          var p = Math.min((now - t0) / dur, 1);
          var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          el.textContent = Math.floor(start + (end - start) * eased).toLocaleString('ko-KR');
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }
    });
  }, { threshold: 0.3 });
  obs.observe(section);
}

// === FAQ Accordion ===
document.querySelectorAll('.faq-question').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var item = btn.closest('.faq-item');
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(function(i) { i.classList.remove('open'); });
    if (!isOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded','true'); }
    else { btn.setAttribute('aria-expanded','false'); }
  });
});

// === Timeline (scroll-triggered) ===
function initTimeline() {
  var steps = document.querySelectorAll('.tl-step');
  if (!steps.length) return;
  var current = 0;
  var DURATION = 2250;
  var interval = null;
  function activate(idx) { steps.forEach(function(s,i) { s.classList.toggle('active', i===idx); }); }
  var tlSection = document.getElementById('schedule');
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting && !interval) {
        activate(0);
        interval = setInterval(function() { current = (current+1) % steps.length; activate(current); }, DURATION);
      }
    });
  }, { threshold: 0.3 });
  obs.observe(tlSection);
}

// === Scroll Arrow ===
var arrow = document.getElementById('scroll-arrow');
if (arrow) arrow.addEventListener('click', function() {
  var target = document.getElementById('why');
  if (target) target.scrollIntoView({ behavior: 'smooth' });
});

// === Track Selection ===
document.querySelectorAll('.track-card').forEach(function(card) {
  card.addEventListener('click', function() {
    var parent = card.closest('.track-cards');
    var was = card.classList.contains('selected');
    parent.querySelectorAll('.track-card').forEach(function(c) { c.classList.remove('selected'); });
    parent.classList.remove('has-selection');
    if (!was) { card.classList.add('selected'); parent.classList.add('has-selection'); }
  });
});

// === Kiro Demo (scroll-triggered) ===
function initKiroDemo() {
  var msgs = document.getElementById('chat-messages');
  var status = document.getElementById('kiro-status');
  var demoEl = document.getElementById('kiro-demo');
  if (!msgs || !demoEl) return;

  var chatScript = [
    { type: 'kiro', text: '안녕하세요! 저는 <span class="highlight">Kiro</span>예요 🤖' },
    { type: 'kiro', text: 'AWS에서 만든 AI 에이전트입니다.' },
    { type: 'kiro', text: '코드를 몰라도 괜찮아요. <span class="highlight">아이디어만 말해주세요.</span>' },
    { type: 'kiro', text: '그럼 아이디어를 말해주세요! 💬' },
    { type: 'user', text: '매주 반복되는 매출 보고서를 자동으로 만들고 싶어요' },
    { type: 'kiro', text: '좋은 아이디어네요! 바로 만들어 볼게요 🚀' },
    { type: 'ide' },
    { type: 'result' },
    { type: 'kiro', text: '저와 함께라면 할 수 있어요! ✨', final: true },
  ];

  var codeLines = [
    '> 프로젝트 분석 중...',
    '> 데이터 소스 연결: Google Sheets API',
    '> 매출 데이터 수집 모듈 생성...',
    '> 보고서 템플릿 설계...',
    '> 자동 발송 스케줄러 구성...',
    '> 테스트 실행 중... ✓ 통과',
    '> 배포 준비 완료!',
  ];

  var fired = false;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting && !fired) { fired = true; runDemo(); }
    });
  }, { threshold: 0.3 });
  obs.observe(demoEl);

  function scrollDown() { msgs.scrollTop = msgs.scrollHeight; }

  function addBubble(type, html, cls) {
    var el = document.createElement('div');
    el.className = cls || ('chat-bubble ' + type);
    el.innerHTML = html;
    msgs.appendChild(el);
    scrollDown();
  }

  function runDemo() {
    var idx = 0;
    function processNext() {
      if (idx >= chatScript.length) { if (status) status.textContent = 'online'; return; }
      var item = chatScript[idx];

      if (item.type === 'ide') {
        setTimeout(function() {
          var ide = document.createElement('div');
          ide.className = 'chat-ide';
          ide.innerHTML = '<div class="ide-header"><span class="ide-dot red"></span><span class="ide-dot yellow"></span><span class="ide-dot green"></span><span class="ide-title">Kiro — 프로젝트 생성 중...</span></div><div class="ide-body"></div>';
          msgs.appendChild(ide); scrollDown();
          var body = ide.querySelector('.ide-body');
          var j = 0;
          function typeLine() {
            if (j >= codeLines.length) {
              setTimeout(function() {
                ide.querySelector('.ide-title').textContent = 'Kiro — 완료!';
                var res = document.createElement('div');
                res.className = 'ide-result';
                res.innerHTML = '<p>✅ 프로젝트 완성!</p>';
                ide.appendChild(res); scrollDown();
                idx++; setTimeout(processNext, 800);
              }, 400);
              return;
            }
            setTimeout(function() {
              var line = document.createElement('span');
              line.className = 'typed-line';
              line.textContent = codeLines[j];
              body.appendChild(line); scrollDown();
              j++; typeLine();
            }, 300);
          }
          typeLine();
        }, 500);
        return;
      }

      if (item.type === 'result') {
        setTimeout(function() {
          var preview = document.createElement('div');
          preview.className = 'chat-result-preview';
          preview.innerHTML = '<div class="result-mockup"><div class="mockup-header">📊 주간 매출 보고서</div><div class="mockup-table"><div class="mockup-row"><span class="mockup-label">서울</span><span class="mockup-value">₩12,400만</span><div class="mockup-bar-wrap"><div class="mockup-bar" style="width:94%"></div></div></div><div class="mockup-row"><span class="mockup-label">부산</span><span class="mockup-value">₩8,700만</span><div class="mockup-bar-wrap"><div class="mockup-bar" style="width:66%"></div></div></div><div class="mockup-row"><span class="mockup-label">대구</span><span class="mockup-value">₩6,200만</span><div class="mockup-bar-wrap"><div class="mockup-bar" style="width:47%"></div></div></div><div class="mockup-row"><span class="mockup-label">인천</span><span class="mockup-value">₩9,800만</span><div class="mockup-bar-wrap"><div class="mockup-bar" style="width:74%"></div></div></div><div class="mockup-row"><span class="mockup-label">광주</span><span class="mockup-value">₩4,500만</span><div class="mockup-bar-wrap"><div class="mockup-bar" style="width:34%"></div></div></div></div><div class="mockup-footer">총 매출 ₩41,600만 · 전주 대비 +8.2% · 자동 생성 완료</div></div>';
          msgs.appendChild(preview); scrollDown();
          idx++; setTimeout(processNext, 1000);
        }, 600);
        return;
      }

      if (status) status.textContent = item.type === 'kiro' ? 'typing...' : '';
      setTimeout(function() {
        if (item.final) { addBubble('kiro', item.text, 'chat-final'); }
        else { addBubble(item.type, item.text); }
        if (status) status.textContent = 'online';
        idx++; processNext();
      }, 1000);
    }
    processNext();
  }
}

// === Init ===
window.addEventListener('DOMContentLoaded', function() {
  initSectionReveal();
  initPrizeCounter();
  initTimeline();
  initKiroDemo();
});
