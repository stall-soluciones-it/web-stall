// Utilidad para seleccionar elementos del DOM con manejo de errores
const select = (selector, context = document) => {
  const element = context.querySelector(selector);
  if (!element) console.warn(`Elemento ${selector} no encontrado`);
  return element;
};

// Utilidad para seleccionar múltiples elementos
const selectAll = (selector, context = document) => {
  return Array.from(context.querySelectorAll(selector));
};

// Configuración de particles.js para la sección Hero
const setupParticles = () => {
  const particlesContainer = select('#particles-js');
  if (!particlesContainer || !window.particlesJS) return;

  const baseConfig = {
    particles: {
      number: {
        value: window.innerWidth <= 768 ? 40 : 60,
        density: { enable: true, value_area: 800 }
      },
      color: { value: ['#4682B4', '#87CEEB', '#D3D3D3'] },
      shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
      opacity: { value: 0.5, random: true, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
      size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 1, sync: false } },
      line_linked: { enable: true, distance: 150, color: '#87CEEB', opacity: 0.3, width: 1 },
      move: {
        enable: true,
        speed: 2,
        direction: 'none',
        random: true,
        straight: false,
        out_mode: 'out',
        bounce: false,
        attract: { enable: false, rotateX: 600, rotateY: 1200 }
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: false, mode: 'repulse' }, onclick: { enable: false, mode: 'push' }, resize: true },
      modes: {
        grab: { distance: 400, line_linked: { opacity: 1 } },
        bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
        repulse: { distance: 100, duration: 0.4 },
        push: { particles_nb: 4 },
        remove: { particles_nb: 2 }
      }
    },
    retina_detect: true
  };

  particlesJS('particles-js', baseConfig);
};

// Manejo del menú hamburguesa para dispositivos móviles
const setupHamburgerMenu = () => {
  const hamburger = select('.hamburger');
  const navList = select('.nav-list');
  if (!hamburger || !navList) return;

  const toggleMenu = () => {
    navList.classList.toggle('active');
    hamburger.classList.toggle('active');
  };

  hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMenu();
  });

  selectAll('a', navList).forEach((link) =>
    link.addEventListener('click', toggleMenu)
  );

  document.addEventListener('click', (e) => {
    if (
      navList.classList.contains('active') &&
      !navList.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      toggleMenu();
    }
  });
};

// Animaciones de fade-in para secciones y tarjetas de servicios
const setupFadeInAnimations = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const delay = entry.target.classList.contains('service-card') ? index * 100 : 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  selectAll('.fade-in, .service-card').forEach((element) => observer.observe(element));
};

// Manejo del formulario de contacto
const setupContactForm = () => {
  const form = select('#contact-form');
  const message = select('#form-message');
  const submitButton = form?.querySelector('button[type="submit"]');
  if (!form || !message || !submitButton) return;

  const showMessage = (text, isSuccess) => {
    message.textContent = text;
    message.classList.toggle('success', isSuccess);
    message.classList.toggle('error', !isSuccess);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    try {
      const formData = new FormData(form);
      const data = {
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        message: formData.get('message').trim(),
      };

      if (!data.name || !data.email || !data.message) {
        throw new Error('Por favor, completa todos los campos.');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new Error('Por favor, ingresa un correo electrónico válido.');
      }

      const response = await fetch('/save-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Error al enviar el mensaje');
      }

      const result = await response.json();
      showMessage(
        result.message || '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.',
        true
      );
      form.reset();
    } catch (error) {
      showMessage(
        error.message || 'Error al enviar el mensaje. Por favor, intenta de nuevo.',
        false
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Enviar';
    }
  });
};

// Configuración de enlaces dinámicos de contacto
const setupContactLinks = () => {
  const emailLink = select('#emailink');
  const phoneLink = select('#phone');
  if (emailLink) {
    emailLink.innerHTML =
      '<a href="mailto:info@stall.ar" class="contact-link" title="Enviar un correo a info@stall.ar">info@stall.ar</a>';
  }
  if (phoneLink) {
    phoneLink.innerHTML =
      '<a href="tel:+5492233004040" class="contact-link" title="Llamar al 223 300 4040">+54 9 223 300 4040</a>';
  }
};

// Inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  setupParticles();
  setupHamburgerMenu();
  setupFadeInAnimations();
  setupContactForm();
  setupContactLinks();
});
