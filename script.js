/* ==========================================================================
   SALUS FITNESS GYM — script.js
   Vanilla JS (no build step). Handles: loader, nav, scroll reveal, counters,
   tilt cards, before/after slider, gallery filter + lightbox, testimonial
   carousel, BMI/Calorie calculators, workout timer, FAQ accordion, contact
   form validation, cursor glow, scroll progress, floating buttons.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Loader ---------------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => loader && loader.classList.add('done'), 500);
  });
  // fail-safe in case load event already fired
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('done');
  }, 2500);

  /* ---------------- Scroll progress + navbar state ---------------- */
  const progress = document.getElementById('scroll-progress');
  const navbar = document.getElementById('navbar');
  const backTop = document.getElementById('fab-top');

  function onScroll(){
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    if (progress) progress.style.width = scrolled + '%';
    if (navbar) navbar.classList.toggle('scrolled', h.scrollTop > 40);
    if (backTop) backTop.classList.toggle('show', h.scrollTop > 500);
  }
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  backTop && backTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  /* ---------------- Mobile nav ---------------- */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');
  burger && burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks && navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  }));

  /* ---------------- Active nav link on scroll ---------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin:'-45% 0px -50% 0px' });
  sections.forEach(s => navObserver.observe(s));

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold:0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------- Animated counters ---------------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();
      function tick(now){
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.textContent = (decimals ? val.toFixed(decimals) : Math.floor(val)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = (decimals ? target.toFixed(decimals) : target) + suffix;
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold:0.4 });
  counters.forEach(el => counterObserver.observe(el));

  /* ---------------- Tilt effect on program / trainer cards ---------------- */
  document.querySelectorAll('.p-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ---------------- Cursor glow (desktop only) ---------------- */
  const glow = document.getElementById('cursor-glow');
  if (glow && window.matchMedia('(pointer:fine)').matches){
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  } else if (glow){
    glow.style.display = 'none';
  }

  /* ---------------- Before / After slider ---------------- */
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const after = slider.querySelector('.ba-after');
    const handle = slider.querySelector('.ba-handle');
    let dragging = false;

    function setPos(clientX){
      const r = slider.getBoundingClientRect();
      let pct = ((clientX - r.left) / r.width) * 100;
      pct = Math.max(2, Math.min(98, pct));
      after.style.clipPath = `inset(0 0 0 ${pct}%)`;
      handle.style.left = pct + '%';
    }
    slider.addEventListener('mousedown', () => dragging = true);
    window.addEventListener('mouseup', () => dragging = false);
    slider.addEventListener('mousemove', (e) => { if (dragging) setPos(e.clientX); });
    slider.addEventListener('mousemove', (e) => { if (!dragging) return; });
    slider.addEventListener('click', (e) => setPos(e.clientX));
    slider.addEventListener('touchstart', (e) => setPos(e.touches[0].clientX), { passive:true });
    slider.addEventListener('touchmove', (e) => setPos(e.touches[0].clientX), { passive:true });
  });

  /* ---------------- Gallery filter + lightbox ---------------- */
  const filters = document.querySelectorAll('.g-filter');
  const gItems = document.querySelectorAll('.g-item');
  filters.forEach(f => f.addEventListener('click', () => {
    filters.forEach(x => x.classList.remove('active'));
    f.classList.add('active');
    const cat = f.dataset.filter;
    gItems.forEach(item => {
      item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
    });
  }));

  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox ? lightbox.querySelector('img') : null;
  gItems.forEach(item => item.addEventListener('click', () => {
    lbImg.src = item.querySelector('img').src;
    lightbox.classList.add('open');
  }));
  lightbox && lightbox.addEventListener('click', () => lightbox.classList.remove('open'));

  /* ---------------- Testimonial carousel ---------------- */
  const track = document.getElementById('t-track');
  const slides = track ? track.children.length : 0;
  const perView = window.innerWidth >= 900 ? 3 : 1;
  let tIndex = 0;
  function updateTrack(){
    const pv = window.innerWidth >= 900 ? 3 : 1;
    const maxIndex = Math.max(0, slides - pv);
    tIndex = Math.min(tIndex, maxIndex);
    track.style.transform = `translateX(-${tIndex * (100 / pv)}%)`;
  }
  document.getElementById('t-next') && document.getElementById('t-next').addEventListener('click', () => {
    const pv = window.innerWidth >= 900 ? 3 : 1;
    const maxIndex = Math.max(0, slides - pv);
    tIndex = tIndex >= maxIndex ? 0 : tIndex + 1;
    updateTrack();
  });
  document.getElementById('t-prev') && document.getElementById('t-prev').addEventListener('click', () => {
    const pv = window.innerWidth >= 900 ? 3 : 1;
    const maxIndex = Math.max(0, slides - pv);
    tIndex = tIndex <= 0 ? maxIndex : tIndex - 1;
    updateTrack();
  });
  window.addEventListener('resize', updateTrack);
  if (track){
    setInterval(() => { document.getElementById('t-next') && document.getElementById('t-next').click(); }, 6000);
  }

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---------------- Calculator tabs ---------------- */
  document.querySelectorAll('.calc-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.target).classList.add('active');
    });
  });

  /* ---------------- BMI Calculator ---------------- */
  const bmiForm = document.getElementById('bmi-form');
  bmiForm && bmiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const height = parseFloat(document.getElementById('bmi-height').value) / 100;
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    if (!height || !weight) return;
    const bmi = weight / (height * height);
    let tag = 'Normal', color = 'var(--neon)';
    if (bmi < 18.5) tag = 'Underweight';
    else if (bmi >= 25 && bmi < 30) tag = 'Overweight';
    else if (bmi >= 30) tag = 'Obese';
    document.getElementById('bmi-result-num').textContent = bmi.toFixed(1);
    document.getElementById('bmi-result-tag').textContent = tag;
    document.getElementById('bmi-note').textContent =
      'BMI is a general screening tool and does not account for muscle mass. Talk to our trainers for a full body composition assessment.';
  });

  /* ---------------- Calorie Calculator ---------------- */
  const calForm = document.getElementById('calorie-form');
  calForm && calForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const gender = document.getElementById('cal-gender').value;
    const age = parseFloat(document.getElementById('cal-age').value);
    const height = parseFloat(document.getElementById('cal-height').value);
    const weight = parseFloat(document.getElementById('cal-weight').value);
    const activity = parseFloat(document.getElementById('cal-activity').value);
    if (!age || !height || !weight) return;
    let bmr = gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
    const total = Math.round(bmr * activity);
    document.getElementById('cal-result-num').textContent = total;
    document.getElementById('cal-result-tag').textContent = 'Estimated Daily Calories';
    document.getElementById('cal-note').textContent =
      'This is a general estimate (Mifflin-St Jeor formula). Our nutrition coaches can tailor a precise plan to your goals.';
  });

  /* ---------------- Workout Timer ---------------- */
  let timerInterval = null, timerSeconds = 0, timerRunning = false;
  const timerDisplay = document.getElementById('timer-display');
  function renderTimer(){
    const m = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
    const s = String(timerSeconds % 60).padStart(2, '0');
    if (timerDisplay) timerDisplay.textContent = `${m}:${s}`;
  }
  document.getElementById('timer-start') && document.getElementById('timer-start').addEventListener('click', () => {
    if (timerRunning) return;
    timerRunning = true;
    timerInterval = setInterval(() => { timerSeconds++; renderTimer(); }, 1000);
  });
  document.getElementById('timer-pause') && document.getElementById('timer-pause').addEventListener('click', () => {
    timerRunning = false;
    clearInterval(timerInterval);
  });
  document.getElementById('timer-reset') && document.getElementById('timer-reset').addEventListener('click', () => {
    timerRunning = false;
    clearInterval(timerInterval);
    timerSeconds = 0;
    renderTimer();
  });

  /* ---------------- Contact form validation ---------------- */
  const contactForm = document.getElementById('contact-form');
  contactForm && contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const name = document.getElementById('cf-name');
    const phone = document.getElementById('cf-phone');
    const email = document.getElementById('cf-email');
    const message = document.getElementById('cf-message');

    function check(input, cond){
      const field = input.closest('.field');
      field.classList.toggle('invalid', !cond);
      if (!cond) valid = false;
    }
    check(name, name.value.trim().length >= 2);
    check(phone, /^[0-9+\s-]{7,15}$/.test(phone.value.trim()));
    check(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
    check(message, message.value.trim().length >= 5);

    if (!valid) return;

    contactForm.style.display = 'none';
    document.getElementById('form-success').classList.add('show');
    setTimeout(() => {
      contactForm.reset();
      contactForm.style.display = '';
      document.getElementById('form-success').classList.remove('show');
      document.querySelectorAll('.field.invalid').forEach(f => f.classList.remove('invalid'));
    }, 4000);
  });

  /* ---------------- Newsletter ---------------- */
  const nlForm = document.getElementById('newsletter-form');
  nlForm && nlForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = nlForm.querySelector('button');
    const original = btn.textContent;
    btn.textContent = 'Subscribed ✓';
    nlForm.querySelector('input').value = '';
    setTimeout(() => btn.textContent = original, 2500);
  });

  /* ---------------- Dark/Light toggle (theme accent stays dark-luxury; toggles a "light card" mode) ---------------- */
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle && themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('light-mode')){
      icon.classList.remove('fa-moon'); icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun'); icon.classList.add('fa-moon');
    }
  });

});
