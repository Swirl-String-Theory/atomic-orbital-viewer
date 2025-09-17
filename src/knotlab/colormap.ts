// Lightweight "plasma-like" colormap, t in [0,1]
export function plasma(t:number){
    t = Math.min(1, Math.max(0,t));
    // simple cubic palette (approximate)
    const r = 0.5 + 1.5*t - 1.0*t*t;
    const g = 0.1 + 1.2*t - 0.6*t*t;
    const b = 0.8 - 0.6*t + 0.2*t*t;
    return [r, g, b, 1.0] as [number,number,number,number];
}
