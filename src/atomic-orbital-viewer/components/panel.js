import { getCoordinates } from "./orbitals";

let origin;
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
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elem.style.top = (elem.offsetTop - pos2) + "px";
        elem.style.left = (elem.offsetLeft - pos1) + "px";
    }

    function drag_mu() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function collapse(elem) {
    let panel = elem.nextElementSibling, firstChild = elem.firstElementChild;
    firstChild.addEventListener("click", function () {
        if (panel.style.maxHeight) {
            firstChild.setAttribute('data-before', '▸');
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
            firstChild.setAttribute('data-before', '▾');
        }
    });
}

function createContent(elem) {
    let content = elem.getElementsByClassName("panel-content")[0];
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    content.appendChild(svg);
    origin = createAxis(svg);
    updatePanel(0);
}

function createAxis(svg) {
    let height = svg.clientHeight - 10, width = svg.clientWidth - 10;
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

function getPoints(target) {
    let points, coordiantes = getCoordinates();
    for (var i = 0; i < coordiantes.length; i++) {
        for (var j = 0; j < coordiantes[i].length; j++) {
            points = coordiantes[i][j].points;
            if (coordiantes[i][j].z >= target)
                break;
        }
    }
    return points;
}

function updatePanel(target) {
    let svg = document.getElementsByTagName('svg')[0];
    let path = document.getElementById("path");
    if (path != null)
        svg.removeChild(path);
    let points = getPoints(target), pathD = "M", counter = 0;
    points.forEach(point => {
        counter++;
        let x = origin.x + (point[0] * origin.x / 4), y = origin.y - (point[1] * origin.y / 4);
        if (counter == points.length)
            pathD += x + "," + y + "Z";
        else
            pathD += x + "," + y + "L";
    });
    path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute("stroke", "yellow");
    path.setAttribute("fill", "transparent");
    path.setAttribute('d', pathD);
    path.setAttribute('id', "path");
    svg.appendChild(path);
}

function createPanel(title, draggable) {
    const container = document.querySelector('#scene-container');
    const panel = document.createElement("div");
    panel.setAttribute("class", "panel");
    container.insertBefore(panel, container.firstChild)
    const header = document.createElement("div");
    header.setAttribute("class", "panel-header");
    panel.appendChild(header);
    const text = document.createElement("span");
    text.textContent = title;
    header.appendChild(text);
    text.setAttribute('data-before', '▸');
    if (draggable) {
        const dragElem = document.createElement("div");
        dragElem.setAttribute("class", "draggable");
        header.appendChild(dragElem);
        drag(panel);
    }
    const content = document.createElement("div");
    content.setAttribute("class", "panel-content");
    panel.appendChild(content);
    createContent(panel);
    collapse(header);
    return panel;
}
export { createPanel, updatePanel }