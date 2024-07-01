import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import { Tile } from "./tile";
import seedrandom from "seedrandom";

let previousOffsetX = 0;
let previousOffsetY = 0;

const createdTiles = {};

export function updateGrid(scene, camera, tileSize, offsetRange, seed) {
  const offsetX = Math.floor(camera.position.x / tileSize);
  const offsetY = Math.floor((camera.position.z - 14) / tileSize);

  if (offsetX === previousOffsetX && offsetY === previousOffsetY) {
    return;
  }

  previousOffsetX = offsetX;
  previousOffsetY = offsetY;

  const visibleRange = 12;
  const newTiles = [];
  const newVertices = [];

  // Calculate new visible tiles
  for (let y = offsetY - visibleRange; y < offsetY + visibleRange; y++) {
    for (let x = offsetX - visibleRange; x < offsetX + visibleRange; x++) {
      const tileKey = `${x},${y}`;
      if (!createdTiles[tileKey]) {
        const tile = new Tile(x, y, tileSize, offsetRange, seed);
        tile.createMesh();
        createdTiles[tileKey] = tile;
        newTiles.push(tile);
        newVertices.push(tile.vertices[0]);
      }
    }
  }

  // Remove old tiles
  Object.keys(createdTiles).forEach((tileKey) => {
    const [x, y] = tileKey.split(",").map(Number);
    if (
      x < offsetX - visibleRange ||
      x >= offsetX + visibleRange ||
      y < offsetY - visibleRange ||
      y >= offsetY + visibleRange
    ) {
      const tile = createdTiles[tileKey];
      tile.removeFromScene(scene);
      delete createdTiles[tileKey];
    }
  });

  // Add new tiles
  newTiles.forEach((tile) => {
    if (!scene.children.includes(tile.mesh)) {
      // Update trees
      updateForest(scene, tile, seed);
      scene.add(tile.mesh);
    }
  });
}

function updateForest(scene, tile, seed) {
  const rng = seedrandom(seed);
  const vertex = tile.vertices[0];
  if (vertex && vertex.y > 0.2 && vertex.y < 0.5 && rng() > 0.1) {
    tile.createForest();
    //tile.forest.position.set(vertex.x, vertex.y + 0.4, vertex.z);
    scene.add(tile.building);
  }
}
