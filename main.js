import * as THREE from 'three';
import { createScene, render } from './scripts/scene.js';
import { updateGrid } from './scripts/grid.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { setupMouseInteraction } from './scripts/interactions.js';
import { Player } from './scripts/player.js';
import { showAuthForms, initializeSocket } from './scripts/auth.js';

const player = new Player();

document.addEventListener('DOMContentLoaded', () => {
  showAuthForms(initializeSocket);
});

const tileSize = 1; // Size of each tile
const offsetRange = 0.3; // Maximum offset within each tile

export function initializeScene(seed) {
  if (!seed) {
    console.error('Seed not available, cannot initialize scene.');
    return;
  }

  const { scene, camera, renderer, uiState } = createScene();
  setupMouseInteraction(scene, camera, player, uiState);

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
  render(renderer, scene, camera);
}