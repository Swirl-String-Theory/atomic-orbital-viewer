import * as THREE from 'three';
import { orbitals } from '../data/orbital-data';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';

function createOrbitals() {
    let orbital = orbitals[0], regions = orbital.regions, minValue = orbital.minValue, maxValue = orbital.maxValue;
    let points = [], meshArr = [];;
    regions.forEach(region => {
        let coordinates = region.coordinates;
        coordinates.forEach(coordinate => {
            let z = coordinate.z, cPoints = coordinate.points;
            for (var i = 0; i < cPoints.length; i++) {
                points.push(new THREE.Vector3(cPoints[i][0], cPoints[i][1], z));
            }

        });
        var geometry = new ConvexGeometry(points);
        var material = new THREE.MeshPhysicalMaterial({ color: region.color, side: THREE.DoubleSide });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.tick = () => { };
        meshArr.push(mesh);
    });
    return { meshArr, minValue, maxValue};
}
function getCoordinates(){
    let orbital = orbitals[0], regions = orbital.regions, coordinates=[];
    regions.forEach(region => {
        coordinates.push(region.coordinates);
    });
    return coordinates;
}
export { createOrbitals, getCoordinates }