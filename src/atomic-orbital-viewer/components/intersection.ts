import * as THREE from 'three';
import { OrbitalRegion } from '../types';

class Intersection {
    regions: OrbitalRegion[];
    collapsed: boolean;
    origin: { x: number; y: number } | null;
    mouseMove: boolean;
    contentSize: number;
    plane: THREE.Mesh | null;

    constructor(regions: OrbitalRegion[]) {
        this.regions = regions;
        this.collapsed = true; this.origin = null, this.mouseMove = false, this.contentSize = 300, this.plane = null;
    }

    create(z: number) {
        const panel = document.getElementById("panel")!;
        const header = document.querySelector("#panel > .panel-header")! as HTMLElement;
        this.createPlane();
        this.draggable(panel);
        this.createContent(panel);
        this.collapsible(header);
        this.update(z);
    }

    draggable(elem: HTMLElement) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, 
        moveElem = document.getElementsByClassName(elem.className + "-move")[0] as HTMLElement;

        const drag_md = (e: MouseEvent) => {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = drag_mu;
            document.onmousemove = drag_mm;
        }

        const drag_mm = (e: MouseEvent) => {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elem.style.top = (parseFloat(elem.style.top) - pos2) + "px";
            elem.style.left = (parseFloat(elem.style.left) - pos1) + "px";
            this.mouseMove = true;
        }

        const drag_mu = () => {
            document.onmouseup = null;
            document.onmousemove = null;
        }
        
        if (moveElem) moveElem.onmousedown = drag_md;
        else elem.onmousedown = drag_md;
    }

    collapsible(elem: HTMLElement) {
        let panelContent = elem.nextElementSibling as HTMLElement;
        let firstChild = elem.firstElementChild as HTMLElement;
        panelContent.style.width = this.contentSize + "px";
        panelContent.style.height = this.collapsed ? "0px" : this.contentSize + "px";
        firstChild.addEventListener("click", () => {
            if (this.mouseMove) {
                this.mouseMove = false;
                return;
            }
            if (!this.collapsed) {
                firstChild.setAttribute('data-before', '▸');
                panelContent.style.height = "0px";
            } else {
                panelContent.style.height = this.contentSize + "px";
                firstChild.setAttribute('data-before', '▾');
            }
            this.collapsed = !this.collapsed;
        });
    }

    createContent(elem: HTMLElement) {
        let content = elem.getElementsByClassName("panel-content")[0] as HTMLElement;
        let svg = content.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'svg')[0];
        content.appendChild(svg);
        this.createAxis(svg);
    }

    createAxis(svg: SVGElement) {
        let height = this.contentSize - 10, width = this.contentSize - 10;
        this.createLine(svg, width / 2, 5, width / 2, height, 'green', 'y');
        this.createLine(svg, width / 2, 5, width / 2 + 5, 10, 'green', 'y1');
        this.createLine(svg, width / 2, 5, width / 2 - 5, 10, 'green', 'y2');
        this.createLine(svg, 5, height / 2, width, height / 2, 'red', 'x');
        this.createLine(svg, width, height / 2, width - 5, height / 2 - 5, 'red', 'x1');
        this.createLine(svg, width, height / 2, width - 5, height / 2 + 5, 'red', 'x2');
        this.origin = { x: width / 2, y: height / 2 };
    }

    createLine(container: SVGElement, x1: number, y1: number, x2: number, y2: number, color: string, id: string) {
        let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('id', id);
        line.setAttribute('x1', x1.toString());
        line.setAttribute('y1', y1.toString());
        line.setAttribute('x2', x2.toString());
        line.setAttribute('y2', y2.toString());
        line.setAttribute("stroke", color);
        container.appendChild(line);
    }

    update(z: number) {
        this.plane!.position.set(0, 0, z);
        let points: [number, number][] = [];
        let svg = document.getElementsByTagName('svg')[0];
        let paths = [...document.getElementsByTagName("path")];
        paths.forEach(path => svg.removeChild(path));
        this.regions.forEach(region => {
            points = [];
            if (region.isConvex) {
                let coordinates = region.coordinates!;
                for (var i = 0; i < coordinates.length; i++) {
                    points = coordinates[i].points;
                    if (coordinates[i].z >= z)
                        break;
                }
                this.createCrossSection(points, svg, region.color);  
            }
            else {
                let n = 100;
                let coordinates = region.xzCoordinates!;
                if (z === coordinates.minZ) {
                    for (var j = 0; j <= n; j++) {
                        points.push([coordinates.pointsSide1[coordinates.indexMinZ][0] * Math.cos(j * 2 * Math.PI / n), coordinates.pointsSide1[coordinates.indexMinZ][0] * Math.sin(j * 2 * Math.PI / n)]);
                    }
                }
                else if (z === coordinates.maxZ) {
                    for (var j = 0; j <= n; j++) {
                        points.push([coordinates.pointsSide2[coordinates.indexMaxZ][0] * Math.cos(j * 2 * Math.PI / n), coordinates.pointsSide2[coordinates.indexMaxZ][0] * Math.sin(j * 2 * Math.PI / n)]);
                    }
                }
                else if(z > coordinates.minZ && z < coordinates.maxZ){
                    let index = coordinates.pointsSide1.findIndex(m => m[1] >= z);
                    for (var j = 0; j <= n; j++) {
                        points.push([coordinates.pointsSide1[index][0] * Math.cos(j * 2 * Math.PI / n), coordinates.pointsSide1[index][0] * Math.sin(j * 2 * Math.PI / n)]);
                    }
                    this.createCrossSection(points, svg, region.color);
                    
                    points = [];
                    index = coordinates.pointsSide2.findIndex(m => m[1] >= z);
                    for (var j = 0; j <= n; j++) {
                        points.push([coordinates.pointsSide2[index][0] * Math.cos(j * 2 * Math.PI / n), coordinates.pointsSide2[index][0] * Math.sin(j * 2 * Math.PI / n)]);
                    }
                }
                this.createCrossSection(points, svg, region.color);  
            }         
        });
    }

    createCrossSection(points: [number, number][], svg: SVGSVGElement, color: string) {
        let pathD = "M", counter = 0;
        points.forEach(point => {
            counter++;
            let x = this.origin!.x + (point[0] * this.origin!.x / 4), y = this.origin!.y - (point[1] * this.origin!.y / 4);
            if (counter == points.length)
                pathD += x + "," + y + "Z";
            else
                pathD += x + "," + y + "L";
        });
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute("stroke", color);
        path.setAttribute("fill", "transparent");
        path.setAttribute('d', pathD);
        svg.appendChild(path);
    }

    createPlane() {
        let points: THREE.Vector2[] = [];
        const coordinates = [[5, 5], [-5, 5], [-5, -5], [5, -5]];
        function addPoints(point: number[]) {
            points.push(new THREE.Vector2(point[0], point[1]));
        }
    
        for (let i = 0; i < coordinates.length; i++) {
            addPoints(coordinates[i]);
        }
    
        const polygon = new THREE.Shape(points);
        const geometry = new THREE.ShapeGeometry(polygon);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, transparent: true, opacity: .2 });
        this.plane = new THREE.Mesh(geometry, material);
    }
}

export default Intersection