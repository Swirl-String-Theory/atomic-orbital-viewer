import * as THREE from 'three';
function createPlanar(z) {
    let points = [];
    const coordinates = [[5, 5, 0], [-5, 5, 0], [-5, -5, 0], [5, -5, 0]];
    function addPoints(point) {
        points.push(new THREE.Vector3(...point));
    }

    for (let i = 0; i < coordinates.length; i++) {
        addPoints(coordinates[i])
    }

    const polygon = new THREE.Shape(points);
    const geometry = new THREE.ShapeGeometry(polygon);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, transparent: true, opacity: .2 });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(0, 0, z);
    return mesh;
}
export { createPlanar }