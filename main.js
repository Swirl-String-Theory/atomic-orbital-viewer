import { AtomicOrbital } from "./src/atomic-orbital-viewer/atomic-orbital-viewer";

function main() {
    render();
        dragElement(document.getElementsByClassName("box")[0]);
    accordionEllment(document.getElementsByClassName("box-header")[0])
}

function render() {
    const container = document.querySelector('#scene-container');
    const atomicOrbital = new AtomicOrbital(container);
    atomicOrbital.start();
}

function dragElement(elem) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, moveElem= document.getElementsByClassName(elem.className + "-move")[0];
    if (moveElem) moveElem.onmousedown = dragMouseDown;
    else elem.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elem.style.top = (elem.offsetTop - pos2) + "px";
        elem.style.left = (elem.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function accordionEllment(elem) {
    var panel = elem.nextElementSibling;
    elem.firstElementChild.addEventListener("click", function () {
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}
main();