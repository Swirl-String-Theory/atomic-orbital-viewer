export default class Util {
    static createAxis = (svg: SVGElement, height: number, width: number, padding: number, colorX: string, colorY: string, middle: boolean) => {
        let origin = middle ? {X: width / 2, Y: height / 2} : {X: padding, Y: height - padding};
        this.createLine(svg, origin.X, padding, origin.X, height - padding, colorY, 'y');
        this.createLine(svg, origin.X, padding, origin.X + 5, padding + 5, colorY, 'y1');
        this.createLine(svg, origin.X, padding, origin.X - 5, padding + 5, colorY, 'y2');
        this.createLine(svg, padding, origin.Y, width - padding, origin.Y, colorX, 'x');
        this.createLine(svg, width - padding, origin.Y, width - padding - 5, origin.Y - 5, colorX, 'x1');
        this.createLine(svg, width - padding, origin.Y, width - padding - 5, origin.Y + 5, colorX, 'x2');
    }

    static createLine = (container: SVGElement, x1: number, y1: number, x2: number, y2: number, color: string, id: string, width?: number) => {
        let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('id', id);
        line.setAttribute('x1', x1.toString());
        line.setAttribute('y1', y1.toString());
        line.setAttribute('x2', x2.toString());
        line.setAttribute('y2', y2.toString());
        line.setAttribute('stroke', color);
        if(width) line.setAttribute('stroke-width', width.toString());
        container.appendChild(line);
        return line;
    }

    static moveLine = (line: SVGLineElement, x1: number, y1: number, x2: number, y2: number) => {
        line.setAttribute('x1', x1.toString());
        line.setAttribute('y1', y1.toString());
        line.setAttribute('x2', x2.toString());
        line.setAttribute('y2', y2.toString());
    }

    static createPath = (pathD: string, color: string, className: string) => {
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.classList.add(className);
        path.setAttribute("stroke", color);
        path.setAttribute("fill", "transparent");
        path.setAttribute('d', pathD);
        return path;
    }
}