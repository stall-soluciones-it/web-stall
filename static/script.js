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

// Funciones críticas para la carga inicial

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

  selectAll('a', navList).forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        toggleMenu();
      }
    });
  });

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

// Animación para keyframes críticos - necesaria para estilos básicos
const addAnimationStyles = () => {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
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

// Funciones secundarias - se cargarán después del renderizado principal

// Configuración de particles.js para la sección Hero - sin interacción para aliviar carga
const setupParticles = () => {
  const particlesContainer = select('#particles-js');
  if (!particlesContainer || typeof particlesJS === 'undefined') return;

  const baseConfig = {
    particles: {
      number: {
        value: window.innerWidth <= 768 ? 30 : 45, // Reducido para aliviar carga
        density: { enable: true, value_area: 800 }
      },
      color: { value: ['#4682B4', '#87CEEB', '#00e8bb', '#D3D3D3'] },
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

// Arreglar el botón "Acceso clientes" que se mueve en la navegación
const fixHeaderOnScroll = () => {
  const header = select('.header');
  const navCta = select('.nav-cta-item');
  
  if (!header || !navCta) return;
  
  // Asegurar que el header tenga una altura fija
  header.style.maxHeight = '80px';
  header.style.overflow = 'visible';
  
  // Asegurar que el botón de CTA permanezca fijo
  navCta.style.position = 'absolute';
  navCta.style.right = '20px';
  navCta.style.zIndex = '100';
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

// Arreglar los botones "Saber más" en tarjetas de servicio
const fixServiceButtons = () => {
  selectAll('.service-card .cta-button').forEach(button => {
    // Mejorar el z-index para garantizar que el botón sea clickeable
    button.style.position = 'relative';
    button.style.zIndex = '10';
    
    button.addEventListener('click', function(event) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          event.preventDefault();
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
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
    message.style.animation = 'fadeIn 0.3s ease';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
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
      
      form.style.animation = 'success 1s ease';
      
      setTimeout(() => {
        form.reset();
        form.style.animation = 'none';
      }, 1000);
      
    } catch (error) {
      showMessage(
        error.message || 'Error al enviar el mensaje. Por favor, intenta de nuevo.',
        false
      );
      
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
    if (anchor.classList.contains('cta-button')) return; // Ya manejado por fixServiceButtons

    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      
      const targetElement = select(targetId);
      
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
};

// Botón para volver arriba
const setupScrollToTop = () => {
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.className = 'scroll-top-btn';
  scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollTopBtn.title = 'Volver arriba';
  
  // Añadir un estilo básico para el botón
  scrollTopBtn.style.position = 'fixed';
  scrollTopBtn.style.bottom = '20px';
  scrollTopBtn.style.right = '90px';
  scrollTopBtn.style.width = '45px';
  scrollTopBtn.style.height = '45px';
  scrollTopBtn.style.backgroundColor = '#4682B4';
  scrollTopBtn.style.color = 'white';
  scrollTopBtn.style.borderRadius = '50%';
  scrollTopBtn.style.border = 'none';
  scrollTopBtn.style.display = 'flex';
  scrollTopBtn.style.alignItems = 'center';
  scrollTopBtn.style.justifyContent = 'center';
  scrollTopBtn.style.cursor = 'pointer';
  scrollTopBtn.style.opacity = '0';
  scrollTopBtn.style.transform = 'translateY(20px)';
  scrollTopBtn.style.transition = 'opacity 0.3s, transform 0.3s, background-color 0.3s';
  scrollTopBtn.style.zIndex = '900';
  scrollTopBtn.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
  
  document.body.appendChild(scrollTopBtn);
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.style.opacity = '0.8';
      scrollTopBtn.style.transform = 'translateY(0)';
    } else {
      scrollTopBtn.style.opacity = '0';
      scrollTopBtn.style.transform = 'translateY(20px)';
    }
  });
  
  scrollTopBtn.addEventListener('mouseover', () => {
    scrollTopBtn.style.backgroundColor = '#00e8bb';
    scrollTopBtn.style.opacity = '1';
    scrollTopBtn.style.transform = 'translateY(-3px)';
    scrollTopBtn.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.4)';
  });
  
  scrollTopBtn.addEventListener('mouseout', () => {
    scrollTopBtn.style.backgroundColor = '#4682B4';
    scrollTopBtn.style.opacity = '0.8';
    scrollTopBtn.style.transform = 'translateY(0)';
    scrollTopBtn.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
  });
  
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
};

// Añadir animaciones no críticas
const addNonCriticalAnimations = () => {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
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
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-15px); }
      60% { transform: translateY(-10px); }
    }
    
    @keyframes pulse {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 0.7; }
      100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
    }
  `;
  document.head.appendChild(styleSheet);
};

// Inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  // Carga crítica - ejecutar inmediatamente para el primer renderizado
  addAnimationStyles();
  setupHamburgerMenu();
  
  // Funciones para mejorar el rendimiento inicial
  setTimeout(() => {
    fixHeaderOnScroll();
    fixServiceButtons();
  }, 10);
  
  // Carga diferida - ejecutar después del primer renderizado
  setTimeout(() => {
    setupParticles();
    setupFadeInAnimations();
    setupParallaxEffect();
    setupServiceCardEffects();
    setupContactForm();
    setupContactLinks();
    setupSmoothScroll();
    addNonCriticalAnimations();
  }, 100);
  
  // Características no esenciales - cargar al final
  setTimeout(() => {
    setupScrollToTop();
  }, 300);
});