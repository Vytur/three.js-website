import { createNoise2D } from 'simplex-noise';
import seedrandom from 'seedrandom';

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
        if (noiseValue < -0.2) {
            biomeName = 'water';
            correlation = -0.2;
        } else if (noiseValue < 0.0) {
            biomeName = 'beach';
            correlation = noiseValue;
        } else if (noiseValue < 0.3) {
            biomeName = 'forest';
            correlation = noiseValue;
        } else if (noiseValue < 0.6) {
            biomeName = 'plains';
            correlation = noiseValue;
        } else {
            biomeName = 'mountain';
            correlation = noiseValue;
        }

        return { biomeName, correlation };
    }

    // Function to get biome color based on biome type
    getBiomeColor(biome) {
        switch (biome) {
            case 'water':
                return 0x0000ff; // Blue
            case 'beach':
                return 0xffff00; // Yellow
            case 'forest':
                return 0x008000; // Green
            case 'plains':
                return 0x00ff00; // Light Green
            case 'mountain':
                return 0x808080; // Grey
            default:
                return 0xffffff; // White
        }
    }
}