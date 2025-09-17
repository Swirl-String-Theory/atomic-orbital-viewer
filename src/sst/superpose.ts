import { Complex } from '../types';

export function cadd(a:Complex,b:Complex):Complex{ return {re:a.re+b.re, im:a.im+b.im}; }
export function cmul(a:Complex,b:Complex):Complex{ return {re:a.re*b.re - a.im*b.im, im:a.re*b.im + a.im*b.re}; }
export function cexp(iPhase:number):Complex{ return {re:Math.cos(iPhase), im:Math.sin(iPhase)}; }
export function abs2(c:Complex){ return c.re*c.re + c.im*c.im; }

export function superpose(
    psiA:(x:number,y:number,z:number)=>Complex,
    psiB:(x:number,y:number,z:number)=>Complex,
    aMag:number, bMag:number, delta:number, omega:number, t:number
){
    const ea = cexp(-omega*t);             // e^{-i ω t}
    const eb = cexp(-(omega*t + delta));   // e^{-i(ωt+δ)}
    return (x:number,y:number,z:number)=>{
        const A = cmul({re:aMag,im:0}, cmul(psiA(x,y,z), ea));
        const B = cmul({re:bMag,im:0}, cmul(psiB(x,y,z), eb));
        return cadd(A,B);
    };
}
