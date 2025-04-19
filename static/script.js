// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navList = document.querySelector('.nav-list');

if (hamburger && navList) {
  hamburger.addEventListener('click', () => {
    navList.classList.toggle('active');
  });
}

// Fade-in Animation on Scroll
const fadeInElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1 }
);

fadeInElements.forEach((element) => {
  observer.observe(element);
});

// Contact Form Submission
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
const submitButton = contactForm?.querySelector('button[type="submit"]');

if (!contactForm || !formMessage || !submitButton) {
  console.error('Formulario, mensaje o botón de envío no encontrados en el DOM');
} else {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener y limpiar datos del formulario
    const formData = new FormData(contactForm);
    const data = {
      name: formData.get('name').trim(),
      email: formData.get('email').trim(),
      message: formData.get('message').trim(),
    };

    // Validación en el frontend
    if (!data.name || !data.email || !data.message) {
      formMessage.textContent = 'Por favor, completa todos los campos.';
      formMessage.classList.remove('success');
      formMessage.classList.add('error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      formMessage.textContent = 'Por favor, ingresa un correo electrónico válido.';
      formMessage.classList.remove('success');
      formMessage.classList.add('error');
      return;
    }

    // Mostrar indicador de carga
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    try {
      const response = await fetch('/save-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        formMessage.textContent =
          result.message || '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.';
        formMessage.classList.remove('error');
        formMessage.classList.add('success');
        contactForm.reset();
      } else {
        throw new Error(result.message || 'Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error en el frontend:', error.message);
      formMessage.textContent =
        error.message || 'Error al enviar el mensaje. Por favor, intenta de nuevo.';
      formMessage.classList.remove('success');
      formMessage.classList.add('error');
    } finally {
      // Restaurar botón
      submitButton.disabled = false;
      submitButton.textContent = 'Enviar';
    }
  });
}

// Dynamic Contact Info Links
const emailLink = document.getElementById('emailink');
const phoneLink = document.getElementById('phone');

if (emailLink) {
  emailLink.innerHTML =
    '<a href="mailto:info@stall.ar" class="contact-link" title="Enviar un correo a info@stall.ar">info@stall.ar</a>';
}

if (phoneLink) {
  phoneLink.innerHTML =
    '<a href="tel:+5492233004040" class="contact-link" title="Llamar al 223 300 4040">+54 9 223 300 4040</a>';
}
