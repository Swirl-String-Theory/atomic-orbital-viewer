
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';
import { createControls } from './systems/controls.js';
import { createCamera } from './components/camera.js';
import { createScene } from './components/scene.js';
import { createLights } from './components/lights.js';
import { createAxis } from './components/axis.js';
import { createOrbitals, getCoordinates } from './components/orbitals.js';
import { createPlanar } from './components/planar.js';
import { createControlPanel } from './components/control-panel.js';
import { createPanel, updatePanel } from "./components/panel";

let camera, renderer, scene, loop, axis, planar, panel;

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
        createControlPanel(minValue, maxValue, this.changeIntersector);
        planar = createPlanar();
        scene.add(axis, planar, ambientLight, mainLight);
        controls.addEventListener('change', () => { this.render(); });
        const resizer = new Resizer(container, camera, renderer);
        panel = createPanel('Intersector Panel', true);
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
        planar.position.set(0, 0, value);
        updatePanel(value);
    }
}

export { AtomicOrbital };