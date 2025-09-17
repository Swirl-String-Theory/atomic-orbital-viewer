import * as THREE from 'three';
import { evalFourierLongest } from './fseries';
import { curvatureFromPositions } from './curvature';
import { plasma } from './colormap';

export type KnotEntry = { label: string; path: string; };
export type KnotState = { visible: boolean; mesh: THREE.Line|null; pts?: Float32Array; curv?: Float32Array; };

export class KnotLayer {
    group = new THREE.Group();
    index: KnotEntry[] = [];
    state: Map<string, KnotState> = new Map();
    effects = false;
    samples = 1000;
    scale = 1.0;

    async loadIndex(url = '/knots/index.json'){
        const res = await fetch(url);
        const json = await res.json() as { files: KnotEntry[] };
        this.index = json.files;
        this.index.forEach(k => this.state.set(k.label, {visible:false, mesh:null}));
    }

    async toggle(label: string, on: boolean){
        const st = this.state.get(label)!;
        if (on && !st.mesh){
            // fetch, parse, build line
            const entry = this.index.find(e => e.label === label)!;
            const text = await (await fetch(`/knots/${entry.path}`)).text();
            const s = new Float64Array(this.samples);
            for (let i=0;i<this.samples;i++) s[i] = 2*Math.PI*i/(this.samples-1);
            const pts = evalFourierLongest(text, s);
            // center + scale to unit radius
            const L = pts.length/3;
            let cx=0,cy=0,cz=0;
            for (let i=0;i<L;i++){ cx+=pts[3*i]; cy+=pts[3*i+1]; cz+=pts[3*i+2]; }
            cx/=L; cy/=L; cz/=L;
            let rmax=1e-12;
            for (let i=0;i<L;i++){
                const x=pts[3*i]-cx, y=pts[3*i+1]-cy, z=pts[3*i+2]-cz;
                rmax = Math.max(rmax, Math.hypot(x,y,z));
            }
            for (let i=0;i<L;i++){
                pts[3*i  ] = (pts[3*i  ]-cx)/(rmax) * this.scale;
                pts[3*i+1] = (pts[3*i+1]-cy)/(rmax) * this.scale;
                pts[3*i+2] = (pts[3*i+2]-cz)/(rmax) * this.scale;
            }
            const curv = curvatureFromPositions(pts);
            // normalize curvature for colormap
            let kmin=Infinity,kmax=-Infinity;
            for (let i=0;i<L;i++){ const k=curv[i]; if(k<kmin)kmin=k; if(k>kmax)kmax=k; }
            const colors = new Float32Array(L*3);
            for (let i=0;i<L;i++){
                const t = (curv[i]-kmin)/Math.max(1e-12,(kmax-kmin));
                const [r,g,b] = plasma(t);
                colors[3*i  ] = r; colors[3*i+1] = g; colors[3*i+2] = b;
            }

            const geom = new THREE.BufferGeometry();
            geom.setAttribute('position', new THREE.BufferAttribute(pts, 3));
            geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            // LineBasicMaterial ignores linewidth in most browsers; we emulate glow with duplicate lines if effects
            const mat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 1.0 });
            const line = new THREE.Line(geom, mat);
            this.group.add(line);
            st.mesh = line; st.pts = pts; st.curv = curv;
            if (this.effects) this.addGlow(line);
        }
        st.visible = on;
        if (st.mesh) st.mesh.visible = on;
    }

    setEffects(on: boolean){
        this.effects = on;
        for (const st of this.state.values()){
            if (st.mesh){
                // simple "glow": two faint white lines overlayed
                this.removeGlow(st.mesh);
                if (on) this.addGlow(st.mesh);
            }
        }
    }

    private addGlow(line: THREE.Line){
        const geom = line.geometry as THREE.BufferGeometry;
        const glow1 = new THREE.Line(geom.clone(), new THREE.LineBasicMaterial({ color: 0xffffff, transparent:true, opacity:0.12 }));
        const glow2 = new THREE.Line(geom.clone(), new THREE.LineBasicMaterial({ color: 0xffffff, transparent:true, opacity:0.06 }));
        glow1.userData.__isGlow = true; glow2.userData.__isGlow = true;
        // Slightly scale outwards for a halo feel
        glow1.scale.setScalar(1.01); glow2.scale.setScalar(1.02);
        line.add(glow1); line.add(glow2);
    }

    private removeGlow(line: THREE.Line){
        const toRemove: THREE.Object3D[] = [];
        line.children.forEach(ch => { if (ch.userData.__isGlow) toRemove.push(ch); });
        toRemove.forEach(ch => line.remove(ch));
    }
}
