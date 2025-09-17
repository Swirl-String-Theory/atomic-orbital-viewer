import { a0, a_SST } from './constants';
import { Complex } from '../types';
import { sphericalFromXYZ } from './overlays';

// unnormalized demo forms (fine for visualization)
export function psi_2p_m_plus1(isSST:boolean){
    const a = isSST ? a_SST() : a0;
    return (x:number,y:number,z:number):Complex=>{
        const { r, theta, phi } = sphericalFromXYZ(x,y,z);
        const amp = r * Math.exp(-r/(2*a)) * Math.sin(theta);
        return { re: amp*Math.cos(+phi), im: amp*Math.sin(+phi) };
    };
}

export function psi_2p_m_minus1(isSST:boolean){
    const a = isSST ? a_SST() : a0;
    return (x:number,y:number,z:number):Complex=>{
        const { r, theta, phi } = sphericalFromXYZ(x,y,z);
        const amp = r * Math.exp(-r/(2*a)) * Math.sin(theta);
        return { re: amp*Math.cos(-phi), im: amp*Math.sin(-phi) };
    };
}
