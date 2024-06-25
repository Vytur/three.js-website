import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import seedrandom from "seedrandom";
import { Biome } from './biome.js';

function getRandomOffset(range, rng) {
  return (rng - 0.5) * range * 2;
}

export class Tile {
  constructor(x, y, tileSize, offsetRange, seed) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.offsetRange = offsetRange;
    this.seed = seed;
    this.geometry = null;
    this.mesh = null;
    this.forest = null;
    this.createTile();
  }

  createTile() {
    const rng = seedrandom(this.seed);
    const biome = new Biome(this.seed);

    const vertices = [];
    const positions = [];
    const colors = [];

    for (let y = 0; y <= 1; y++) {
      for (let x = 0; x <= 1; x++) {
        const zOffset = biome.noise2D((this.x + x) / 10, (this.y + y) / 10);
        const xOffset = getRandomOffset(this.offsetRange, zOffset); //noise
        const yOffset = getRandomOffset(this.offsetRange, xOffset);

        const vertex = new THREE.Vector3(
          (this.x + x) * this.tileSize + xOffset,
          zOffset,
          (this.y + y) * this.tileSize + yOffset
        );
        vertices.push(vertex);
        positions.push(vertex.x, vertex.y, vertex.z);

        const biomeType = biome.getBiome(this.x + x, this.y + y);
        const color = new THREE.Color(biome.getBiomeColor(biomeType));
        colors.push(color.r, color.g, color.b);
      }
    }

    this.vertices = vertices;

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Create indices for two triangles
    const indices = [0, 2, 1, 1, 2, 3];
    geometry.setIndex(indices);

    this.geometry = geometry;
  }

  createMesh() {
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: false,
    });
    this.mesh = new THREE.Mesh(this.geometry, material);
  }

  createForest() {
    const geometry = new THREE.ConeGeometry(0.2, 1, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0x228b22 });
    const forest = new THREE.Mesh(geometry, material);
    this.addForest(forest);
    return forest;
  }

  addForest(forest) {
    this.forest = forest;
  }

  removeFromScene(scene) {
    if (this.mesh) {
      scene.remove(this.mesh);
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
      if(this.forest) {    
        scene.remove(this.forest); 
        this.forest.geometry.dispose();
        this.forest.material.dispose();
        }
    }
  }
}
