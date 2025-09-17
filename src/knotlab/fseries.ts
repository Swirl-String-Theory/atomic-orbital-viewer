// Parse your .fseries blocks and evaluate the Fourier curve
export type FourierBlock = {
    ax: number[]; bx: number[];
    ay: number[]; by: number[];
    az: number[]; bz: number[];
};

export function parseFSeries(text: string): FourierBlock[] {
    const lines = text.split(/\r?\n/);
    const blocks: FourierBlock[] = [];
    let ax: number[] = [], bx: number[] = [], ay: number[] = [], by: number[] = [], az: number[] = [], bz: number[] = [];
    let started = false;

    const pushBlock = () => {
        if (ax.length) {
            blocks.push({
                ax: ax.slice(), bx: bx.slice(),
                ay: ay.slice(), by: by.slice(),
                az: az.slice(), bz: bz.slice()
            });
            ax = []; bx = []; ay = []; by = []; az = []; bz = [];
        }
    };

    for (const raw of lines) {
        const line = raw.trim();
        if (!line) { pushBlock(); started = false; continue; }
        if (line.startsWith('%')) { pushBlock(); started = true; continue; }
        const parts = line.split(/\s+/);
        if (parts.length === 6) {
            started = true;
            const [Ax,Bx,Ay,By,Az,Bz] = parts.map(parseFloat);
            ax.push(Ax); bx.push(Bx); ay.push(Ay); by.push(By); az.push(Az); bz.push(Bz);
        }
    }
    pushBlock();
    return blocks;
}

// Evaluate the longest block (your Python picked the max-length block)
export function evalFourierLongest(text: string, s: Float64Array): Float32Array {
    const blocks = parseFSeries(text);
    if (!blocks.length) return new Float32Array();
    const block = blocks.reduce((a,b) => (b.ax.length > a.ax.length ? b : a));
    const {ax,bx,ay,by,az,bz} = block;
    const N = ax.length;

    const out = new Float32Array(s.length * 3);
    for (let i=0;i<s.length;i++) {
        const si = s[i];
        let x=0, y=0, z=0;
        for (let j=0;j<N;j++) {
            const n = j+1;
            const c = Math.cos(n*si), t = Math.sin(n*si);
            x += ax[j]*c + bx[j]*t;
            y += ay[j]*c + by[j]*t;
            z += az[j]*c + bz[j]*t;
        }
        out[3*i  ] = x;
        out[3*i+1] = y;
        out[3*i+2] = z;
    }
    return out;
}
