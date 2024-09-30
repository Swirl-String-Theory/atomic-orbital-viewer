import * as THREE from 'three';
function createPlane() {
    let points = [];
    const pointCoordinates = [[5, 5, 0], [-5, 5, 0], [-5, -5, 0], [5, -5, 0]];
    function addPoints(point) {
        points.push(new THREE.Vector3(...point));
    }

    for (let i = 0; i < pointCoordinates.length; i++) {
        addPoints(pointCoordinates[i])
    }

    const polygon = new THREE.Shape(points);
    const geometry = new THREE.ShapeGeometry(polygon);
    geometry.rotateX(Math.PI * 0.5);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 , side: THREE.DoubleSide, transparent: true,opacity: .4});    
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}
export { createPlane }