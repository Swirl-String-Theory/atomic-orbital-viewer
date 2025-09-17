import GUI from 'lil-gui';

function createSetting(settings, viewer) {
    let intersector = settings.intersector, orbital = settings.orbital;
    const gui = new GUI({ width: 310 });
    const obj = {
        orbitals: orbital.current,
        intersector: orbital.intersector,

        // Knot Lab panel
        knotLab: false,
        effects: false,
        sstMode: false,
        beta: 4.0,
        colorBy: '|ψ|^2', // '|ψ|^2' | 'ρ_E' | 'Swirl-Clock'
        superpose: false,
        aMag: 1.0, bMag: 0.0, delta: 0.0, play: false
    };
    gui.add(obj, 'orbitals', orbital.data).onChange(orbital.event);
    gui.add(obj, 'intersector', intersector.min, intersector.max, 0.05).onChange(intersector.event);

    const kl = gui.addFolder('Knot Lab');
    kl.add(obj, 'knotLab').name('Enable').onChange(v => viewer.setKnotLabEnabled(v));
    kl.add(obj, 'effects').name('Curvature Glow').onChange(v => viewer.setKnotEffects(v));

    // Dynamically add checkboxes for knots
    (async () => {
        // wait for viewer.knotLayer to exist
        const layer = viewer.knotLayer;
        if (!layer) return;
        for (const entry of layer.index) {
            const entryObj = { [entry.label]: false };
            kl.add(entryObj, entry.label).onChange(async (v)=> {
                await viewer.setKnotVisible(entry.label, v);
            });
        }
    })();

    gui.add(obj, 'sstMode').onChange(v => viewer.setSSTMode(v));
    gui.add(obj, 'beta', 0.1, 8.0, 0.1).onChange(v => viewer.setBeta(v));
    gui.add(obj, 'colorBy', ['|ψ|^2','ρ_E','Swirl-Clock']).onChange(v => viewer.setColorBy(v));
    const sp = gui.addFolder('R/T Superposition');
    sp.add(obj, 'superpose').onChange(v => viewer.setSuperpose(v));
    sp.add(obj, 'aMag', 0, 1, 0.01).onChange(v => viewer.setAMag(v));
    sp.add(obj, 'bMag', 0, 1, 0.01).onChange(v => viewer.setBMag(v));
    sp.add(obj, 'delta', 0, Math.PI*2, 0.01).onChange(v => viewer.setDelta(v));
    sp.add(obj, 'play').onChange(v => viewer.setPlay(v));

    return gui;
}
export { createSetting }