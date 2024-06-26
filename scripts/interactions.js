import * as THREE from 'three';

export function setupMouseInteraction(scene, camera) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredMesh = null;

    window.addEventListener('mousemove', onMouseMove);

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, false);

        if (intersects.length > 0) {
            const mesh = intersects.find(intersect => !intersect.object.userData.ignoreHover)?.object;

            if (mesh && mesh !== hoveredMesh) {
                clearMeshHover();
                handleMeshHover(mesh);
                hoveredMesh = mesh;
            }
        } else {
            clearMeshHover();
            hoveredMesh = null;
        }
    }

    function handleMeshHover(mesh) {
        if (!mesh.userData.originalMaterial) {
            mesh.userData.originalMaterial = mesh.material.clone();
        }
        mesh.material.emissive.setHex(0x00ff00);
    }

    function clearMeshHover() {
        scene.traverse((object) => {
            if (object.isMesh && object.userData.originalMaterial) {
                object.material = object.userData.originalMaterial.clone();
                delete object.userData.originalMaterial;
            }
        });
    }
}