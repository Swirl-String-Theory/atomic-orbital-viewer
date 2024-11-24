import * as THREE from 'three';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';

function createSample() {
    // let z = [-2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5], points = [new THREE.Vector3(0, 0, -3)], r;
    // for (var j = 0; j < 11; j++) {
    //     for (var i = 0; i < 30; i++) {
    //         r = Math.sqrt(9 - z[j] * z[j]);
    //         points.push(new THREE.Vector3(r * Math.cos(2 * Math.PI * i / 30), r * Math.sin(2 * Math.PI * i / 30), z[j]));
    //     }
    // }
    // points.push(new THREE.Vector3(0, 0, 3));
    // let z = [-2.8, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 2.8], arr = [{ z: -3, points: [[0, 0]] }];
    // for (let i = 0; i < 11; i++) {
    //     let points = [];
    //     for (let j = 0; j < 30; j++) {
    //         let teta = 2 * Math.PI * j / 30;
    //         let r = Math.sqrt(9 - z[i] * z[i]);
    //         let point = [r * Math.cos(teta), r * Math.sin(teta)];
    //         points.push(point);
    //     }
    //     arr.push({ z: z[i], points: points });
    // }
    // arr.push({ z: 3, points: [[0, 0]] })
    
    console.log(arr);
    var convexGeometry = new ConvexGeometry(points);
    var material = new THREE.MeshPhysicalMaterial({ color: 0xff0000, side: THREE.DoubleSide });
    var mesh = new THREE.Mesh(convexGeometry, material);
    mesh.tick = () => { }
    return mesh;
}
export { createSample }