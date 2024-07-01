import * as THREE from "three";

export function createScene() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const light = new THREE.DirectionalLight(0xffffff, 1.5);
  //light.position.set(10, 10, 10);
  light.castShadow = true;
  light.shadowDarkness = 0.5;
  light.shadow.camera.near = 0.5; // Near shadow camera distance
  light.shadow.camera.far = 500; // Far shadow camera distance

  scene.add(light);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMapSoft = true;

  document.body.appendChild(renderer.domElement);

  scene.add(camera);

  return { scene, camera, renderer };
}

export function render(renderer, scene, camera) {
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}
