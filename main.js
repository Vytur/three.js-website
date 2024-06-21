import * as THREE from 'three';
import { createScene, render, updateGrid } from './scripts/scene.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { createGrid } from './scripts/grid.js';

const gridWidth = 20; // Number of columns
const gridHeight = 20; // Number of rows
const tileSize = 1; // Size of each tile
const offsetRange = 0.3; // Maximum offset within each tile
const seed = '1';


const { geometry, vertices } = createGrid(gridWidth, gridHeight, tileSize, offsetRange, seed);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);

// Set up the scene, camera, and renderer
const { scene, camera, renderer } = createScene();

scene.add(mesh);

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

controls.addEventListener('change', () => {
    camera.position.y = 10;
    updateGrid(scene, camera, gridWidth, gridHeight, tileSize, offsetRange, seed);
});

//updateGrid(scene, camera, gridWidth, gridHeight, tileSize, offsetRange, seed);

// Render the scene
render(renderer, scene, camera);