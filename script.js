// ===========================
// NAV: Scroll behavior + Mobile toggle
// ===========================
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===========================
// SMOOTH SCROLL for anchor links
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navHeight = nav.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===========================
// SCROLL ANIMATIONS (IntersectionObserver)
// ===========================
const animatables = [
  '.about__grid > *',
  '.service-card',
  '.pillar',
  '.results__card',
  '.tcard',
  '.location__grid > *',
  '.contact__grid > *',
  '.section-header',
  '.footer__grid > *',
];

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

animatables.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = `${i * 80}ms`;
    observer.observe(el);
  });
});

// ===========================
// EMAILJS CONFIG
// Fill these in from your EmailJS dashboard (emailjs.com)
// ===========================
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// ===========================
// CONTACT FORM
// ===========================
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const data = Object.fromEntries(new FormData(contactForm).entries());

    const templateParams = {
      from_name:  `${data.firstName} ${data.lastName}`,
      from_email: data.email,
      phone:      data.phone || 'Not provided',
      goal:       data.goal,
      message:    data.message || 'No message provided',
      reply_to:   data.email,
    };

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      contactForm.style.display = 'none';
      formSuccess.classList.add('visible');
    } catch (err) {
      console.error('EmailJS error:', err);
      btn.textContent = 'Book My Free Consultation';
      btn.disabled = false;
      alert('Something went wrong. Please try again or call us directly.');
    }
  });
}

// ===========================
// ACTIVE NAV LINK on scroll
// ===========================
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav__link:not(.nav__link--cta)');

function updateActiveNav() {
  const scrollY = window.scrollY;
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionBottom = sectionTop + section.offsetHeight;
    if (scrollY >= sectionTop && scrollY < sectionBottom) {
      navLinkEls.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav__link[href="#${section.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

// ===========================
// HERO TITLE stagger animation
// ===========================
document.querySelectorAll('.hero__title-line').forEach((line, i) => {
  line.style.opacity = '0';
  line.style.transform = 'translateY(40px)';
  line.style.transition = `opacity 0.8s ease ${0.2 + i * 0.15}s, transform 0.8s ease ${0.2 + i * 0.15}s`;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    });
  });
});

// Stagger hero sub elements
['.hero__badge', '.hero__sub', '.hero__actions', '.hero__stats'].forEach((sel, i) => {
  const el = document.querySelector(sel);
  if (!el) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity 0.7s ease ${0.5 + i * 0.12}s, transform 0.7s ease ${0.5 + i * 0.12}s`;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });
});
