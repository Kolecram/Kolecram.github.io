import {createGear, createRotatingGear} from "./gears.mjs";

window.onload = (event) => {
    let svgElement = document.querySelector("svg");

    const nrOfTeethGear1 = 22;
    const module = 5;

    const rpm1 = 1;
    const pitchRadiusGear1 = module * nrOfTeethGear1 / 2;

    let gear1Element = createRotatingGear(nrOfTeethGear1, module, -pitchRadiusGear1, 0, 0, false, rpm1, "grey");
    svgElement.appendChild(gear1Element);

    const nrOfTeethGear2 = 100;
    const rpm2 = -nrOfTeethGear1 / nrOfTeethGear2 * rpm1;
    const pitchRadiusGear2 = module * nrOfTeethGear2 / 2;

    let gear2Element = createRotatingGear(nrOfTeethGear2, module, pitchRadiusGear2, 0, Math.PI, true, rpm2, "grey");
    svgElement.appendChild(gear2Element);
}