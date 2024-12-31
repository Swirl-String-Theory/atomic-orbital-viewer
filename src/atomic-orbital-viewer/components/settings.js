import GUI from 'lil-gui';

const obj = {
    orbitals: 0,
    intersector: 0
};

function createSetting(settings) {
    let intersector = settings.intersector, orbital = settings.orbital;
    const gui = new GUI({ width: 310 });
    obj.intersector = (intersector.min + intersector.max) / 2;
    gui.add(obj, 'orbitals', orbital.data).onChange(orbital.event);
    gui.add(obj, 'intersector', intersector.min, intersector.max, 0.1).onChange(intersector.event);
    return gui;
}
export { createSetting }