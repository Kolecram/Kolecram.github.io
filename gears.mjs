const svgNamespace = "http://www.w3.org/2000/svg";

const pressureAngle = 20; // in degrees

const innerGearThicknessPercentage = 7;

class PathBuilder {
    #pathCommands = [];

    #addCommand(letter, parameters) {
        this.#pathCommands.push(letter + " " + parameters.join(" "));
    }

    #formatCoordinates(x, y) {
        return x + "," + y;
    }
    
    addMoveCommand(position) {
        this.#addCommand("M", [this.#formatCoordinates(position[0], position[1])]);
    }

    addLineCommand(position) {
        this.#addCommand("L", [this.#formatCoordinates(position[0], position[1])]);
    }

    addArcCommand(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, position) {
        this.#addCommand("A", [rx, ry, xAxisRotation, largeArcFlag, sweepFlag, this.#formatCoordinates(position[0], position[1])]);
    }

    build() {
        return this.#pathCommands.join(" ");
    }
}

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

function drawGear(nrOfTeeth, module, centerX, centerY, startAngle, startWithSpace, color, innerGear) {
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

    const pathBuilder = new PathBuilder();
    pathBuilder.addMoveCommand(rotate([rootRadius, 0], angle));
    for (let i = 0; i < nrOfTeeth; i++) {
        angle += rootArcAngle / 2;
        pathBuilder.addArcCommand(rootRadius, rootRadius, 0, 0, 1, rotate([rootRadius, 0], angle));

        involuteAngle = involuteAngleOffset1;
        for (let point = 0; point <= nrOfInvolutePoints; point++) {
            const coordinates = getInvoluteCoordinates(baseRadius, involuteAngle, angle - involuteAngleOffset2, false);
            pathBuilder.addLineCommand(coordinates);
            involuteAngle += involuteAngleDelta;
        }
        angle += tipIntersectAngle2 - involuteAngleOffset2;
        angle += tipArcAngle;
        pathBuilder.addArcCommand(tipRadius, tipRadius, 0, 0, 1, [tipRadius * Math.cos(angle), tipRadius * Math.sin(angle)]);

        angle += tipIntersectAngle2 - involuteAngleOffset2;
        involuteAngle = tipIntersectAngle1;
        for (let point = 0; point <= nrOfInvolutePoints; point++) {
            const coordinates = getInvoluteCoordinates(baseRadius, involuteAngle, angle + involuteAngleOffset2, true);
            pathBuilder.addLineCommand(coordinates);
            involuteAngle -= involuteAngleDelta;
        }
        pathBuilder.addLineCommand([rootRadius * Math.cos(angle), rootRadius * Math.sin(angle)]);
        angle += rootArcAngle / 2;
        pathBuilder.addArcCommand(rootRadius, rootRadius, 0, 0, 1, rotate([rootRadius, 0], angle));
    }
    if (innerGear) {
        const outerRadius = pitchRadius * (1 + innerGearThicknessPercentage / 100);
        pathBuilder.addMoveCommand([outerRadius, 0]);
        pathBuilder.addArcCommand(outerRadius, outerRadius, 0, 0, 1, [-outerRadius, 0]);
        pathBuilder.addArcCommand(outerRadius, outerRadius, 0, 0, 1, [outerRadius, 0]);
    }
    pathElement.setAttribute("d", pathBuilder.build());
    pathElement.setAttribute("style", "fill: " + color + "; fill-rule: evenodd");
    svgElement.appendChild(pathElement);

    return svgElement;
}

function createInnerGear(nrOfTeeth, module, centerX, centerY, startAngle, startWithSpace, color) {
    return drawGear(nrOfTeeth, module, centerX, centerY, startAngle, startWithSpace, color, true);
}

function createGear(nrOfTeeth, module, centerX, centerY, startAngle, startWithSpace, color) {
    return drawGear(nrOfTeeth, module, centerX, centerY, startAngle, startWithSpace, color, false);
}

export {createGear, createInnerGear, innerGearThicknessPercentage};