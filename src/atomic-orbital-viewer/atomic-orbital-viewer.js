
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';
import { createControls } from './systems/controls.js';
import { createCamera } from './components/camera.js';
import { createScene } from './components/scene.js';
import { createLights } from './components/lights.js';
import { createAxis } from './components/axis.js';
import { createOrbitals } from './components/orbitals.js';
import { createPlane } from './components/plane.js';
import { createPanel } from './components/panel.js';

let camera, renderer, scene, loop, axis, plane;

class AtomicOrbital {
    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        loop = new Loop(camera, scene, renderer);
        container.append(renderer.domElement);
        axis = createAxis();

        const controls = createControls(camera, renderer.domElement);
        const { ambientLight, mainLight } = createLights();

        const { meshArr, minValue, maxValue } = createOrbitals();
        meshArr.forEach(_mesh => {
            loop.updatables.push(_mesh);
            scene.add(_mesh);
        })
        loop.updatables.push(controls);
        createPanel(minValue, maxValue, this.changeIntersector);
        plane = createPlane();
        scene.add(axis, plane, ambientLight, mainLight);
        controls.addEventListener('change', () => { this.render(); });
        const resizer = new Resizer(container, camera, renderer);
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

    changeIntersector(value) {
        plane.position.set(0, value, 0);
    }
}

export { AtomicOrbital };