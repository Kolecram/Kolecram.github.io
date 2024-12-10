// Coordinate system of the scene:
// x-axis points to the right
// y-axis points towards the viewer
// z-axis points up
// All dimensions are expressed in centimeters

// Coordinate system of the div elements:
// x-axis points to the right
// y-axis points down
// z-axis points top the viewer

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

class Scene {
    #sceneElement;
    #sceneWidthInPixels;
    #nrOfPixelsInCm;
    #viewSquareWidth;
    #camRotations = [0, 0, 0];
    #camTranslations = [0, 0, 0];

    constructor(sizeInPixels, cameraPosition) {
        this.#createCamControlDiv("rotateX", ["-135", "-90", "-45", "0", "45", "90", "135"], "0", (value) => { this.#camRotations[0] = value });
        this.#createCamControlDiv("rotateY", ["-90", "-45", "0", "45", "90"], "0", (value) => { this.#camRotations[1] = value });
        this.#createCamControlDiv("rotateZ", ["-90", "-45", "0", "45", "90"], "0", (value) => { this.#camRotations[2] = value });
        this.#createCamControlDiv("translateX", ["-100", "0", "100"], "0", (value) => { this.#camTranslations[0] = value });
        this.#createCamControlDiv("translateY", ["-100", "0", "100"], "0", (value) => { this.#camTranslations[1] = value });
        this.#createCamControlDiv("translateZ", ["-100", "0", "100"], "0", (value) => { this.#camTranslations[2] = value });

        const clippingBoxElement = document.createElement("div");
        clippingBoxElement.setAttribute("class", "clippingBox");
        clippingBoxElement.style.width = sizeInPixels;
        clippingBoxElement.style.height = sizeInPixels;
        document.body.appendChild(clippingBoxElement);

        this.#sceneElement = document.createElement("div");
        this.#sceneElement.className = "scene";
        this.#sceneElement.style.width = sizeInPixels;
        this.#sceneElement.style.height = sizeInPixels;
        clippingBoxElement.appendChild(this.#sceneElement);

        this.#sceneWidthInPixels = sizeInPixels;

        const angleOfView = 1; // normal field of view in radians

        /* The axis of the camera is assumed to be parallel to the y-axis of the scene. 
           The view of the camera is a cone where "angleOfView" is the angle in the top of the cone. 
           We compute the radius of the biggest square that fits in this cone in the y=0 plane. 
           This square is called the view square. */

        /* The view square is a square with sides parallel to the x-axis and the z-axis.
           When we would draw a line through the middle of this square, parallel to the y-axis, it would
           go through the camera position. */

        const viewSquareRadius = Math.tan(angleOfView / 2) * cameraPosition.y;
        this.#viewSquareWidth = (2 * viewSquareRadius) / Math.sqrt(2);

        /* We calculate the number of pixels that corresponds to the view square. */
        this.#nrOfPixelsInCm = this.#sceneWidthInPixels / this.#viewSquareWidth;

        const pixelPoint = this.#getPixelPoint(cameraPosition);
        clippingBoxElement.style.perspective = pixelPoint.z + "px";
        clippingBoxElement.style.perspectiveOrigin = pixelPoint.x + "px " + pixelPoint.y + "px";

        const llElement = document.createElement("div");
        llElement.innerHTML = "lower left: " + new Point3D(-this.#viewSquareWidth, 0, -this.#viewSquareWidth).toString();
        document.body.appendChild(llElement);
        const urElement = document.createElement("div");
        urElement.innerHTML = "upper right: " + new Point3D(this.#viewSquareWidth, 0, this.#viewSquareWidth).toString();
        document.body.appendChild(urElement);
        const cpElement = document.createElement("div");
        cpElement.innerHTML = "camera position: " + cameraPosition.toString();
        document.body.appendChild(cpElement);
    }

    #nrOfPixels(nrOfCentimeters) {
        return nrOfCentimeters * this.#nrOfPixelsInCm;
    }

    #getPixelPoint(point) {
        const x = this.#nrOfPixels(this.#viewSquareWidth / 2 + point.x);
        const y = this.#nrOfPixels(this.#viewSquareWidth / 2 - point.z);
        const z = this.#nrOfPixels(point.y);
        return new Point3D(x, y, z);
    }

    #createCamControlDiv(controlName, values, initialValue, selectionHandler) {
        const divElement = document.createElement("div");
        divElement.setAttribute("class", "controlDiv");
        divElement.innerHTML = controlName + ": ";
        document.body.appendChild(divElement);
    
        for (let value of values) {
            const inputElement = document.createElement("input");
            inputElement.setAttribute("type", "radio");
            inputElement.setAttribute("id", controlName + value);
            inputElement.setAttribute("name", "control" + controlName);
            inputElement.setAttribute("value", value);
            if (value === initialValue) {
                inputElement.setAttribute("checked", "true");
            }
            divElement.appendChild(inputElement);
    
            const labelElement = document.createElement("label");
            labelElement.setAttribute("for", controlName + value);
            labelElement.innerHTML = value;
            divElement.appendChild(labelElement);
        }
    
        divElement.addEventListener('change', () => {
            const checkedRadioButton = divElement.querySelector(':checked');
            selectionHandler(checkedRadioButton.value);
            this.#updateSceneTransformation();
        });
    
        return divElement;
    }
    
    #updateSceneTransformation() {
        let transformations = [];
        transformations.push("rotateX(" + -this.#camRotations[0] + "deg)");
        transformations.push("rotateY(" + -this.#camRotations[2] + "deg)");
        transformations.push("rotateZ(" + -this.#camRotations[1] + "deg)");
        transformations.push("translateX(" + -this.#camTranslations[0] + "px)");
        transformations.push("translateY(" + -this.#camTranslations[2] + "px)");
        transformations.push("translateZ(" + -this.#camTranslations[1] + "px)");
        this.#sceneElement.style.transform = transformations.join(" ");
    }
    
    // Create a rectangle that is perpendicular to one of the axes of the coordinate system
    // widthAndHeight: width and height
    // position: coordinates of vertex that has the lowest values for x, y and z
    // perpendicularToAxes: specifies the axis to which the rectangle is perpendicular
    // color: color of the rectangle
    createRectangle(widthAndHeight, position, perpendicularToAxis, color, opacity) {

        /* Because the z-coordinate will be multiplied by -1 when mapped to the 2D coordinates,
           the vertex that has the smallest coordinates after the mapping to 2D will be another
           vertex, if the rectangle is not perpendicular to the z-axis. */
        const newPosition = new Point3D(position.x, position.y, position.z);
        if (perpendicularToAxis != Axis.z) {
            newPosition.z += widthAndHeight.height;
        }
        const pixelPoint = this.#getPixelPoint(newPosition);

        let objectElement = document.createElement("div");
        objectElement.setAttribute("class", "rectangle");
        objectElement.style.left = pixelPoint.x;
        objectElement.style.top = pixelPoint.y;
        objectElement.style.width = this.#nrOfPixels(widthAndHeight.width);
        objectElement.style.height = this.#nrOfPixels(widthAndHeight.height);
        objectElement.style.background = color;
        objectElement.style.opacity = opacity;

        let transform = "translateZ(" + pixelPoint.z + "px)";

        /* Note that the CSS rotations around the x, y and z-axes are inconsistent with respect to the direction
           of the rotation:
           - rotateX uses the left hand rule
           - rotateY uses the right hand rule
           - rotateZ uses the left hand rule */
        if (perpendicularToAxis == Axis.x) {
            transform += " rotateY(-90deg)";
        } else if (perpendicularToAxis == Axis.y) {
        } else if (perpendicularToAxis == Axis.z) {
            transform += " rotateX(90deg)";
        }
        objectElement.style.transform = transform;
        objectElement.style.transformOrigin = "0 0 0";

        this.#sceneElement.append(objectElement);

        return objectElement;
    }
}

export { Scene, Point3D, WidthAndHeight, Axis };