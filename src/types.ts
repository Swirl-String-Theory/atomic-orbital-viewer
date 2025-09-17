import { CrudeRegion } from "./components/component";

export type Complex = { re: number; im: number };

export type Orbital = {
    title: string;
    maximumZ: number;
    maximumXY: number;

    // keep the existing sampler for |ψ|^2 (fast path)
    probability: (x: number, y: number, z: number) => number;

    // NEW: full complex wavefunction (needed for R/T, knots, velocity overlays)
    wave?: (x: number, y: number, z: number) => Complex;

    _regions: CrudeRegion[];
    regions: OrbitalRegion[];
};


export type OrbitalRegion = {
    coordinates?: { z: number; points: [number, number][] }[];
    xzCoordinates?: {
        pointsSide1: [number, number][];
        pointsSide2: [number, number][];
        minZ: number;
        maxZ: number;
    };
    isConvex: boolean;
    color: string;
    closed: boolean;
};

