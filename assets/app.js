(() => {
  const qs = (s, root=document) => root.querySelector(s);
  const qsa = (s, root=document) => [...root.querySelectorAll(s)];

  // Reveals
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .10 });
  qsa('.reveal').forEach(el => observer.observe(el));

  // Mobile menu
  const toggle = qs('#menuToggle');
  const nav = qs('#navLinks');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  qsa('#navLinks a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  }));

  // Project filters
  const buttons = qsa('#projectFilters button');
  const cards = qsa('#projectGrid .project-card');
  buttons.forEach(btn => btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    cards.forEach(card => {
      const categories = (card.dataset.category || '').split(' ');
      card.classList.toggle('hidden', filter !== 'all' && !categories.includes(filter));
    });
  }));

  // Cursor glow
  const glow = qs('#cursorGlow');
  if (window.matchMedia('(pointer:fine)').matches && glow) {
    window.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  // Magnetic buttons
  if (window.matchMedia('(pointer:fine)').matches) {
    qsa('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * .08}px, ${y * .08}px)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
  }

  // Gentle portrait parallax
  const heroArt = qs('.hero-art');
  const frame = qs('.portrait-frame');
  if (heroArt && frame && window.matchMedia('(pointer:fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroArt.addEventListener('mousemove', e => {
      const r = heroArt.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      frame.style.transform = `rotateY(${x * 9 - 5}deg) rotateX(${-y * 7 + 2}deg) translateY(${y * 3}px)`;
    });
    heroArt.addEventListener('mouseleave', () => {
      frame.style.transform = 'rotateY(-5deg) rotateX(2deg)';
    });
  }
})();
