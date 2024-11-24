import { AtomicOrbital } from "./src/atomic-orbital-viewer/atomic-orbital-viewer";


render();

function render() {
    const container = document.querySelector('#scene-container');
    const atomicOrbital = new AtomicOrbital(container);
    atomicOrbital.start();
}


