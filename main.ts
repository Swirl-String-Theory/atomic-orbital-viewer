import OrbitalViewer from "./src/atomic-orbital-viewer/orbital-viewer";


render();

function render() {
    const container = document.querySelector('#scene-container')! as HTMLElement;
    const viewer = new OrbitalViewer(container);
    viewer.start();
}


