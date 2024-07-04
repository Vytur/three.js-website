import { Building } from "./building.js";
import { GUI } from "lil-gui";

let gui = null; // Declare gui as a let variable instead of const

export function showInfo(meshData, player) {
  if (!gui) {
    gui = new GUI(); // Initialize gui if not already initialized
  }

  // Clear existing controllers (if applicable to your specific GUI library)
  if (gui.removeAll) {
    gui.removeAll(); // Example of removeAll() method if available
  } else {
    // Example of managing controllers individually or dynamically
    gui.destroy(); // Example of destroying gui instance and creating a new one
    gui = new GUI();
  }

  // Add player resources controller
  gui.add(player, "resources").name("Your Resources").listen();

  if (meshData.building) {
    // Add tile and building type controllers
    gui
      .add(
        {
          tile: `(${meshData.tileCoordinates.x}, ${meshData.tileCoordinates.y})`,
        },
        "tile"
      )
      .name("Tile")
      .listen();
    gui.add(meshData.building, "type").name("Building Type");
    //gui.add(meshData.building, 'resources').name('Resources').listen();

    // Create an upgrade folder and add controllers for building upgrades
    const upgradeFolder = gui.addFolder("Upgrade");
    upgradeFolder.add(meshData.building, "level").name("Level").listen();
    upgradeFolder
      .add({ upgrade: () => upgradeBuilding(meshData, player) }, "upgrade")
      .name("Upgrade Building");
  } else {
    // If no building is selected, add controllers for selecting a new building type
    const addBuildingFolder = gui.addFolder("Add Building");
    const buildingOptions = { type: "Farm" };
    addBuildingFolder
      .add(buildingOptions, "type", ["Farm", "Mine"])
      .name("Building Type");
    addBuildingFolder
      .add(
        { add: () => addBuilding(meshData, buildingOptions.type, player) },
        "add"
      )
      .name("Add Building");
  }
}

export function addBuilding(meshData, type, player) {
  const cost = type === "Farm" ? 100 : type === "Mine" ? 200 : 0;
  if (player.deductResources(cost)) {
    if (meshData && !meshData.building) {
      meshData.building = new Building(
        type,
        meshData.tileCoordinates,
        meshData.biomeType
      );
      showInfo(meshData, player); // Update the information panel
    }
  }
}

export function upgradeBuilding(meshData, player) {
  const cost = meshData.building.level * 10;
  if (player.deductResources(cost)) {
    meshData.building.upgrade();
    showInfo(meshData, player); // Update the information panel
  }
}

// Example class method to upgrade the building
Building.prototype.upgrade = function () {
  // Implement the upgrade logic
  console.log(`Upgraded ${this.type}`);
  // Update building properties, such as level or resources
  this.level = (this.level || 1) + 1;
};
