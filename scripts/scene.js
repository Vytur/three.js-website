import * as THREE from 'three';
import Stats from 'stats.js';

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

export function createScene() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 15, 15);

  const uiCamera = new THREE.OrthographicCamera(
    -window.innerWidth / 2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    -window.innerHeight / 2,
    1,
    10000
  );
  uiCamera.position.set(0, 0, 10);

  uiCamera.zoom = 10;

  const light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(10, 10, 10);
  light.castShadow = true;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 500;
  scene.add(light);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  document.body.appendChild(renderer.domElement);

  return { scene, camera, uiCamera, renderer };
}

export function render(renderer, scene, camera, uiCamera) {
  function animate() {
    stats.begin();
    renderer.render(scene, camera);
    stats.end();

    //renderer.render(scene, uiCamera);
    requestAnimationFrame(animate);
  }
  animate();
}