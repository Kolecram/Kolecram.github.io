import {createGear, createInnerGear} from "./gears.mjs";

const svgNamespace = "http://www.w3.org/2000/svg";

function createRotatingGear(gearElement, centerX, centerY, rpm) {
    const groupElement = document.createElementNS(svgNamespace, "g");
    groupElement.setAttribute("transform-origin", centerX + " " + centerY);

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

function drawTwoOuterGears() {
    let svgElement = document.querySelector("#twoOuterGears");

    const nrOfTeethGear1 = 22;
    const module = 5;

    const rpm1 = 1;
    const pitchRadiusGear1 = module * nrOfTeethGear1 / 2;

    const x1 = -pitchRadiusGear1;
    const y1 = 0;
    const gear1 = createGear(nrOfTeethGear1, module, x1, y1, 0, false, "grey");

    let gear1Element = createRotatingGear(gear1, x1, y1, rpm1);
    svgElement.appendChild(gear1Element);

    const nrOfTeethGear2 = 100;
    const rpm2 = -nrOfTeethGear1 / nrOfTeethGear2 * rpm1;
    const pitchRadiusGear2 = module * nrOfTeethGear2 / 2;
    const x2 = pitchRadiusGear2;
    const y2 = 0;

    const gear2 = createGear(nrOfTeethGear2, module, x2, y2, Math.PI, true, "grey");
    let gear2Element = createRotatingGear(gear2, x2, y2, rpm2);
    svgElement.appendChild(gear2Element);

}

function drawInnerAndOuterGear() {
    let svgElement = document.querySelector("#innerAndOuterGear");

    const nrOfTeethGear1 = 22;
    const module = 5;

    const rpm1 = 1;
    const pitchRadiusGear1 = module * nrOfTeethGear1 / 2;

    const x1 = pitchRadiusGear1;
    const y1 = 0;
    const gear1 = createGear(nrOfTeethGear1, module, x1, y1, 0, false, "grey");

    let gear1Element = createRotatingGear(gear1, x1, y1, rpm1);
    svgElement.appendChild(gear1Element);

    const nrOfTeethGear2 = 100;
    const rpm2 = nrOfTeethGear1 / nrOfTeethGear2 * rpm1;
    const pitchRadiusGear2 = module * nrOfTeethGear2 / 2;
    const x2 = pitchRadiusGear2;
    const y2 = 0;

    const gear2 = createInnerGear(nrOfTeethGear2, module, x2, y2, Math.PI, false, "grey");
    let gear2Element = createRotatingGear(gear2, x2, y2, rpm2);
    svgElement.appendChild(gear2Element);
}

window.onload = (event) => {
    drawTwoOuterGears();
    drawInnerAndOuterGear();
}