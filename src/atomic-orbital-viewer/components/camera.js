import * as THREE from 'three';

function createCamera() {
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 10, 20);
    return camera;
}

export { createCamera };