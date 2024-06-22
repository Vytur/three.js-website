import * as THREE from 'three';
import { createNoise2D  } from 'simplex-noise';
import seedrandom from 'seedrandom';

// Function to generate random offset within the range
function getRandomOffset(range) {
    return (Math.random() - 0.5) * range * 2;
}

// Function to create grid with Perlin noise heights and random offsets
export function createGrid(gridWidth, gridHeight, tileSize, offsetRange, seed) {
    const vertices = [];
    const rng = seedrandom(seed);
    const noise2D = new createNoise2D(rng); // Create a SimplexNoise instance

    // Create the grid with random offsets and Perlin noise heights
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const xOffset = getRandomOffset(offsetRange);
            const yOffset = getRandomOffset(offsetRange);
            const zOffset = noise2D(x / 10, y / 10); // Generate height using Perlin noise

            const vertex = new THREE.Vector3(
                x * tileSize + xOffset,
                zOffset,
                y * tileSize + yOffset
            );
            vertices.push(vertex);
        }
    }

    const geometry = new THREE.BufferGeometry();
    const positions = [];

    // Function to get the index of the vertex in the grid
    function getIndex(x, y) {
        return y * gridWidth + x;
    }

    // Create two triangles for each tile
    for (let y = 0; y < gridHeight - 1; y++) {
        for (let x = 0; x < gridWidth - 1; x++) {
            // Triangle 1
            const v0 = vertices[getIndex(x, y)];
            const v1 = vertices[getIndex(x + 1, y)];
            const v2 = vertices[getIndex(x, y + 1)];

            positions.push(v2.x, v2.y, v2.z);
            positions.push(v1.x, v1.y, v1.z);
            positions.push(v0.x, v0.y, v0.z);

            // Triangle 2
            const v3 = vertices[getIndex(x + 1, y)];
            const v4 = vertices[getIndex(x + 1, y + 1)];
            const v5 = vertices[getIndex(x, y + 1)];

            positions.push(v5.x, v5.y, v5.z);
            positions.push(v4.x, v4.y, v4.z);
            positions.push(v3.x, v3.y, v3.z);
        }
    }

    // Create the BufferGeometry and add the positions
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    return { geometry, vertices };
}

export function createTile(tileX, tileY, tileSize, offsetRange, seed) {
    const rng = seedrandom(seed);
    const noise2D = createNoise2D(rng);
    const vertices = [];
    const positions = [];

    // Create vertices for the tile
    for (let y = 0; y <= 1; y++) {
        for (let x = 0; x <= 1; x++) {
            const xOffset = getRandomOffset(offsetRange);
            const yOffset = getRandomOffset(offsetRange);
            const zOffset = noise2D((tileX + x) / 10, (tileY + y) / 10);

            const vertex = new THREE.Vector3(
                (tileX + x) * tileSize + xOffset,
                zOffset,
                (tileY + y) * tileSize + yOffset
            );
            vertices.push(vertex);
            positions.push(vertex.x, vertex.y, vertex.z);
        }
    }

    // Create the geometry and set the positions
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    // Create indices for two triangles
    const indices = [
        0, 1, 2,
        2, 1, 3
    ];
    geometry.setIndex(indices);

    return { geometry, vertices };
}

// Function to create a tree mesh (example element)
export function createTree() {
    const geometry = new THREE.ConeGeometry(0.2, 1, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0x228B22 });
    const tree = new THREE.Mesh(geometry, material);
    return tree;
}