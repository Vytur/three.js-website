import * as THREE from 'three';
import { createTree, createTile } from './grid.js';

export function createScene() {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    return { scene, camera, renderer };
}

export function render(renderer, scene, camera) {
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}

function updateTrees(scene, vertices) {
    // Remove old trees
    scene.children = scene.children.filter(child => !(child.isMesh && child.material.color.getHex() === 0x228B22));

    vertices.forEach(vertex => {
        if (vertex && vertex.y > 0.2 && vertex.y < 0.5) {
            const tree = createTree();
            tree.position.set(vertex.x, vertex.y + 0.4, vertex.z);
            scene.add(tree);
        }
    });
}

let previousOffsetX = 0;
let previousOffsetY = 0;

export function updateGrid(scene, camera, gridWidth, gridHeight, tileSize, offsetRange, seed) {
    const offsetX = Math.floor(camera.position.x / tileSize);
    const offsetY = Math.floor((camera.position.z - 20) / tileSize);

    if (offsetX === previousOffsetX && offsetY === previousOffsetY) {
        return;
    }

    previousOffsetX = offsetX;
    previousOffsetY = offsetY;

    const visibleRange = 10;

    const newTiles = [];
    const newVertices = [];

    for (let y = offsetY - visibleRange; y < offsetY + visibleRange; y++) {
        for (let x = offsetX - visibleRange; x < offsetX + visibleRange; x++) {
            const { geometry, vertex } = createTile(x, y, tileSize, offsetRange, seed);
            newTiles.push({ geometry, vertex });
            newVertices.push(vertex);
        }
    }

    // Remove old tiles
    scene.children = scene.children.filter(child => !(child.isMesh && child.material.color.getHex() === 0x00ff00));

    // Add new tiles
    newTiles.forEach(tile => {
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        const mesh = new THREE.Mesh(tile.geometry, material);
        scene.add(mesh);
    });

    // Update trees
    updateTrees(scene, newVertices, gridWidth, gridHeight);
}