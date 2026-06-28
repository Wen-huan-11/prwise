// ─── i18n ───
let currentLang = localStorage.getItem('prwise_lang') || 'zh';

function applyLang(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (i18n[key] && i18n[key][lang]) {
      el.textContent = i18n[key][lang];
    }
  });
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  const toggle = document.getElementById('langLabel');
  if (toggle) toggle.textContent = lang === 'zh' ? 'EN' : '中文';
  currentLang = lang;
  localStorage.setItem('prwise_lang', lang);
  document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
}

function switchLang() {
  applyLang(currentLang === 'zh' ? 'en' : 'zh');
}

// ─── Mobile Menu ───
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const icon = document.getElementById('menuIcon');
  if (!menu) return;
  const isOpen = menu.classList.contains('open');
  menu.classList.toggle('open');
  menu.classList.toggle('closed');
  if (icon) {
    icon.textContent = isOpen ? '☰' : '✕';
  }
}

document.addEventListener('click', function (e) {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('mobileMenuBtn');
  if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.remove('open');
    menu.classList.add('closed');
    const icon = document.getElementById('menuIcon');
    if (icon) icon.textContent = '☰';
  }
});

// ─── Scroll Animation ───
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.animate-in').forEach(el => scrollObserver.observe(el));

// ─── Counter Animation ───
function animateCounter(el, target) {
  const step = Math.max(1, Math.floor(target / 60));
  let current = 0;
  const increment = () => {
    current += step;
    if (current >= target) { el.textContent = target; return; }
    el.textContent = current;
    requestAnimationFrame(() => setTimeout(increment, 30));
  };
  increment();
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      if (!el.dataset.animated) {
        el.dataset.animated = 'true';
        animateCounter(el, target);
      }
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ─── FAQ Toggle ───
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const icon = btn.querySelector('svg');
  const isHidden = answer.classList.contains('hidden');
  answer.classList.toggle('hidden');
  if (icon) icon.classList.toggle('rotate-180');
}

// ─── Interactive Demo ───
let demoAborted = false;

function loadSampleCode() {
  const ta = document.getElementById('codeInput');
  if (!ta) return;
  ta.value = `function getUser(id) {
  const data = fetch(\`/users/\${id}\`);
  return data.json();
}`;
  ta.dispatchEvent(new Event('input'));
}

function startReview() {
  const ta = document.getElementById('codeInput');
  const btn = document.getElementById('reviewBtn');
  const resultArea = document.getElementById('reviewResult');
  const qualityArea = document.getElementById('qualityResult');
  const loadingBar = document.getElementById('loadingBar');
  const loadingContainer = document.getElementById('loadingContainer');

  if (!ta || !btn || !resultArea) return;

  // Reset
  demoAborted = false;
  resultArea.innerHTML = '';
  if (qualityArea) qualityArea.innerHTML = '';
  if (loadingContainer) loadingContainer.classList.remove('hidden');

  btn.disabled = true;
  btn.textContent = i18n['interactive_btn_loading']?.[currentLang] || '⏳ 正在分析代码...';
  btn.classList.add('opacity-60', 'cursor-not-allowed');

  // Progress bar animation
  if (loadingBar) {
    loadingBar.style.width = '0%';
    loadingBar.style.transition = 'none';
    setTimeout(() => {
      loadingBar.style.transition = 'width 2.5s ease';
      loadingBar.style.width = '90%';
    }, 50);
  }

  // Simulate AI analysis delay
  let step = 0;
  const steps = [
    { delay: 400, action: () => updateStatus('Parsing code diff...') },
    { delay: 900, action: () => updateStatus('Analyzing logic flow...') },
    { delay: 1400, action: () => updateStatus('Checking for security issues...') },
    { delay: 1900, action: () => updateStatus('Evaluating code quality...') },
    { delay: 2400, action: () => showResults() },
  ];

  function updateStatus(msg) {
    if (demoAborted) return;
    const el = document.getElementById('statusText');
    if (el) el.textContent = msg;
  }

  function showResults() {
    if (demoAborted) return;
    if (loadingBar) loadingBar.style.width = '100%';
    if (loadingContainer) loadingContainer.classList.add('hidden');

    btn.disabled = false;
    btn.textContent = i18n['interactive_btn_done']?.[currentLang] || '✅ Review Complete';
    btn.classList.remove('opacity-60', 'cursor-not-allowed');

    const findings = [
      { severity: 'error', title: i18n['interactive_finding_1_title']?.[currentLang] || 'Missing await', desc: i18n['interactive_finding_1_desc']?.[currentLang] || '' },
      { severity: 'warning', title: i18n['interactive_finding_2_title']?.[currentLang] || 'Missing null check', desc: i18n['interactive_finding_2_desc']?.[currentLang] || '' },
      { severity: 'info', title: i18n['interactive_finding_3_title']?.[currentLang] || 'Type annotation suggestion', desc: i18n['interactive_finding_3_desc']?.[currentLang] || '' },
      { severity: 'error', title: i18n['interactive_finding_4_title']?.[currentLang] || 'Missing error handling', desc: i18n['interactive_finding_4_desc']?.[currentLang] || '' },
    ];

    const severityMap = {
      error: { icon: '✕', border: 'border-red-500/20', bg: 'bg-red-500/5', titleClass: 'text-red-300', iconClass: 'text-red-400' },
      warning: { icon: '⚠', border: 'border-yellow-500/20', bg: 'bg-yellow-500/5', titleClass: 'text-yellow-300', iconClass: 'text-yellow-400' },
      info: { icon: '✓', border: 'border-green-500/20', bg: 'bg-green-500/5', titleClass: 'text-green-300', iconClass: 'text-green-400' },
    };

    findings.forEach((f, i) => {
      const s = severityMap[f.severity] || severityMap.info;
      const div = document.createElement('div');
      div.className = `review-item flex items-start gap-3 p-3 ${s.bg} rounded-lg border ${s.border}`;
      div.style.animation = 'none';
      div.innerHTML = `<span class="${s.iconClass} shrink-0 mt-0.5 font-bold">${s.icon}</span>
<div><div class="${s.titleClass} font-medium text-sm">${f.title}</div>
<div class="text-xs text-slate-500 mt-0.5">${f.desc}</div></div>`;
      resultArea.appendChild(div);
    });

    // Quality score
    if (qualityArea) {
      qualityArea.innerHTML = `<div class="review-item flex items-center gap-4 p-4 bg-brand-500/5 rounded-lg border border-brand-500/20">
<div class="w-16 h-16 rounded-full border-4 border-brand-500 flex items-center justify-center text-xl font-bold text-brand-400 shrink-0">65</div>
<div>
<div class="text-sm font-medium text-brand-300">${i18n['interactive_quality_title']?.[currentLang] || 'Code Quality Score'}</div>
<div class="text-xs text-slate-500 mt-1">${i18n['interactive_quality_label']?.[currentLang] || 'Maintainability'}: 65/100</div>
<div class="w-full bg-slate-700 rounded-full h-1.5 mt-2"><div class="bg-brand-500 h-1.5 rounded-full" style="width:65%"></div></div>
</div>
</div>`;
    }

    // Re-trigger animation
    document.querySelectorAll('.review-item').forEach((el, i) => {
      el.style.animation = `fadeInUp 0.4s ease forwards`;
      el.style.animationDelay = `${i * 0.15}s`;
    });
  }

  // Run steps
  steps.forEach(s => setTimeout(s.action, s.delay));
}

// ─── Scroll Progress ───
function updateScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  bar.style.transform = `scaleX(${progress / 100})`;
}

// ─── Smooth scroll for anchor links ───
document.addEventListener('click', function (e) {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const targetId = link.getAttribute('href');
  if (targetId === '#') return;
  const target = document.querySelector(targetId);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Close mobile menu if open
    const menu = document.getElementById('mobileMenu');
    if (menu && menu.classList.contains('open')) {
      menu.classList.remove('open');
      menu.classList.add('closed');
      const icon = document.getElementById('menuIcon');
      if (icon) icon.textContent = '☰';
    }
  }
});

// ─── Intersection Observer for Nav highlight ───
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!navLinks.length) return;
  let currentSection = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      currentSection = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('text-white');
    link.classList.add('text-slate-400');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.remove('text-slate-400');
      link.classList.add('text-white');
    }
  });
}

// ─── Initialize ───
document.addEventListener('DOMContentLoaded', function () {
  applyLang(currentLang);

  // Scroll progress
  window.addEventListener('scroll', updateScrollProgress);
  updateScrollProgress();

  // Active nav
  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // Animate-in observer for new elements
  document.querySelectorAll('.animate-in').forEach(el => scrollObserver.observe(el));

  // Counter observer for new elements
  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));
});
