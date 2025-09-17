// Discrete curvature κ = ||r' × r''|| / ||r'||^3  (Frenet-Serret)
export function curvatureFromPositions(pts: Float32Array): Float32Array {
    const L = pts.length/3;
    const kappa = new Float32Array(L);

    const get = (i:number)=>({x:pts[3*i],y:pts[3*i+1],z:pts[3*i+2]});
    const diff = (a:{x:number,y:number,z:number}, b:{x:number,y:number,z:number}) =>
        ({x:a.x-b.x,y:a.y-b.y,z:a.z-b.z});
    const cross = (a:any,b:any)=>({x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x});
    const norm = (v:any)=>Math.hypot(v.x,v.y,v.z);

    for (let i=0;i<L;i++){
        const im = (i-1+L)%L, ip = (i+1)%L;
        const rm = get(im), r0 = get(i), rp = get(ip);
        const r1 = diff(rp, rm);               // ~ 2Δs r'
        const r2 = diff(diff(rp, r0), diff(r0, rm)); // ~ Δs^2 r''
        const num = norm(cross(r1, r2));
        const den = Math.pow(norm(r1) + 1e-12, 3);
        kappa[i] = num / (den + 1e-24);
    }
    return kappa;
}
