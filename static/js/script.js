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
  
  // Asegurar que los links a secciones funcionan correctamente
  document.querySelectorAll('.service-card .cta-button').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
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

// Configuración de tooltips táctiles para iconos de pago
const setupPaymentTooltips = () => {
  const paymentIcons = selectAll('.payment-icon');
  
  // Crear un elemento tooltip que reutilizaremos
  const tooltip = document.createElement('div');
  tooltip.className = 'payment-tooltip';
  tooltip.style.display = 'none';
  document.body.appendChild(tooltip);
  
  // Estilos para el tooltip
  const tooltipStyles = document.createElement('style');
  tooltipStyles.textContent = `
    .payment-tooltip {
      position: fixed;
      background-color: rgba(46, 58, 59, 0.95);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 14px;
      max-width: 200px;
      z-index: 1100;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      border: 1px solid var(--primary);
      pointer-events: none;
      transform: translateY(-10px);
      opacity: 0;
      transition: opacity 0.3s, transform 0.3s;
    }
    
    .payment-tooltip.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(tooltipStyles);
  
  // Variable para almacenar el temporizador de ocultación
  let hideTimeout;
  // Variable para seguir el ícono activo actualmente
  let activeIcon = null;
  
  // Función para detectar si es un dispositivo táctil - definida fuera del ciclo forEach
  const isTouchDevice = () => {
    return ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           (navigator.msMaxTouchPoints > 0);
  };
  
  // Función para ocultar el tooltip - definida fuera del ciclo forEach
  const hideTooltip = (immediate = false) => {
    // Limpiar cualquier temporizador existente
    clearTimeout(hideTimeout);
    
    if (immediate) {
      tooltip.style.display = 'none';
      tooltip.classList.remove('visible');
      activeIcon = null;
      return;
    }
    
    tooltip.classList.remove('visible');
    
    // Esperar a que termine la transición antes de ocultarlo
    hideTimeout = setTimeout(() => {
      tooltip.style.display = 'none';
      activeIcon = null;
    }, 300);
  };
  
  // Agregar manejadores de eventos para cada icono
  paymentIcons.forEach(icon => {
    const titleText = icon.getAttribute('title');
    icon.removeAttribute('title');
    icon.setAttribute('data-tooltip', titleText);
    
    const showTooltip = (event) => {
      if (!titleText) return;
      
      // Limpiar cualquier temporizador existente
      clearTimeout(hideTimeout);
      
      // Si hay un ícono activo y es diferente del actual, ocultar primero el tooltip
      if (activeIcon && activeIcon !== icon) {
        hideTooltip(true); // Ocultar inmediatamente
      }
      
      // Marcar este ícono como activo
      activeIcon = icon;
      
      // Calcular la posición considerando el estado de hover/scale
      // Usar requestAnimationFrame para posicionar después de la animación de escala
      requestAnimationFrame(() => {
        const rect = icon.getBoundingClientRect();
        tooltip.textContent = titleText;
        
        // Ajustar la posición para dispositivos móviles vs desktop
        const isMobile = window.innerWidth <= 768;
        tooltip.style.top = `${rect.top - (isMobile ? 50 : 60)}px`;
        tooltip.style.left = `${rect.left + (rect.width / 2) - (isMobile ? 80 : 100)}px`;
        
        // Mostrar el tooltip
        tooltip.style.display = 'block';
        
        // Asegurar que la transición se active
        requestAnimationFrame(() => {
          tooltip.classList.add('visible');
        });
      });
      
      // En móvil dejamos más tiempo (5s), en desktop no cerramos automáticamente en hover
      if (isTouchDevice()) {
        hideTimeout = setTimeout(() => {
          hideTooltip();
        }, 5000); // 5 segundos para dispositivos táctiles
      }
    };
    
    // Para dispositivos táctiles
    icon.addEventListener('touchstart', (e) => {
      // En táctil, solo prevenimos default si no hay otro tooltip activo
      if (!activeIcon || activeIcon === icon) {
        e.preventDefault();
      }
      showTooltip(e);
    }, { passive: false });
    
    // Para clicks (útil en ambos dispositivos)
    icon.addEventListener('click', (e) => {
      e.stopPropagation(); // Evitar que se propague al documento
      showTooltip(e);
    });
    
    // Para hover en escritorio
    icon.addEventListener('mouseenter', showTooltip);
    
    // Solo cerramos en mouseleave si no estamos en un dispositivo táctil
    icon.addEventListener('mouseleave', () => {
      if (!isTouchDevice()) {
        hideTooltip();
      }
    });
  });
  
  // Cerrar tooltip al tocar fuera de los íconos
  document.addEventListener('touchstart', (e) => {
    // Verificar si el tooltip está visible y si se tocó fuera de un icono de pago
    if (activeIcon && !e.target.classList.contains('payment-icon')) {
      hideTooltip();
    }
  }, { passive: true });
  
  // Cerrar tooltip al hacer click fuera
  document.addEventListener('click', (e) => {
    // Verificar si el tooltip está visible y si se hizo clic fuera de un icono de pago
    if (activeIcon && !e.target.classList.contains('payment-icon')) {
      hideTooltip();
    }
  });
  
  // Cerrar el tooltip cuando se hace scroll (muy útil en móvil)
  window.addEventListener('scroll', () => {
    if (activeIcon) {
      hideTooltip();
    }
  }, { passive: true });
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
      right: 80px;
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
      background-color: #00e8bb;
      opacity: 1;
      transform: translateY(-3px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
    }

    @media (max-width: 768px) {
      .scroll-top-btn {
        right: 20px; /* En móvil puede estar más cerca porque WhatsApp está a la izquierda */
      }
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
  setupPaymentTooltips();
});
