import * as THREE from "three";
import { createScene, render } from "./scripts/scene.js";
import { updateGrid } from "./scripts/grid.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const gridWidth = 20; // Number of columns
const gridHeight = 20; // Number of rows
const tileSize = 1; // Size of each tile
const offsetRange = 0.3; // Maximum offset within each tile
const seed = "1";

// Set up the scene, camera, and renderer
const { scene, camera, renderer } = createScene();

camera.position.set(0, 10, 15);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = false;
controls.screenSpacePanning = false;
controls.enableRotate = false;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 5;
controls.maxDistance = 20;

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.z = 20;
scene.add(light);

let lastUpdatePosition = new THREE.Vector3(
  Math.floor(camera.position.x),
  Math.floor(camera.position.y),
  Math.floor(camera.position.z)
);

controls.addEventListener("change", () => {
  camera.position.y = 10;
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
