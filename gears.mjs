const svgNamespace = "http://www.w3.org/2000/svg";

const pressureAngle = 20; // in degrees

function getInvoluteCoordinates(radius, involuteAngle, offsetAngle, reversed) {
    if (reversed) {
        const x = radius * (Math.cos(involuteAngle - offsetAngle) + involuteAngle * Math.sin(involuteAngle - offsetAngle));
        const y = radius * (Math.sin(involuteAngle - offsetAngle) - involuteAngle * Math.cos(involuteAngle - offsetAngle));
        return [x, -y];
    } else {
        const x = radius * (Math.cos(involuteAngle + offsetAngle) + involuteAngle * Math.sin(involuteAngle + offsetAngle));
        const y = radius * (Math.sin(involuteAngle + offsetAngle) - involuteAngle * Math.cos(involuteAngle + offsetAngle));
        return [x, y];
    }
}

function getInvoluteIntersectAngle(baseRadius, otherRadius) {
    let minAngle = 0
    let maxAngle = Math.PI / 2;
    let angle;
    let x, y;
    let ready = false;
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
    return [angle, Math.atan(y / x)];
}

function rotate([x, y], angle) {
    return [Math.cos(angle) * x - Math.sin(angle) * y, Math.sin(angle) * x + Math.cos(angle) * y];
}

function createGear(nrOfTeeth, module, centerX, centerY, startAngle, startWithSpace) {
    const pitchDiameter = nrOfTeeth * module;
    const pitchRadius = pitchDiameter / 2;

    let svgElement = document.createElementNS(svgNamespace, "svg");
    svgElement.setAttribute("width", pitchRadius * 2);
    svgElement.setAttribute("height", pitchRadius * 2);
    svgElement.setAttribute("x", centerX - pitchRadius);
    svgElement.setAttribute("y", centerY - pitchRadius);
    svgElement.setAttribute("viewBox", [-pitchRadius, -pitchRadius, pitchDiameter, pitchDiameter].join(" "));
    svgElement.style.overflow = "visible";

    const anglePerToothHalf = Math.PI / nrOfTeeth;

    const baseRadius = pitchRadius * Math.cos(pressureAngle * Math.PI / 180);
    const tipRadius = pitchRadius + module;
    const rootRadius = pitchRadius - 1.25 * module;

    const [tipIntersectAngle1, tipIntersectAngle2] = getInvoluteIntersectAngle(baseRadius, tipRadius);
    const [refIntersectAngle1, refIntersectAngle2] = getInvoluteIntersectAngle(baseRadius, pitchRadius);

    let rootArcAngle;
    let involuteAngleOffset1, involuteAngleOffset2;

    if (rootRadius > baseRadius) {
        const [rootIntersectAngle1, rootIntersectAngle2] = getInvoluteIntersectAngle(baseRadius, rootRadius);
        rootArcAngle = anglePerToothHalf - 2 * (refIntersectAngle2 - rootIntersectAngle2);
        involuteAngleOffset1 = rootIntersectAngle1;
        involuteAngleOffset2 = rootIntersectAngle2;
    } else {
        rootArcAngle = anglePerToothHalf - 2 * refIntersectAngle2;
        involuteAngleOffset1 = 0;
        involuteAngleOffset2 = 0;
    }
    const tipArcAngle = anglePerToothHalf - 2 * (tipIntersectAngle2 - refIntersectAngle2);

    const nrOfInvolutePoints = 10;
    const involuteAngleDelta = (tipIntersectAngle1 - involuteAngleOffset1) / nrOfInvolutePoints;

    let angle = startAngle;
    if (startWithSpace) {
        angle += anglePerToothHalf;
    }

    let involuteAngle;
    let pathElement = document.createElementNS(svgNamespace, "path");
    let path = "M " + rotate([rootRadius, 0], angle).join(" ");
    for (let i = 0; i < nrOfTeeth; i++) {
        angle += rootArcAngle / 2;
        path += " A " + rootRadius + " " + rootRadius + " 0 0 1 " + rotate([rootRadius, 0], angle).join(" ");

        involuteAngle = involuteAngleOffset1;
        for (let point = 0; point <= nrOfInvolutePoints; point++) {
            let [x, y] = getInvoluteCoordinates(baseRadius, involuteAngle, angle - involuteAngleOffset2, false);
            path += " L " + x + " " + y;
            involuteAngle += involuteAngleDelta;
        }
        angle += tipIntersectAngle2 - involuteAngleOffset2;
        angle += tipArcAngle;
        path += " A " + tipRadius + " " + tipRadius + " 0 0 1 " + tipRadius * Math.cos(angle) + " " + tipRadius * Math.sin(angle);

        angle += tipIntersectAngle2 - involuteAngleOffset2;
        involuteAngle = tipIntersectAngle1;
        for (let point = 0; point <= nrOfInvolutePoints; point++) {
            let [x, y] = getInvoluteCoordinates(baseRadius, involuteAngle, angle + involuteAngleOffset2, true);
            path += " L " + x + " " + y;
            involuteAngle -= involuteAngleDelta;
        }
        path += " L " + rootRadius * Math.cos(angle) + " " + rootRadius * Math.sin(angle);
        angle += rootArcAngle / 2;
        path += " A " + rootRadius + " " + rootRadius + " 0 0 1 " + rotate([rootRadius, 0], angle).join(" ");
    }
    pathElement.setAttribute("d", path);
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

function createRotatingGear(nrOfTeeth, module, centerX, centerY, initialAngle, startWithSpace, rpm) {
    const groupElement = document.createElementNS(svgNamespace, "g");
    groupElement.setAttribute("transform-origin", centerX + " " + centerY);

    const gearElement = createGear(nrOfTeeth, module, centerX, centerY, initialAngle, startWithSpace);
    groupElement.appendChild(gearElement);

    const animationElement = document.createElementNS(svgNamespace, "animateTransform");
    animationElement.setAttribute("attributeName", "transform");
    animationElement.setAttribute("type", "rotate");
    animationElement.setAttribute("begin", "0");
    animationElement.setAttribute("from", "0");
    animationElement.setAttribute("to", rpm * 360);
    animationElement.setAttribute("dur", "60s");
    animationElement.setAttribute("repeatCount", "indefinite");
    groupElement.appendChild(animationElement);

    return groupElement;
}

export {createGear, createRotatingGear};