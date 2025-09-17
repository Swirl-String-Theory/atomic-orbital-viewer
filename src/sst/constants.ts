export const RC = 1.40897017e-15;                  // m
export const F_MAX_C = 29.053507;                  // N
export const HBAR = 1.054571817e-34;               // J*s
export const M_E = 9.1093837015e-31;               // kg
export const C = 299792458;                        // m/s

// UI-tunable calibration (β=4 matches Bohr/Rydberg with your Canon numbers)
export let BETA = 4.0;
export function setBeta(b: number){ BETA = b; }

export function g_swirl(){ return BETA * F_MAX_C * RC * RC; } // J*m
export function a_SST(){ return (HBAR*HBAR) / (M_E * g_swirl()); } // m
export const a0 = 5.29177210903e-11;              // Bohr radius (for QM mode)
