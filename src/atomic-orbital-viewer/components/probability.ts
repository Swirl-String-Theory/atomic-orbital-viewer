
import { Orbital, OrbitalRegion } from '../types';
import { Panel } from './panel';
import Util from './util';

export class Probability extends Panel {
    y: number = null;
    z: number = null;

    constructor(public orbital: Orbital) {
        super(true, 400, 200);
        
        const panel = document.getElementById("probability")!;
        const header = document.querySelector("#probability > .panel-header")! as HTMLElement;
        this.draggable(panel);
        this.createContent(panel);
        this.collapsible(header);
    }
    createContent(elem: HTMLElement) {
        let svg = elem.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'svg')[0];
        Util.createAxis(svg, this.contentHeight, this.contentWidth, 10, 'orange', 'darkgray', false);
    }

    setY(y: number) {
        this.y = y;
    }

    setZ(z: number) {
        this.z = z;
    }

    update() {
        console.log(this.y + '  ' + this.z)
    }

    moveDown(height: number, width: number) {
        const panel = document.getElementById("probability")!;
        const top = parseFloat(panel.style.top), left = parseFloat(panel.style.left);
        if(top < height + 40 && left < width) panel.style.top = (height + 40) + "px";
    }
}