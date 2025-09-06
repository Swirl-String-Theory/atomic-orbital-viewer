
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';
import { createOrbitControls } from './systems/orbit-controls.js';
import { createCamera } from './components/camera.js';
import { createScene } from './components/scene.js';
import { createLights } from './components/lights.js';
import { createAxis } from './components/axis.js';
import { createOrbitals, getRegions } from './components/orbitals.js';
import { createSetting } from './components/settings.js';
import Intersection from "./components/intersection.js";

class OrbitalViewer {
    constructor(container) {
        this.camera = createCamera();
        this.scene = createScene();
        this.renderer = createRenderer();
        this.loop = new Loop(this.camera, this.scene, this.renderer);
        this.orbital = 3;
        this.regions = getRegions(this.orbital);
        this.intersection = new Intersection(this.regions);
        container.append(this.renderer.domElement);
        let axis = createAxis();
        const orbitControls = createOrbitControls(this.camera, this.renderer.domElement);
        this.loop.updatables.push(orbitControls);
        const { ambientLight, mainLight } = createLights();
        this.scene.add(axis, ambientLight, mainLight);
        orbitControls.addEventListener('change', () => { this.render(); });
        new Resizer(container, this.camera, this.renderer);
        this.init();    
    }
    render() {
        this.renderer.render(this.scene, this.camera);
    }
    start() {
        this.loop.start();
    }

    stop() {
        this.loop.stop();
    }

    init() {
        const orbitals = createOrbitals(this.orbital);
        this.allMesh = orbitals.meshArr;
        let intersectorZ = (orbitals.minimum + orbitals.maximum) / 2;
        this.allMesh.forEach(mesh => {
            this.loop.updatables.push(mesh);
            this.scene.add(mesh);
        });
        let settings = {
            intersector:{
                min: orbitals.minimum,
                max: orbitals.maximum,
                event: val => this.changeIntersector(val)
            },
            orbital:{
                data: [0,1,2,3],
                current: this.orbital,
                intersector: intersectorZ,
                event: val => this.changeOrbital(val)
            }
        };
        createSetting(settings);
        this.intersection.create(intersectorZ);
        this.scene.add(this.intersection.plane);
    }

    clear(){
        this.scene.remove(this.intersection.plane);
        this.allMesh?.forEach(mesh => this.scene.remove(mesh));
    }

    changeIntersector(value) {
        this.intersection.update(value);
    }

    changeOrbital(value) {
        this.clear();
        this.orbital = value;
        this.regions = getRegions(this.orbital);
        this.intersection = new Intersection(this.regions);
        this.init();
    }
}

export default OrbitalViewer;