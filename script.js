// ===========================================================
// Praveen Kumar Gattem — Portfolio interactions
// ===========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- scroll progress bar ---------- */
  const progressFill = document.getElementById('progressFill');
  function updateProgress(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressFill) progressFill.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- mobile menu toggle ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const navbar = document.getElementById('navbar');

  if (menuToggle && navbar){
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      navbar.classList.toggle('open');
    });

    navbar.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navbar.classList.remove('open');
      });
    });
  }

  /* ---------- active nav link on scroll (IntersectionObserver) ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function setActiveLink(id){
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === id);
    });
  }

  if ('IntersectionObserver' in window && sections.length){
    const navObserver = new IntersectionObserver((entries) => {
      // pick the entry most visible in viewport
      let best = null;
      entries.forEach(entry => {
        if (entry.isIntersecting){
          if (!best || entry.intersectionRatio > best.intersectionRatio){
            best = entry;
          }
        }
      });
      if (best) setActiveLink(best.target.id);
    }, { threshold: [0.2, 0.4, 0.6], rootMargin: '-80px 0px -40% 0px' });

    sections.forEach(section => navObserver.observe(section));
  }

  /* ---------- generic scroll-reveal ---------- */
  const revealTargets = document.querySelectorAll(
    '.about-text, .about-stats, .stat-card, .edu-row, .pipeline-col, .cert-item, .timeline-item, .project-card, .contact-info, .contact-form'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window){
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- animated stat counters ---------- */
  const counters = document.querySelectorAll('.stat-num');

  function animateCounter(el){
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    const duration = 1100;
    const start = performance.now();

    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1){
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window && counters.length){
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  /* ---------- hero typing cycle ---------- */
  const cycleWrap = document.querySelector('.hero-cycle-wrap');
  if (cycleWrap){
    const words = ['retrieve', 'understand', 'generate', 'respond'];
    const cursor = cycleWrap.querySelector('.hero-cursor');
    let wordIndex = 0;
    let charIndex = words[0].length;
    let deleting = false;

    function renderWord(){
      const current = words[wordIndex];
      const visible = current.slice(0, charIndex);
      cycleWrap.textContent = visible;
      if (cursor) cycleWrap.appendChild(cursor);
    }

    function step(){
      const current = words[wordIndex];

      if (!deleting){
        if (charIndex < current.length){
          charIndex++;
          renderWord();
          setTimeout(step, 90);
        } else {
          deleting = true;
          setTimeout(step, 1400);
        }
      } else {
        if (charIndex > 0){
          charIndex--;
          renderWord();
          setTimeout(step, 50);
        } else {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(step, 200);
        }
      }
    }

    // kick off after initial fade-in
    setTimeout(step, 1800);
  }

  /* ---------- contact form (client-side only, no backend wired) ---------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm){
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('#cf-name').value.trim();
      const email = contactForm.querySelector('#cf-email').value.trim();
      const message = contactForm.querySelector('#cf-message').value.trim();

      if (!name || !email || !message){
        if (formStatus) formStatus.textContent = 'Please fill in every field before sending.';
        return;
      }

      // No backend is connected yet — fall back to opening the user's mail client
      // with the message pre-filled, so the form is functional out of the box.
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:gattempraveen88@gmail.com?subject=${subject}&body=${body}`;

      if (formStatus) formStatus.textContent = 'Opening your email client to send this message...';
      contactForm.reset();
    });
  }

  console.log('Praveen Kumar Gattem — Portfolio loaded 🚀');
});
