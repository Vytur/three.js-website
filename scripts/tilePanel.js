import { Building } from './building.js';

export function showInfo(x, y, building) {
    const infoPanel = document.getElementById('infoPanel');
    const infoTitle = document.getElementById('infoTitle');
    const infoContent = document.getElementById('infoContent');
    const upgradeButton = document.getElementById('upgradeButton');

    infoTitle.textContent = `Tile: (${x}, ${y})`;
    let content = ``;
    
    if (building) {
        content += `Building: ${building.type}<br>`;
        content += `Resources: ${building.resources}<br>`;
        upgradeButton.style.display = 'block';
        upgradeButton.onclick = () => upgradeBuilding(x, y, building);
    } else {
        upgradeButton.style.display = 'none';
    }
    
    infoContent.innerHTML = content;
    infoPanel.style.display = 'block';
}

export function upgradeBuilding(x, y, building) {
    // Perform upgrade logic here
    console.log(`Upgrading building at (${x}, ${y})`);
    building.upgrade();
    showInfo(x, y, building); // Update the information panel
}

// Example class method to upgrade the building
Building.prototype.upgrade = function() {
    // Implement the upgrade logic
    console.log(`Upgraded ${this.type}`);
    // Update building properties, such as level or resources
    this.level = (this.level || 1) + 1;
};