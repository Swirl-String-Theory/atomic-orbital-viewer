import GUI from 'lil-gui';

function createControlPanel(minValue, maxValue, changeIntersector) {
    const gui = new GUI({ width: 310 });
    const myObject = {
        intersector: 0
    };
    gui.add(myObject, 'intersector', minValue, maxValue, 0.1).onChange(changeIntersector);
    return gui;
}
export { createControlPanel }