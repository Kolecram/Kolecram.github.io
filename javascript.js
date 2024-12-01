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

class Axis {
    static x = new Axis("x")
    static y = new Axis("y")
    static z = new Axis("z")

    constructor(name) {
        this.name = name
    }
}

class WidthAndHeight {
    width;
    height;

    constructor(width, height) {
        this.width = width;
        this.height = height;
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

// Create a rectangle that is perpendicular to one of the axes of the coordinate system
// widthAndHeight: width and height
// position: coordinates of vertex that has the lowest values for x, y and z
// perpendicularToAxes: specifies the axis to which the rectangle is perpendicular
// color: color of the rectangle
function createRectangle(widthAndHeight, position, perpendicularToAxis, color) {
    const pixelPoint = getPixelPoint(position);

    console.log("Position: " + position.toString() + " (" + color + ")");
    console.log("Pixel point: " + pixelPoint.toString() + " (" + color + ")");

    let objectElement = document.createElement("div");
    objectElement.setAttribute("class", "plane");
    objectElement.style.left = pixelPoint.x;
    objectElement.style.top = pixelPoint.y;
    objectElement.style.width = nrOfPixels(widthAndHeight.width);
    objectElement.style.height = nrOfPixels(widthAndHeight.height);
    objectElement.style.background = color;

    let transform = "translateZ(" + pixelPoint.z + "px)";
    if (perpendicularToAxis == Axis.x) {
        transform += " rotateZ(90deg)";
    } else if (perpendicularToAxis == Axis.y) {
    } else if (perpendicularToAxis == Axis.z) {
        transform += " rotateX(90deg)";
    }
    objectElement.style.transform = transform;
    objectElement.style.transformOrigin = "0 0 0";

    sceneElement.append(objectElement);

    return objectElement;
}

function createScene() {
    const cameraPosition = new Point3D(0, 400, 0);
    initScene(300, cameraPosition);

    backWall = createRectangle(new WidthAndHeight(150, 150), new Point3D(-75, 0, -75), Axis.y, "red");
    floor = createRectangle(new WidthAndHeight(150, 150), new Point3D(-75, 0, -75), Axis.z, "blue");
}

window.onload = (event) => {
    createScene();
};