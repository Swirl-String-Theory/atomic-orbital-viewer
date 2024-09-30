import * as THREE from 'three';
import { orbitals } from '../data/orbital-data';
function createOrbitals() {
    let orbital = orbitals[0];
    let minValue = orbital.minValue, maxValue = orbital.maxValue;
    var meshArr = [];
    orbital.regions.forEach(region => {
        const points = [];
        if(region.points) region.points.forEach(p => points.push(new THREE.Vector2(p[0], p[1])));
        else {
            if(region.transverse) points.push(new THREE.Vector2(region.start, region.valueS));
            else points.push(new THREE.Vector2(region.valueS, region.start));
            for (let i = 1; i < 100; i++) {
                const z = region.start + i * ((region.end - region.start) / 100);
                let point = (region.func === undefined) ? orbital.func(z) : region.func(z);
                points.push(new THREE.Vector2(point.x, point.z));
            }
            if(region.transverse) points.push(new THREE.Vector2(region.end, region.valueE));
            else points.push(new THREE.Vector2(region.valueE, region.end));
            if(region.symmetric) {
                for (let i = 99; i > 0; i--) {
                    const z = region.start + i * ((region.end - region.start) / 100);
                    let func = region.func || orbital.func;
                    let point = func(z);
                    points.push(new THREE.Vector2(point.x,  - point.z));
                }
                if(region.transverse) points.push(new THREE.Vector2(region.start, region.valueS));
                else points.push(new THREE.Vector2(region.valueS, region.start));
            }
        }
        var geometry = new THREE.LatheGeometry(points, 50);
        var material = new THREE.MeshPhysicalMaterial({ color: region.color, side: THREE.DoubleSide });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.tick = () => { }
        meshArr.push(mesh);
    });
    return {meshArr, minValue, maxValue};
}
export { createOrbitals }