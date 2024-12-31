
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';
import { createOrbitControls } from './systems/orbit-controls.js';
import { createCamera } from './components/camera.js';
import { createScene } from './components/scene.js';
import { createLights } from './components/lights.js';
import { createAxis } from './components/axis.js';
import { createOrbitals, getRegions } from './components/orbitals.js';
import { createPlanar } from './components/planar.js';
import { createSetting } from './components/settings.js';
import { createIntersection, updateIntersection } from "./components/intersection.js";

let camera, renderer, scene, loop, axis, planar, allMesh, orbital = 0, intersection, intersector, regions;

class AtomicOrbital {
    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        loop = new Loop(camera, scene, renderer);
        container.append(renderer.domElement);
        axis = createAxis();
        const orbitControls = createOrbitControls(camera, renderer.domElement);
        loop.updatables.push(orbitControls);
        const { ambientLight, mainLight } = createLights();
        scene.add(axis, ambientLight, mainLight);
        orbitControls.addEventListener('change', () => { this.render(); });
        const resizer = new Resizer(container, camera, renderer);
        this.init();    
        regions = getRegions(orbital);
        intersection = createIntersection('Intersection', intersector, regions);
    }
    render() {
        renderer.render(scene, camera);
    }
    start() {
        loop.start();
    }

    stop() {
        loop.stop();
    }

    init() {
        this.clear();
        const orbitals = createOrbitals(orbital);
        allMesh = orbitals.meshArr;
        intersector = (orbitals.minimum + orbitals.maximum) / 2;
        allMesh.forEach(mesh => {
            loop.updatables.push(mesh);
            scene.add(mesh);
        });
        let settings = {
            intersector:{
                min: orbitals.minimum,
                max: orbitals.maximum,
                event: this.changeIntersector
            },
            orbital:{
                data: [0,1,2,3],
                event: value => this.changeOrbital(value)
            }
        };
        createSetting(settings);
        planar = createPlanar(intersector);
        scene.add(planar);
    }

    clear(){
        scene.remove(planar);
        if (allMesh && allMesh.length !== 0) allMesh.forEach(mesh => scene.remove(mesh));
    }

    changeIntersector(value) {
        intersector = value;
        planar.position.set(0, 0, intersector);
        updateIntersection(intersector, regions);
    }

    changeOrbital(value) {
        orbital = value;
        this.init();
        regions = getRegions(orbital);
        updateIntersection(intersector, regions);
    }

}

export { AtomicOrbital };