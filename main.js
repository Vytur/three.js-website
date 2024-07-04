import * as THREE from "three";
import { createScene, render } from "./scripts/scene.js";
import { updateGrid } from "./scripts/grid.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { setupMouseInteraction } from "./scripts/interactions.js";
import { Player } from "./scripts/player.js";

const player = new Player();

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected to server");
});

const tileSize = 1; // Size of each tile
const offsetRange = 0.3; // Maximum offset within each tile

let seed = null;
let token = null;

document.addEventListener('DOMContentLoaded', () => {
  showAuthForms();
});

function showAuthForms() {
  const body = document.body;

  const authContainer = document.createElement('div');
  authContainer.id = 'auth';

  // Login form
  const loginForm = document.createElement('form');
  loginForm.id = 'loginForm';
  loginForm.innerHTML = `
      <h2>Login</h2>
      <input type="text" id="loginUsername" placeholder="Username" required>
      <input type="password" id="loginPassword" placeholder="Password" required>
      <button type="submit">Login</button>
  `;
  authContainer.appendChild(loginForm);

  // Register form
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
          token = data.token;
          authContainer.remove();
          initializeSocket();
      } else {
          alert(data.message);
      }
  });

  registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('registerUsername').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;

       // Validate email format using regex
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

function initializeSocket() {
  const socket = io('http://localhost:3000', {
      auth: { token }
  });

  socket.on('connect', () => {
      console.log('Connected to server');
  });

  socket.on('seed', (receivedSeed) => {
      console.log('Seed received from server:', receivedSeed);
      seed = receivedSeed;
      initializeScene();
  });

  socket.on('disconnect', () => {
      console.log('Disconnected from server');
  });
}

function initializeScene() {
  if (!seed) {
      console.error('Seed not available, cannot initialize scene.');
      return;
  }

  // Set up the scene, camera, and renderer
  const { scene, camera, renderer } = createScene();
  
  setupMouseInteraction(scene, camera, player);

  camera.position.set(0, 15, 15);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = false;
  controls.screenSpacePanning = false;
  controls.enableRotate = false;
  controls.enableZoom = false;
  controls.maxPolarAngle = Math.PI / 2;

  let lastUpdatePosition = new THREE.Vector3(
    Math.floor(camera.position.x),
    Math.floor(camera.position.y),
    Math.floor(camera.position.z)
  );
  
  controls.addEventListener("change", () => {
    camera.position.y = 15;
    const currentPosition = new THREE.Vector3(
      Math.floor(camera.position.x),
      Math.floor(camera.position.y),
      Math.floor(camera.position.z)
    );
    if (
      currentPosition.x !== lastUpdatePosition.x ||
      currentPosition.z !== lastUpdatePosition.z
    ) {
      updateGrid(scene, camera, tileSize, offsetRange, seed);
      lastUpdatePosition.copy(currentPosition);
    }
  });

  updateGrid(scene, camera, tileSize, offsetRange, seed);

  // Render the scene
  render(renderer, scene, camera);
}

