import { AtomicOrbital } from "./src/atomic-orbital-viewer/atomic-orbital-viewer";

main();

function main() {
    render();
    drag(document.getElementsByClassName("box")[0]);
    collapsible(document.getElementsByClassName("box-header")[0]);
    drawAxis(document.getElementsByClassName("box-content")[0]);
}

function render() {
    const container = document.querySelector('#scene-container');
    const atomicOrbital = new AtomicOrbital(container);
    atomicOrbital.start();
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

function collapsible(elem) {
    let panel = elem.nextElementSibling;
    elem.firstElementChild.addEventListener("click", function () {
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}

function drawAxis(elem) {
    let svg = elem.firstElementChild, height = svg.clientHeight - 10, width = svg.clientWidth - 10;
    createLine(svg, width / 2, '10', width / 2, height, 'green', 'y');
    createLine(svg, width / 2, '10', width / 2 + 5, '15', 'green', 'y1');
    createLine(svg, width / 2, '10', width / 2 - 5, '15', 'green', 'y2');
    createLine(svg, '10', height / 2, width, height / 2, 'red', 'x');
    createLine(svg, width, height / 2, width - 5, height / 2 - 5, 'red', 'x1');
    createLine(svg, width, height / 2, width - 5, height / 2 + 5, 'red', 'x2');
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
