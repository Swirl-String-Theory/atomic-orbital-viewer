import * as THREE from 'three';
import { orbitals } from '../data/orbital-data';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';
import { LoopSubdivision } from 'three-subdivide';

function createOrbitals(value) {
    let orbital = orbitals[value], regions = orbital.regions, minimum = orbital.minimum, maximum = orbital.maximum;
    let meshArr = [], geometry;
    regions.forEach(region => {
        let points = [];
        if (region.isConvex) {
            let coordinates = region.coordinates;
            coordinates.forEach(coordinate => {
                let z = coordinate.z, cPoints = coordinate.points;
                for (var i = 0; i < cPoints.length; i++) {
                    points.push(new THREE.Vector3(cPoints[i][0], cPoints[i][1], z));
                }

            });
            geometry = new ConvexGeometry(points);
            geometry = LoopSubdivision.modify(geometry, 2);
        }
        else if (!region.isConvex) {
            if (region.coordinates) region.coordinates.forEach(c => points.push(new THREE.Vector2(c[0], c[1])));
            geometry = new THREE.LatheGeometry(points, 50);
        }
        var material = new THREE.MeshLambertMaterial({
            color: region.color,
            opacity: 0.7,
            side: THREE.DoubleSide,
            transparent: true
        });
        var mesh = new THREE.Mesh(geometry, material);
        if (!region.isConvex)
            mesh.rotation.x = Math.PI / 2;
        mesh.tick = () => { };
        meshArr.push(mesh);
    });
    return { meshArr, minimum, maximum };
}

function getRegions(selectedOrbital) {
    let orbital = orbitals[selectedOrbital], regions = [];
    orbital.regions.forEach(region => {
        if (region.isConvex)
            regions.push({ coordinates: region.coordinates, isConvex: region.isConvex, color: region.color });
        else {
            let coordinates = region.coordinates;
            let minZ = Math.min(...coordinates.map(c => c[1])), maxZ = Math.max(...coordinates.map(c => c[1]));
            let indexMinZ = coordinates.findIndex(c => c[1] === minZ), indexMaxZ = coordinates.findIndex(c => c[1] === maxZ);
            let arr1 = coordinates.slice(indexMinZ, indexMaxZ + 1);
            let arr2 = [...coordinates.slice(indexMaxZ, coordinates.length), ...coordinates.slice(0, indexMinZ + 1)];
            arr2.reverse();
            regions.push({ coordinates: { arr1: arr1, arr2: arr2, minZ: minZ, maxZ: maxZ, indexMinZ: indexMinZ, indexMaxZ: indexMaxZ }, isConvex: region.isConvex, color: region.color });
        }
    });
    return regions;
}
export { createOrbitals, getRegions }