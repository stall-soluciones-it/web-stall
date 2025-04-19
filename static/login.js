// Login Form Error Simulation
const loginForm = document.getElementById('login-form');
const formMessage = document.getElementById('form-message');

if (!loginForm || !formMessage) {
  console.error('Formulario o mensaje no encontrados en el DOM');
} else {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formMessage.textContent = 'Usuario o contraseña incorrectos';
    formMessage.classList.remove('success');
    formMessage.classList.add('error');
  });
}