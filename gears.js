const svgNamespace = "http://www.w3.org/2000/svg";

const pressureAngle = 20;
let svgElement;

function getInvoluteCoordinates(radius, angle) {
    const x = radius * (Math.cos(angle) + angle * Math.sin(angle));
    const y = radius * (Math.sin(angle) - angle * Math.cos(angle));
    return [x, y];
}

function getInvoluteIntersectAngle(baseRadius, otherRadius) {
    let minAngle = 0
    let maxAngle = Math.PI / 2;
    let angle;
    let x, y;
    ready = false;
    while (!ready) {
        angle = (minAngle + maxAngle) / 2;
        [x, y] = getInvoluteCoordinates(baseRadius, angle);
        // Calculate distance from point on involute to the circle with radius otherRadius
        const distance = otherRadius - Math.sqrt(x ** 2 + y ** 2);
        const maxDistance = otherRadius * 0.01;
        if (distance > 0 && distance > maxDistance) {
            minAngle = angle;
        } else if (distance < 0 && -distance > maxDistance) {
            maxAngle = angle;
        } else {
            ready = true;
        }
    }
    console.log("x, y: " + [x, y].join(", "));
    return [angle, Math.atan(y/x)];
}

function rotate([x, y], angle) {
    return [Math.cos(angle) * x - Math.sin(angle) * y, Math.sin(angle) * x + Math.cos(angle) * y];
}

function createGear() {
    svgElement = document.querySelector("svg");

    const referenceRadius = 80;
    const nrOfTeeth = 22;

    const module = referenceRadius * 2 / nrOfTeeth;
    const baseRadius = referenceRadius * Math.cos(pressureAngle * Math.PI / 180);
    const tipRadius = referenceRadius + module;
    const rootRadius = referenceRadius - 1.25 * module;

    const [tipIntersectAngle1, tipIntersectAngle2] = getInvoluteIntersectAngle(baseRadius, tipRadius);
    const [refIntersectAngle1, refIntersectAngle2] = getInvoluteIntersectAngle(baseRadius, referenceRadius);

    let pathElement = document.createElementNS(svgNamespace, "path");
    let path = "M " + baseRadius + " 0";
    let angle = 0;
    for (i = 0; i < nrOfTeeth; i++) {
        const nrOfSteps = 10;
        const stepAngle = tipIntersectAngle1 / nrOfSteps;
        for (let step = 1; step <= nrOfSteps; step++) {
            [x, y] = getInvoluteCoordinates(baseRadius, step * stepAngle);
            [x, y] = rotate([x, y], angle);
            const radius = Math.sqrt(x ** 2 + y ** 2);
            path += " L " + x + " " + y;
        }
        angle += tipIntersectAngle2;
        const tipArcAngle = Math.PI / nrOfTeeth - 2 * tipIntersectAngle2;
        console.log("tipArcAngle: " + tipArcAngle);
        angle += tipArcAngle;
        path += " A " + tipRadius + " " + tipRadius + " 0 0 1 " + tipRadius * Math.cos(angle) + " " + tipRadius * Math.sin(angle);
        angle += tipIntersectAngle2;
        for (let step = nrOfSteps; step >= 0; step--) {
            let [x, y] = getInvoluteCoordinates(baseRadius, stepAngle * step);
            y = -y;
            [x, y] = rotate([x, y], angle);
            const radius = Math.sqrt(x ** 2 + y ** 2);
            path += " L " + x + " " + y;
        }
        const baseArcAngle = Math.PI / nrOfTeeth;
        console.log("baseArcAngle: " + baseArcAngle);
        angle += baseArcAngle;
        path += " A " + baseRadius + " " + baseRadius + " 0 0 1 " + baseRadius * Math.cos(angle) + " " + baseRadius * Math.sin(angle) + " ";
    }
    pathElement.setAttribute("d", path);
    svgElement.appendChild(pathElement);

    let refCircle = document.createElementNS(svgNamespace, "circle");
    refCircle.setAttribute("class", "refCircle");
    refCircle.setAttribute("r", referenceRadius);
    svgElement.appendChild(refCircle);

    let baseCircle = document.createElementNS(svgNamespace, "circle");
    baseCircle.setAttribute("class", "baseCircle");
    baseCircle.setAttribute("r", baseRadius);
    svgElement.appendChild(baseCircle);

    let tipCircle = document.createElementNS(svgNamespace, "circle");
    tipCircle.setAttribute("class", "tipCircle");
    tipCircle.setAttribute("r", tipRadius);
    svgElement.appendChild(tipCircle);

    let rootCircle = document.createElementNS(svgNamespace, "circle");
    rootCircle.setAttribute("class", "rootCircle");
    rootCircle.setAttribute("r", rootRadius);
    svgElement.appendChild(rootCircle);
}

window.onload = (event) => {
    createGear();
};