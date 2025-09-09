
import * as THREE from 'three';
import { createRenderer } from './systems/renderer';
import { Resizer } from './systems/resizer';
import { Loop } from './systems/Loop';
import { createOrbitControls } from './systems/orbit-controls';
import { createCamera } from './components/camera';
import { createScene } from './components/scene';
import { createLights } from './components/lights';
import { createAxis } from './components/axis';
import OrbitalBuilder from './components/orbital-builder';
import { createSetting } from './components/settings';
import Intersection from "./components/intersection";
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitalRegion } from './types';

class OrbitalViewer {
    camera: PerspectiveCamera;
    scene: Scene;
    renderer: WebGLRenderer;
    loop: Loop;
    orbitalInx: number;
    orbitalBuilder: OrbitalBuilder;
    regions: OrbitalRegion[];
    intersection: Intersection;
    meshes: THREE.Mesh[];

    constructor(container) {
        this.camera = createCamera();
        this.scene = createScene();
        this.renderer = createRenderer();
        this.loop = new Loop(this.camera, this.scene, this.renderer);
        this.orbitalInx = 1;
        this.orbitalBuilder = new OrbitalBuilder(this.orbitalInx);
        this.regions = this.orbitalBuilder.getRegions();
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
        const orbital = this.orbitalBuilder.createOrbital();
        this.meshes = orbital.meshes;
        let intersectorZ = (orbital.minimum + orbital.maximum) / 2;
        this.meshes.forEach(mesh => this.scene.add(mesh));
        let settings = {
            intersector:{
                min: orbital.minimum,
                max: orbital.maximum,
                event: val => this.changeIntersector(val)
            },
            orbital:{
                data: [0,1],
                current: this.orbitalInx,
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
        this.meshes?.forEach(mesh => this.scene.remove(mesh));
    }

    changeIntersector(value) {
        this.intersection.update(value);
    }

    changeOrbital(value) {
        this.clear();
        this.orbitalInx = value;
        this.orbitalBuilder = new OrbitalBuilder(this.orbitalInx);
        this.regions = this.orbitalBuilder.getRegions();
        this.intersection = new Intersection(this.regions);
        this.init();
    }
}

export default OrbitalViewer;