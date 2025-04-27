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

// Configuración de particles.js para la sección Hero - sin interacción para aliviar carga
const setupParticles = () => {
  const particlesContainer = select('#particles-js');
  if (!particlesContainer || !window.particlesJS) return;

  const baseConfig = {
    particles: {
      number: {
        value: window.innerWidth <= 768 ? 30 : 45, // Reducido para aliviar carga
        density: { enable: true, value_area: 800 }
      },
      color: { value: ['#4682B4', '#87CEEB', '#FF9966', '#D3D3D3'] },
      shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
      opacity: { value: 0.5, random: true, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
      size: { value: 3, random: true, anim: { enable: false, speed: 2, size_min: 1, sync: false } },
      line_linked: { enable: true, distance: 150, color: '#87CEEB', opacity: 0.3, width: 1 },
      move: {
        enable: true,
        speed: 1.5, // Velocidad reducida
        direction: 'none',
        random: true,
        straight: false,
        out_mode: 'out',
        bounce: false,
        attract: { enable: false, rotateX: 600, rotateY: 1200 } // Desactivado attract
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { 
        onhover: { enable: false, mode: 'repulse' }, // Desactivado
        onclick: { enable: false, mode: 'push' }, // Desactivado
        resize: true 
      },
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
    
    // Animación suave para el menú móvil
    if (navList.classList.contains('active')) {
      // Animar cada elemento del menú con delay escalonado
      selectAll('li', navList).forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 100 * index);
      });
    }
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
            
            // Añadir animación extra para iconos de servicio
            if (entry.target.classList.contains('service-card')) {
              const icon = entry.target.querySelector('.service-icon');
              if (icon) {
                icon.style.animation = 'pop 0.5s ease';
              }
            }
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  selectAll('.fade-in, .service-card, .about p, .contact-form, .contact-info').forEach((element) => {
    element.classList.add('fade-in');
    observer.observe(element);
  });
};

// Añadir efecto parallax a la sección Hero
const setupParallaxEffect = () => {
  const hero = select('.hero');
  if (!hero) return;
  
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition < window.innerHeight) {
      const particles = select('#particles-js');
      const heroContent = select('.hero .container');
      
      if (particles) {
        particles.style.transform = `translateY(${scrollPosition * 0.3}px)`;
      }
      
      if (heroContent) {
        heroContent.style.transform = `translateY(${scrollPosition * 0.15}px)`;
        heroContent.style.opacity = 1 - (scrollPosition / (window.innerHeight * 0.8));
      }
    }
  });
};

// Efecto de hover para tarjetas de servicio
const setupServiceCardEffects = () => {
  selectAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Añadir sombra dinámica en hover
      card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease, border-bottom 0.3s ease';
      
      // Efecto de animación para el ícono
      const icon = card.querySelector('.service-icon');
      if (icon) {
        icon.style.animation = 'bounce 1s ease';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      const icon = card.querySelector('.service-icon');
      if (icon) {
        icon.style.animation = 'none';
      }
    });
  });
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
    
    // Añadir animación al mostrar el mensaje
    message.style.animation = 'fadeIn 0.3s ease';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    
    // Añadir efecto de carga al botón
    submitButton.classList.add('loading');

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
      
      // Añadir animación de éxito al formulario
      form.style.animation = 'success 1s ease';
      
      // Resetear formulario con animación
      setTimeout(() => {
        form.reset();
        form.style.animation = 'none';
      }, 1000);
      
    } catch (error) {
      showMessage(
        error.message || 'Error al enviar el mensaje. Por favor, intenta de nuevo.',
        false
      );
      
      // Añadir animación de error al formulario
      form.style.animation = 'shake 0.5s ease';
      setTimeout(() => {
        form.style.animation = 'none';
      }, 500);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Enviar';
      submitButton.classList.remove('loading');
    }
  });
  
  // Validación en tiempo real
  selectAll('input, textarea', form).forEach(field => {
    field.addEventListener('blur', () => {
      if (field.value.trim() === '') {
        field.classList.add('error');
        field.style.borderColor = '#FF6B6B';
      } else {
        field.classList.remove('error');
        field.style.borderColor = '';
      }
      
      // Validación específica para email
      if (field.type === 'email' && field.value.trim() !== '') {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
          field.classList.add('error');
          field.style.borderColor = '#FF6B6B';
        }
      }
    });
    
    field.addEventListener('focus', () => {
      field.classList.remove('error');
      field.style.borderColor = '';
    });
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

// Efecto smooth scroll para navegación
const setupSmoothScroll = () => {
  selectAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = select(targetId);
      
      if (targetElement) {
        // Añadir animación al desplazamiento
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Ajustar por el header fijo
          behavior: 'smooth'
        });
      }
    });
  });
};

// Botón para volver arriba
const setupScrollToTop = () => {
  // Crear botón dinámicamente
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.className = 'scroll-top-btn';
  scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollTopBtn.title = 'Volver arriba';
  document.body.appendChild(scrollTopBtn);
  
  // Mostrar/ocultar botón según scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });
  
  // Acción de scroll al hacer clic
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
};

// Animación para keyframes
const addAnimationStyles = () => {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pop {
      0% { transform: scale(0.8); opacity: 0.5; }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes success {
      0% { transform: scale(1); }
      50% { transform: scale(1.02); box-shadow: 0 0 20px rgba(135, 206, 235, 0.5); }
      100% { transform: scale(1); }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-15px); }
      60% { transform: translateY(-10px); }
    }
    
    .scroll-top-btn {
      position: fixed;
      bottom: 20px;
      right: 90px;
      width: 45px;
      height: 45px;
      background-color: #4682B4;
      color: white;
      border-radius: 50%;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.3s, transform 0.3s, background-color 0.3s;
      z-index: 900;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }
    
    .scroll-top-btn.visible {
      opacity: 0.8;
      transform: translateY(0);
    }
    
    .scroll-top-btn:hover {
      background-color: #FF9966;
      opacity: 1;
      transform: translateY(-3px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
    }
    
    .loading {
      position: relative;
      overflow: hidden;
    }
    
    .loading::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
      0% { left: -100%; }
      100% { left: 100%; }
    }
  `;
  document.head.appendChild(styleSheet);
};

// Inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  // Añadir estilos de animación
  addAnimationStyles();
  
  // Configurar componentes
  setupParticles();
  setupHamburgerMenu();
  setupFadeInAnimations();
  setupParallaxEffect();
  setupServiceCardEffects();
  setupContactForm();
  setupContactLinks();
  setupSmoothScroll();
  setupScrollToTop();
});