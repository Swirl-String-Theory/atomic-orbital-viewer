import { orbitals } from "../data/orbital-data";
import { getRegions } from "./orbitals";

let origin, contentWidth = 200, contentHeight = 200;

function createIntersection(title, intersector, regions) {
    const panel = document.getElementById("panel");
    const header = document.querySelector("#panel > .panel-header");
    drag(panel);
    createContent(panel, intersector, regions);
    collapse(header);
    return panel;
}

function drag(elem) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, moveElem = document.getElementsByClassName(elem.className + "-move")[0];
    if (moveElem) moveElem.onmousedown = drag_md;
    else elem.onmousedown = drag_md;

    function drag_md(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = drag_mu;
        document.onmousemove = drag_mm;
    }

    function drag_mm(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elem.style.top = (parseFloat(elem.style.top) - pos2) + "px";
        elem.style.left = (parseFloat(elem.style.left) - pos1) + "px";
    }

    function drag_mu() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function collapse(elem) {
    let panelContent = elem.nextElementSibling, firstChild = elem.firstElementChild;
    panelContent.style.height = panelContent.style.width = contentHeight + "px";
    firstChild.addEventListener("click", function () {
        if (panelContent.style.height === contentHeight + "px") {
            firstChild.setAttribute('data-before', '▸');
            panelContent.style.height = "0px";
        } else {
            panelContent.style.height = contentHeight + "px";
            firstChild.setAttribute('data-before', '▾');
        }
    });
}

function createContent(elem, intersector, regions) {
    let content = elem.getElementsByClassName("panel-content")[0];
    let svg = content.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'svg')[0];
    content.appendChild(svg);
    origin = createAxis(svg);
    updateIntersection(intersector, regions);
}

function createAxis(svg) {
    let height = contentHeight - 10, width = contentWidth - 10;
    createLine(svg, width / 2, '5', width / 2, height, 'green', 'y');
    createLine(svg, width / 2, '5', width / 2 + 5, '10', 'green', 'y1');
    createLine(svg, width / 2, '5', width / 2 - 5, '10', 'green', 'y2');
    createLine(svg, '5', height / 2, width, height / 2, 'red', 'x');
    createLine(svg, width, height / 2, width - 5, height / 2 - 5, 'red', 'x1');
    createLine(svg, width, height / 2, width - 5, height / 2 + 5, 'red', 'x2');
    let origin = { x: width / 2, y: height / 2 };
    return origin;
}

function createLine(container, x1, y1, x2, y2, color, id) {
    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('id', id);
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute("stroke", color);
    container.appendChild(line);
}

function updateIntersection(intersector, regions) {
    let points = [];
    let svg = document.getElementsByTagName('svg')[0];
    let paths = [...document.getElementsByTagName("path")];   
    paths.forEach(path=> svg.removeChild(path));
    regions.forEach(region => {
        let coordinates = region.coordinates;
        points = [];
        if (region.isConvex) {
            for (var i = 0; i < coordinates.length; i++) {
                points = coordinates[i].points;
                if (coordinates[i].z >= intersector)
                    break;
            }
            createCrossSection(points, svg, "#e91010");  
        }
        else {
            let n = 100;
            if (intersector === coordinates.minZ) {
                for (var j = 0; j <= n; j++) {
                    points.push([coordinates.arr1[coordinates.indexMinZ][0] * Math.cos(j * 2 * Math.PI / n), coordinates.arr1[coordinates.indexMinZ][0] * Math.sin(j * 2 * Math.PI / n)]);
                }
            }
            else if (intersector === coordinates.maxZ) {
                for (var j = 0; j <= n; j++) {
                    points.push([coordinates.arr1[coordinates.indexMaxZ][0] * Math.cos(j * 2 * Math.PI / n), coordinates.arr1[coordinates.indexMaxZ][0] * Math.sin(j * 2 * Math.PI / n)]);
                }
            }
            else if(intersector > coordinates.minZ && intersector < coordinates.maxZ){
                let index = coordinates.arr1.findIndex(m => m[1] >= intersector);
                for (var j = 0; j <= n; j++) {
                    points.push([coordinates.arr1[index][0] * Math.cos(j * 2 * Math.PI / n), coordinates.arr1[index][0] * Math.sin(j * 2 * Math.PI / n)]);
                }
                createCrossSection(points, svg, "#05bbbb");
                
                points = [];
                index = coordinates.arr2.findIndex(m => m[1] >= intersector);
                for (var j = 0; j <= n; j++) {
                    points.push([coordinates.arr2[index][0] * Math.cos(j * 2 * Math.PI / n), coordinates.arr2[index][0] * Math.sin(j * 2 * Math.PI / n)]);
                }
            }
            createCrossSection(points, svg, "#05bbbb");  
        }         
    });
}

function createCrossSection(points, svg, color) {
    let pathD = "M", counter = 0;
    points.forEach(point => {
        counter++;
        let x = origin.x + (point[0] * origin.x / 4), y = origin.y - (point[1] * origin.y / 4);
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

export { createIntersection, updateIntersection }