import * as THREE from 'three';
import { showInfo, initializeUI } from './ui.js';

export function setupMouseInteraction(scene, camera, player) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hoveredMesh = null;

  initializeUI(camera);

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('click', onMouseClick);

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

  function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, false);

    if (intersects.length > 0) {
      const mesh = intersects.find(intersect => !intersect.object.userData.ignoreHover)?.object;

      if (mesh) {
        const tileCoordinates = mesh.userData.tileCoordinates;
        if (tileCoordinates) {
          showInfo(mesh.userData, player);
        }
      }
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