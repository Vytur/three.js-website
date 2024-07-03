import * as THREE from 'three';

export class Building {
    constructor(type, position, terrain) {
        this.type = type;
        this.position = position;
        this.terrain = terrain;
        this.level = 1;
        this.mesh = this.createBuildingMesh();
    }

    createBuildingMesh() {
        let geometry;
        let material;

        switch (this.type) {
            case 'house':
                geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
                material = new THREE.MeshToonMaterial({ color: 0x8b4513 });
                break;
            case 'forest':
                geometry = new THREE.ConeGeometry(0.2, 1, 8);
                material = new THREE.MeshToonMaterial({ color: 0x225b22 });
                break;
            default:
                return null;
        }

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(this.position.x, this.position.y, this.position.z);
        return mesh;
    }

    deleteBuildingMesh(){
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
    }

    upgrade() {
        // Implement the upgrade logic
        console.log(`Upgrading ${this.type}`);
        this.level += 1;
        // Update resources or other properties if necessary
    }
}