import { Building } from "./building.js";
import * as THREE from "three";

function createTextSprite(text) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const fontSize = 24;
  context.font = `${fontSize}px Arial`;
  canvas.width = context.measureText(text).width;
  canvas.height = fontSize * 1.4;

  context.fillStyle = 'white';
  context.textAlign = 'center';
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  return texture;
}

export function updatePlayerResources(player, uiState) {
  uiState.playerResourcesText.material.map = createTextSprite(`Your Resources: ${player.resources}`);
}

export function updateTileInfo(meshData, uiState) {
  if (meshData.building) {
    uiState.tileInfoText.material.map = createTextSprite(`Tile: (${meshData.tileCoordinates.x}, ${meshData.tileCoordinates.y})`);
    uiState.buildingTypeText.material.map = createTextSprite(`Building Type: ${meshData.building.type}`);
    uiState.upgradeLevelText.material.map = createTextSprite(`Level: ${meshData.building.level}`);
  } else {
    uiState.tileInfoText.material.map = createTextSprite(`Tile: (${meshData.tileCoordinates.x}, ${meshData.tileCoordinates.y})`);
    uiState.buildingTypeText.material.map = createTextSprite(`Building Type: None`);
    uiState.upgradeLevelText.material.map = createTextSprite(`Level: 0`);
  }
}

export function addBuilding(meshData, type, player, uiState) {
  const cost = type === "Farm" ? 100 : type === "Mine" ? 200 : 0;
  if (player.deductResources(cost)) {
    if (meshData && !meshData.building) {
      meshData.building = new Building(type, meshData.tileCoordinates, meshData.biomeType);
      updateTileInfo(meshData, uiState); // Update UI
    }
  }
}

export function upgradeBuilding(meshData, player, uiState) {
  const cost = meshData.building.level * 10;
  if (player.deductResources(cost)) {
    meshData.building.upgrade();
    updateTileInfo(meshData, uiState); // Update UI
  }
}

export function showInfo(meshData, player, uiState) {
  updateTileInfo(meshData, uiState);

  // Add player resources controller
  updatePlayerResources(player, uiState);
}

// Example class method to upgrade the building
Building.prototype.upgrade = function () {
  // Implement the upgrade logic
  console.log(`Upgraded ${this.type}`);
  // Update building properties, such as level or resources
  this.level = (this.level || 1) + 1;
};
