import { initializeScene } from '../main.js';

let seed = null; // Declare seed at the module level

export function showAuthForms(initializeSocketCallback) {
  const body = document.body;

  const authContainer = document.createElement('div');
  authContainer.id = 'auth';

  const loginForm = document.createElement('form');
  loginForm.id = 'loginForm';
  loginForm.innerHTML = `
    <h2>Login</h2>
    <input type="text" id="loginUsername" placeholder="Username" required>
    <input type="password" id="loginPassword" placeholder="Password" required>
    <button type="submit">Login</button>
  `;
  authContainer.appendChild(loginForm);

  const registerForm = document.createElement('form');
  registerForm.id = 'registerForm';
  registerForm.innerHTML = `
    <h2>Register</h2>
    <input type="text" id="registerUsername" placeholder="Username (min. 3 characters)" required minlength="3">
    <input type="email" id="registerEmail" placeholder="Email" required>
    <input type="password" id="registerPassword" placeholder="Password (8-16 characters)" required minlength="8" maxlength="16">
    <button type="submit">Register</button>
  `;
  authContainer.appendChild(registerForm);

  body.appendChild(authContainer);

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
      const token = data.token;
      authContainer.remove();
      initializeSocketCallback(token);
    } else {
      alert(data.message);
    }
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    const userData = {
      username,
      password,
      email
    };

    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    if (response.ok) {
      alert('Registration successful');
      registerForm.reset();
    } else {
      alert(data.message);
    }
  });
}

export function initializeSocket(token) {
  const socket = io('http://localhost:3000', {
    auth: { token }
  });

  socket.on('connect', () => {
    console.log('Connected to server');
  });

  socket.on('seed', (receivedSeed) => {
    console.log('Seed received from server:', receivedSeed);
    seed = receivedSeed; // Use the module-level seed variable
    initializeScene(seed);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
}