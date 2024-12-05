const svgNamespace = "http://www.w3.org/2000/svg";

const pressureAngle = 20; // in degrees

function getInvoluteCoordinates(radius, angle, angle2, inverse) {
    if (inverse) {
        const x = radius * (Math.cos(angle - angle2) + angle * Math.sin(angle - angle2));
        const y = radius * (Math.sin(angle - angle2) - angle * Math.cos(angle - angle2));
        return [x, -y];
    } else {
        const x = radius * (Math.cos(angle + angle2) + angle * Math.sin(angle + angle2));
        const y = radius * (Math.sin(angle + angle2) - angle * Math.cos(angle + angle2));
        return [x, y];
    }
}

function getInvoluteIntersectAngle(baseRadius, otherRadius) {
    let minAngle = 0
    let maxAngle = Math.PI / 2;
    let angle;
    let x, y;
    ready = false;
    while (!ready) {
        angle = (minAngle + maxAngle) / 2;
        [x, y] = getInvoluteCoordinates(baseRadius, angle, 0, false);
        // Calculate distance from point on involute to the circle with radius otherRadius
        const distance = otherRadius - Math.sqrt(x ** 2 + y ** 2);
        const maxDistance = otherRadius * 0.0001;
        if (distance > 0 && distance > maxDistance) {
            minAngle = angle;
        } else if (distance < 0 && -distance > maxDistance) {
            maxAngle = angle;
        } else {
            ready = true;
        }
    }
    console.log("x, y: " + [x, y].join(", "));
    return [angle, Math.atan(y / x)];
}

function rotate([x, y], angle) {
    return [Math.cos(angle) * x - Math.sin(angle) * y, Math.sin(angle) * x + Math.cos(angle) * y];
}

function createGear(nrOfTeeth, module, centerX, centerY, rotationAngle) {
    const pitchDiameter = nrOfTeeth * module;
    const pitchRadius = pitchDiameter / 2;

    let svgElement = document.createElementNS(svgNamespace, "svg");
    svgElement.setAttribute("width", pitchRadius * 2);
    svgElement.setAttribute("height", pitchRadius * 2);
    svgElement.setAttribute("x", centerX - pitchRadius);
    svgElement.setAttribute("y", centerY - pitchRadius);
    svgElement.setAttribute("viewBox", [-pitchRadius, -pitchRadius, pitchDiameter, pitchDiameter].join(" "));
    svgElement.style.overflow = "visible";

    const baseRadius = pitchRadius * Math.cos(pressureAngle * Math.PI / 180);
    const tipRadius = pitchRadius + module;
    const rootRadius = pitchRadius - 1.25 * module;

    const [tipIntersectAngle1, tipIntersectAngle2] = getInvoluteIntersectAngle(baseRadius, tipRadius);
    const [refIntersectAngle1, refIntersectAngle2] = getInvoluteIntersectAngle(baseRadius, pitchRadius);

    const anglePerTooth = 2 * Math.PI / nrOfTeeth;
    const tipArcAngle = anglePerTooth / 2 - 2 * (tipIntersectAngle2 - refIntersectAngle2);
    const rootArcAngle = anglePerTooth / 2 - 2 * refIntersectAngle2;

    let angle = -Math.PI / 2;
    let pathElement = document.createElementNS(svgNamespace, "path");
    let path = "M 0 " + -rootRadius;

    for (i = 0; i < nrOfTeeth; i++) {
        angle += rootArcAngle / 2;
        path += " A " + rootRadius + " " + rootRadius + " 0 0 1 " + rootRadius * Math.cos(angle) + " " + rootRadius * Math.sin(angle) + " ";

        const nrOfSteps = 10;
        const stepAngle = tipIntersectAngle1 / nrOfSteps;
        for (let step = 0; step <= nrOfSteps; step++) {
            [x, y] = getInvoluteCoordinates(baseRadius, step * stepAngle, angle, false);
            path += " L " + x + " " + y;
        }
        angle += tipIntersectAngle2;
        angle += tipArcAngle;
        path += " A " + tipRadius + " " + tipRadius + " 0 0 1 " + tipRadius * Math.cos(angle) + " " + tipRadius * Math.sin(angle);
        angle += tipIntersectAngle2;
        for (let step = nrOfSteps; step >= 0; step--) {
            let [x, y] = getInvoluteCoordinates(baseRadius, step * stepAngle, angle, true);
            path += " L " + x + " " + y;
        }
        path += " L " + rootRadius * Math.cos(angle) + " " + rootRadius * Math.sin(angle);
        angle += rootArcAngle / 2;
        path += " A " + rootRadius + " " + rootRadius + " 0 0 1 " + rootRadius * Math.cos(angle) + " " + rootRadius * Math.sin(angle) + " ";
    }
    pathElement.setAttribute("d", path);
    pathElement.style.transform = "rotate(" + rotationAngle + "deg)";
    svgElement.appendChild(pathElement);

    let refCircle = document.createElementNS(svgNamespace, "circle");
    refCircle.setAttribute("class", "refCircle");
    refCircle.setAttribute("r", pitchRadius);
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

    return svgElement;
}

function createRotatingGear(nrOfTeeth, module, centerX, centerY, initialAngle, rpm) {
    const groupElement = document.createElementNS(svgNamespace, "g");
    groupElement.setAttribute("transform-origin", centerX + " " + centerY);

    const gearElement = createGear(nrOfTeeth, module, centerX, centerY, initialAngle);
    groupElement.appendChild(gearElement);

    const animationElement = document.createElementNS(svgNamespace, "animateTransform");
    animationElement.setAttribute("attributeName", "transform");
    animationElement.setAttribute("type", "rotate");
    animationElement.setAttribute("begin", "0");
    animationElement.setAttribute("from", "0");
    animationElement.setAttribute("to", rpm * 360);
    animationElement.setAttribute("dur", "60s");
    animationElement.setAttribute("repeatCount", "indefinite");
    // groupElement.appendChild(animationElement);

    return groupElement;
}

window.onload = (event) => {
    let svgElement = document.querySelector("svg");

    const nrOfTeethGear1 = 22;
    const module = 10;

    const rpm1 = 1;
    const pitchRadiusGear1 = module * nrOfTeethGear1 / 2;

    let gear1Element = createRotatingGear(nrOfTeethGear1, module, -pitchRadiusGear1, 0, 0, rpm1);
    svgElement.appendChild(gear1Element);

    const nrOfTeethGear2 = 44;
    const rpm2 = -nrOfTeethGear1 / nrOfTeethGear2 * rpm1;
    const pitchRadiusGear2 = module * nrOfTeethGear2 / 2;

    let gear2Element = createRotatingGear(nrOfTeethGear2, module, pitchRadiusGear2, 0, 360 / nrOfTeethGear2 / 2, rpm2);
    svgElement.appendChild(gear2Element);
}