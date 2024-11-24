import * as THREE from 'three';

function createCamera() {
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(10, 10, 10);
    camera.up.set(0,0,1);    
    return camera;
}

export { createCamera };