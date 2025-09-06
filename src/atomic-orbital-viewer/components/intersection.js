class Intersection {

    constructor(regions) {
        this.regions = regions;
        this.collapsed = false; this.origin = null, this.mouseMove = false, this.contentSize = 300;
    }

    create(z) {
        this.z = z;
        const panel = document.getElementById("panel");
        const header = document.querySelector("#panel > .panel-header");
        this.draggable(panel);
        this.createContent(panel);
        this.collapsible(header);
    }

    draggable(elem) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, moveElem = document.getElementsByClassName(elem.className + "-move")[0];

        const drag_md = e => {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = drag_mu;
            document.onmousemove = drag_mm;
        }

        const drag_mm = e => {
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

    collapsible(elem) {
        let panelContent = elem.nextElementSibling, firstChild = elem.firstElementChild;
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

    createContent(elem) {
        let content = elem.getElementsByClassName("panel-content")[0];
        let svg = content.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'svg')[0];
        content.appendChild(svg);
        this.createAxis(svg);
        this.update(this.z);
    }

    createAxis(svg) {
        let height = this.contentSize - 10, width = this.contentSize - 10;
        this.createLine(svg, width / 2, '5', width / 2, height, 'green', 'y');
        this.createLine(svg, width / 2, '5', width / 2 + 5, '10', 'green', 'y1');
        this.createLine(svg, width / 2, '5', width / 2 - 5, '10', 'green', 'y2');
        this.createLine(svg, '5', height / 2, width, height / 2, 'red', 'x');
        this.createLine(svg, width, height / 2, width - 5, height / 2 - 5, 'red', 'x1');
        this.createLine(svg, width, height / 2, width - 5, height / 2 + 5, 'red', 'x2');
        this.origin = { x: width / 2, y: height / 2 };
    }

    createLine(container, x1, y1, x2, y2, color, id) {
        let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('id', id);
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute("stroke", color);
        container.appendChild(line);
    }

    update(z) {
        this.z = z;
        let points = [];
        let svg = document.getElementsByTagName('svg')[0];
        let paths = [...document.getElementsByTagName("path")];   
        paths.forEach(path=> svg.removeChild(path));
        this.regions.forEach(region => {
            let coordinates = region.coordinates;
            points = [];
            if (region.isConvex) {
                for (var i = 0; i < coordinates.length; i++) {
                    points = coordinates[i].points;
                    if (coordinates[i].z >= z)
                        break;
                }
                this.createCrossSection(points, svg, "#e91010");  
            }
            else {
                let n = 100;
                if (z === coordinates.minZ) {
                    for (var j = 0; j <= n; j++) {
                        points.push([coordinates.arr1[coordinates.indexMinZ][0] * Math.cos(j * 2 * Math.PI / n), coordinates.arr1[coordinates.indexMinZ][0] * Math.sin(j * 2 * Math.PI / n)]);
                    }
                }
                else if (z === coordinates.maxZ) {
                    for (var j = 0; j <= n; j++) {
                        points.push([coordinates.arr1[coordinates.indexMaxZ][0] * Math.cos(j * 2 * Math.PI / n), coordinates.arr1[coordinates.indexMaxZ][0] * Math.sin(j * 2 * Math.PI / n)]);
                    }
                }
                else if(z > coordinates.minZ && z < coordinates.maxZ){
                    let index = coordinates.arr1.findIndex(m => m[1] >= z);
                    for (var j = 0; j <= n; j++) {
                        points.push([coordinates.arr1[index][0] * Math.cos(j * 2 * Math.PI / n), coordinates.arr1[index][0] * Math.sin(j * 2 * Math.PI / n)]);
                    }
                    this.createCrossSection(points, svg, "#05bbbb");
                    
                    points = [];
                    index = coordinates.arr2.findIndex(m => m[1] >= z);
                    for (var j = 0; j <= n; j++) {
                        points.push([coordinates.arr2[index][0] * Math.cos(j * 2 * Math.PI / n), coordinates.arr2[index][0] * Math.sin(j * 2 * Math.PI / n)]);
                    }
                }
                this.createCrossSection(points, svg, "#05bbbb");  
            }         
        });
    }

    createCrossSection(points, svg, color) {
        let pathD = "M", counter = 0;
        points.forEach(point => {
            counter++;
            let x = this.origin.x + (point[0] * this.origin.x / 4), y = this.origin.y - (point[1] * this.origin.y / 4);
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
}

export default Intersection