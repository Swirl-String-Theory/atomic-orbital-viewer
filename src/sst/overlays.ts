import { C, HBAR, M_E } from './constants';

export function sphericalFromXYZ(x:number,y:number,z:number){
    const r = Math.hypot(x,y,z);
    const theta = r === 0 ? 0 : Math.acos(z / r);
    const phi = Math.atan2(y,x);
    return { r, theta, phi };
}

export function v_phi_from_m(m:number, x:number,y:number,z:number){
    if (m === 0) return 0;
    const { r, theta } = sphericalFromXYZ(x,y,z);
    const s = Math.max(1e-9, Math.sin(theta));
    return (HBAR * m) / (M_E * r * s); // m/s
}

export function swirlEnergyDensity(v:number, rho_f=7.0e-7){
    return 0.5 * rho_f * v*v; // J/m^3
}

export function swirlClock(v:number){
    const beta2 = (v*v)/(C*C);
    return Math.sqrt(Math.max(0, 1 - beta2));
}
