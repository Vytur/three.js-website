import { createNoise2D } from "simplex-noise";
import * as THREE from "three";
import seedrandom from "seedrandom";

// Biome class to determine the biome type based on noise values
export class Biome {
  constructor(seed) {
    this.noise2D = new createNoise2D(seedrandom(seed));
  }

  // Function to get biome type based on noise value
  getBiome(x, y) {
    const noiseValue = this.noise2D(x / 20, y / 20);

    let biomeName;
    let correlation;
    if (noiseValue < -0.4) {
      biomeName = "ocean";
      correlation = -0.21;
    } else if (noiseValue < -0.2) {
      biomeName = "water";
      correlation = -0.2;
    } else if (noiseValue < 0.0) {
      biomeName = "beach";
      correlation = noiseValue;
    } else if (noiseValue < 0.3) {
      biomeName = "forest";
      correlation = noiseValue;
    } else if (noiseValue < 0.6) {
      biomeName = "plains";
      correlation = noiseValue;
    } else if (noiseValue < 0.7) {
      biomeName = "mountainp";
      correlation = noiseValue * 1.5;
    } else if (noiseValue < 0.8) {
      biomeName = "mountain";
      correlation = noiseValue * 2;
    } else {
      biomeName = "tip";
      correlation = noiseValue * 3;
    }

    return { biomeName, correlation };
  }

  // Function to get biome color based on biome type
  getBiomeColor(biomeName) {
    return softColorPalette[biomeName];
  }
}

const softColorPalette = {
  water: new THREE.Color(0x6495ed), // Soft blue
  ocean: new THREE.Color(0x4682b4), // Deep blue
  beach: new THREE.Color(0xfff5ba), // Soft yellowish sand
  forest: new THREE.Color(0x228b22), // Soft green
  plains: new THREE.Color(0x7cfc00), // Lime green
  mountain: new THREE.Color(0xd3d3d3), // Light gray
  mountainp: new THREE.Color(0xcdcdcd), // Light light gray
  tip: new THREE.Color(0xffffff), // White
};
