import * as THREE from 'three';
import { Complex } from '../types';

export function extractVortexLines(
    wave:(x:number,y:number,z:number)=>Complex,
    bounds:number, N:number
){
    // Sample on a uniform grid in [-bounds, bounds]^3
    const xs = [...Array(N)].map((_,i)=> -bounds + 2*bounds*i/(N-1));
    const field = new Array(N*N*N);
    let k=0;
    for (let iz=0; iz<N; iz++)
        for (let iy=0; iy<N; iy++)
            for (let ix=0; ix<N; ix++){
                const {re,im} = wave(xs[ix], xs[iy], xs[iz]);
                field[k++] = { re, im };
            }
    // TODO: detect simultaneous zero crossings (Re and Im),
    // build segments, chain into polylines (e.g., via hash of voxel edges).
    // Return a THREE.LineSegments mesh.
    return new THREE.LineSegments(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial({ linewidth: 2 })
    );
}
