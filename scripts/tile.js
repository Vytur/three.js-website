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
    this.building = null;
    this.biomeType = "plains";
    this.color = null;
    this.center = null;
    this.createTile();
  }

  createTile() {
    const biome = new Biome(this.seed);

    const vertices = [];
    const positions = [];
    const colors = [];

    const biomeStats = biome.getBiome(this.x, this.y);
    this.biomeType = biomeStats.biomeName;
    this.color = new THREE.Color(biome.getBiomeColor(this.biomeType));
    colors.push(this.color.r, this.color.g, this.color.b);

    for (let y = 0; y <= 1; y++) {
      for (let x = 0; x <= 1; x++) {
        const zOffset = biomeStats.correlation;
        const xOffset = getRandomOffset(this.offsetRange, biome.noise2D(this.x + x, this.y + y)); //biome.noise2D(this.x + x, this.y + y)
        const yOffset = getRandomOffset(this.offsetRange, biome.noise2D(this.y + y, this.x + x));

        const vertex = new THREE.Vector3(
          (this.x + x) * this.tileSize + xOffset,
          zOffset,
          (this.y + y) * this.tileSize + yOffset
        );
        vertices.push(vertex);
        positions.push(vertex.x, vertex.y, vertex.z);
      }
    }

    this.vertices = vertices;

    this.center = new THREE.Vector3();
    this.center.addVectors(vertices[0], vertices[3]).multiplyScalar(0.5);

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
    const material = new THREE.MeshToonMaterial({
      color: this.color,
      wireframe: false
    });
    this.mesh = new THREE.Mesh(this.geometry, material);
    this.mesh.receiveShadow = true;

    this.mesh.userData.tileCoordinates = { x: this.x, y: this.y };
  }

  createForest() {
    const geometry = new THREE.ConeGeometry(0.2, 1, 8);
    const material = new THREE.MeshToonMaterial({ color: 0x228b22 });
    const forest = new THREE.Mesh(geometry, material);
    forest.castShadow = true;
    this.addForest(forest);
    return forest;
  }

  addForest(forest) {
    this.building = forest;
    this.building.position.set(this.center.x, this.center.y + 0.4, this.center.z);
  }

  removeFromScene(scene) {
    if (this.mesh) {
      scene.remove(this.mesh);
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
      if(this.building) {    
        scene.remove(this.building); 
        this.building.geometry.dispose();
        this.building.material.dispose();
        }
    }
  }
}
