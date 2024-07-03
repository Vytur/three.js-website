import * as THREE from "three";
import { Building } from './building.js';
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
    this.area = 0;
    this.createTile();
  }

  createTile() {
    const biome = new Biome(this.seed);

    const vertices = [];
    const positions = [];
    const colors = [];

    for (let y = 0; y <= 1; y++) {
      for (let x = 0; x <= 1; x++) {
        const biomeStats = biome.getBiome(this.x + x, this.y + y);
        const xOffset = getRandomOffset(this.offsetRange, biome.noise2D(this.x + x, this.y + y)); //biome.noise2D(this.x + x, this.y + y)
        const yOffset = getRandomOffset(this.offsetRange, biome.noise2D(this.y + y, this.x + x));

        const vertex = new THREE.Vector3(
          (this.x + x) * this.tileSize + xOffset,
          biomeStats.correlation,
          (this.y + y) * this.tileSize + yOffset
        );

        this.biomeType = biomeStats.biomeName;
        vertices.push(vertex);
        positions.push(vertex.x, vertex.y, vertex.z);
      }
    }

    this.color = new THREE.Color(biome.getBiomeColor(this.biomeType));
    colors.push(this.color.r, this.color.g, this.color.b);

    this.vertices = vertices;

    this.center = new THREE.Vector3(
      (vertices[0].x + vertices[1].x + vertices[2].x + vertices[3].x) / 4,
      (vertices[0].y + vertices[1].y + vertices[2].y + vertices[3].y) / 4,
      (vertices[0].z + vertices[1].z + vertices[2].z + vertices[3].z) / 4
    );

    this.area = this.calculateArea(vertices);

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Create indices for two triangles
    const indices = [0, 2, 1, 1, 2, 3];
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    this.geometry = geometry;
  }

  calculateArea(vertices) {
    const v0 = vertices[0];
    const v1 = vertices[1];
    const v2 = vertices[2];
    const v3 = vertices[3];

    // Triangle 1: v0, v1, v2
    const edge1 = new THREE.Vector3().subVectors(v1, v0);
    const edge2 = new THREE.Vector3().subVectors(v2, v0);
    const crossProduct1 = new THREE.Vector3().crossVectors(edge1, edge2);
    const area1 = crossProduct1.length() * 0.5;

    // Triangle 2: v0, v2, v3
    const edge3 = new THREE.Vector3().subVectors(v2, v0);
    const edge4 = new THREE.Vector3().subVectors(v3, v0);
    const crossProduct2 = new THREE.Vector3().crossVectors(edge3, edge4);
    const area2 = crossProduct2.length() * 0.5;

    // Total area
    return area1 + area2;
  }

  createMesh() {
    const material = new THREE.MeshToonMaterial({
      color: this.color
    });
    this.mesh = new THREE.Mesh(this.geometry, material);
    this.mesh.receiveShadow = true;
    
    this.mesh.userData.tileCoordinates = { x: this.x, y: this.y };
  }

  createForest() {
    const geometry = new THREE.ConeGeometry(0.2, 1, 8);
    const material = new THREE.MeshToonMaterial({ color: 0x225b22 });
    const forest = new THREE.Mesh(geometry, material);
    forest.castShadow = true;
    forest.position.set(this.center.x, this.center.y + 0.4, this.center.z);
    this.addBuilding(forest, 'forest');
    return forest;
  }

  addBuilding(mesh, type) {
    this.building = new Building(type, mesh.position, this.biomeType)
  }

  removeFromScene(scene) {
    if (this.mesh) {
      scene.remove(this.mesh);
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
      if(this.building) {    
        scene.remove(this.building.mesh); 
        this.building.deleteBuildingMesh();
        this.building = null;
        }
    }
  }
}
