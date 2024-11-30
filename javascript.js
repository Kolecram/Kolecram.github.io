// Coordinate system of the scene:
// x-axis points to the right
// y-axis points towards the viewer
// z-axis points up
// All dimensions are expressed in centimeters

// Coordinate system of the div elements:
// x-axis points to the right
// y-axis points down
// z-axis points top the viewer

let sceneElement;
let sceneWidthInPixels;
let nrOfPixelsInCm;
let viewSquareWidth;

class Point3D {
    x;
    y;
    z;
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    toString() {
        return "(" + [this.x.toFixed(2), this.y.toFixed(2), this.z.toFixed(2)].join(", ") + ")";
    }
}

function initScene(sizeInPixels, cameraPosition) {
    console.log("Initializing scene with size " + sizeInPixels + " and camera position " + cameraPosition);
    sceneElement = document.createElement("div");
    sceneElement.id = "scene";
    sceneElement.style.width = sizeInPixels;
    sceneElement.style.height = sizeInPixels;
    document.body.appendChild(sceneElement);

    sceneWidthInPixels = sizeInPixels;

    const angleOfView = 1; // normal field of view in radians

    /* The axis of the camera is assumed to be parallel to the y-axis of the scene. 
       The view of the camera is a cone where "angleOfView" is the angle in the top of the cone. 
       We compute the radius of the biggest square that fits in this cone in the y=0 plane. 
       This square is called the view square. */

    /* The view square is a square with sides parallel to the x-axis and the z-axis.
       When we would draw a line through the middle of this square, parallel to the y-axis, it would
       go through the camera position. */

    const viewSquareRadius = Math.tan(angleOfView / 2) * cameraPosition.y;
    viewSquareWidth = (2 * viewSquareRadius) / Math.sqrt(2);

    /* We calculate the number of pixels that corresponds to the view square. */
    nrOfPixelsInCm = sceneWidthInPixels / viewSquareWidth;

    /* TODO: set perspective-origin */
    sceneElement.style.perspective = nrOfPixels(cameraPosition.y) + "px";

    llElement = document.createElement("div");
    llElement.innerHTML = "lower left: " + new Point3D(-viewSquareWidth, 0, -viewSquareWidth).toString();
    document.body.appendChild(llElement);
    urElement = document.createElement("div");
    urElement.innerHTML = "upper right: " + new Point3D(viewSquareWidth, 0, viewSquareWidth).toString();
    document.body.appendChild(urElement);
    cpElement = document.createElement("div");
    cpElement.innerHTML = "camera position: " + cameraPosition.toString();
    document.body.appendChild(cpElement);
}

function nrOfPixels(nrOfCentimeters) {
    return nrOfCentimeters * nrOfPixelsInCm;
}

function getPixelPoint(point) {
    const x = nrOfPixels(viewSquareWidth / 2 + point.x);
    const y = nrOfPixels(viewSquareWidth / 2 - point.z);
    const z = nrOfPixels(point.y);
    return new Point3D(x, y, z);
}

// Dimensions geven de breedte en lengte aan
// Position is de positie van het middelpunt
// Rotation geeft de rotatie om de x-as en om de y-as
function createPlane(dimensions, position, rotation, color) {
    const pixelPoint = getPixelPoint(position);

    let objectElement = document.createElement("div");
    objectElement.setAttribute("class", "plane");
    objectElement.setAttribute("width", dimensions[0]);
    objectElement.setAttribute("height", dimensions[1]);
    objectElement.setAttribute("x", pixelPoint.x + "px");
    objectElement.setAttribute("y", pixelPoint.y + "px");
    objectElement.style.background = color;

    let transform = "translateZ(" + pixelPoint.z + "px)";
    transform += " rotateX(" + rotation[0] + "deg)";
    transform += " rotateY(" + rotation[1] + "deg)";
    objectElement.style.transform = transform;

    sceneElement.append(objectElement);

    return objectElement;
}

function createScene() {
    const cameraPosition = new Point3D(0, 400, 0);
    initScene(300, cameraPosition);

    backWall = createPlane([150, 150], new Point3D(-75, 0, -75), [0, 0], "red");
    floor = createPlane([150, 150], new Point3D(0, 75, -75), [90, 0], "blue");
}

document.onload = screateScene;