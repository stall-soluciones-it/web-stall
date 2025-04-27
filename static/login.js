// Login Form Handler
const loginForm = document.getElementById('login-form');
const formMessage = document.getElementById('form-message');

if (!loginForm || !formMessage) {
  console.error('Formulario o mensaje no encontrados en el DOM');
} else {
  // Añadir animación al formulario cuando se carga la página
  loginForm.style.opacity = '0';
  loginForm.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    loginForm.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    loginForm.style.opacity = '1';
    loginForm.style.transform = 'translateY(0)';
  }, 300);
  
  // Manejar errores en el envío del formulario
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simular carga
    const submitButton = loginForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Validando...';
    submitButton.classList.add('loading');
    
    // Simular una verificación con retraso
    setTimeout(() => {
      formMessage.textContent = 'Usuario o contraseña incorrectos';
      formMessage.classList.remove('success');
      formMessage.classList.add('error');
      
      // Restablecer botón
      submitButton.disabled = false;
      submitButton.textContent = 'Iniciar sesión';
      submitButton.classList.remove('loading');
      
      // Añadir animación de error al formulario
      loginForm.style.animation = 'shake 0.5s ease';
      setTimeout(() => {
        loginForm.style.animation = 'none';
      }, 500);
      
      // Enfocar el campo de usuario
      document.getElementById('username').focus();
    }, 1500);
  });
  
  // Validación en tiempo real
  const inputs = loginForm.querySelectorAll('input');
  inputs.forEach(input => {
    // Eliminar mensaje de error al escribir
    input.addEventListener('input', () => {
      formMessage.classList.remove('error');
    });
    
    // Efecto de enfoque
    input.addEventListener('focus', () => {
      input.style.borderColor = '#4682B4';
      input.style.transition = 'border-color 0.3s ease, box-shadow 0.3s ease';
    });
    
    input.addEventListener('blur', () => {
      input.style.borderColor = input.value.trim() === '' ? 
        'rgba(255, 107, 107, 0.5)' : 'rgba(211, 211, 211, 0.3)';
      
      if (input.value.trim() === '') {
        input.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
          input.style.animation = 'none';
        }, 500);
      }
    });
  });
}