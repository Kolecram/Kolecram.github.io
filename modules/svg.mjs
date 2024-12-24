const svgNamespace = "http://www.w3.org/2000/svg";
function createSvgElement(name) {
    return document.createElementNS(svgNamespace, name);
}
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
    addDeltaLineCommand(position) {
        this.#addCommand("l", [this.#formatCoordinates(position[0], position[1])]);
    }
    addArcCommand(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, position) {
        this.#innerAddArcCommand("A", rx, ry, xAxisRotation, largeArcFlag, sweepFlag, position);
    }
    addDeltaArcCommand(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, position) {
        this.#innerAddArcCommand("a", rx, ry, xAxisRotation, largeArcFlag, sweepFlag, position);
    }
    #innerAddArcCommand(commandLetter, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, position) {
        this.#addCommand("A", [rx.toString(), ry.toString(), xAxisRotation.toString(), largeArcFlag.toString(), sweepFlag.toString(), this.#formatCoordinates(position[0], position[1])]);
    }
    build() {
        return this.#pathCommands.join(" ");
    }
}
class CssStyleBuilder {
    #styles = [];
    add(name, value) {
        this.#styles.push(name + ": " + value);
        return this;
    }
    addStrokeWidth(value) {
        return this.add("stroke-width", String(value));
    }
    addFontSize(value) {
        return this.add("font-size", String(value));
    }
    build() {
        return this.#styles.join("; ");
    }
}
class TransformBuilder {
    #transforms = [];
    addRotate(degrees) {
        this.addTransform("rotate", degrees);
        return this;
    }
    addScale(x, y) {
        this.addTransform("scale", x, y);
        return this;
    }
    addTranslate(x, y) {
        this.addTransform("translate", x, y);
        return this;
    }
    addTransform(name, ...args) {
        this.#transforms.push(`${name}(${args.join(",")})`);
    }
    build() {
        return this.#transforms.join(" ");
    }
}
export { PathBuilder, createSvgElement, CssStyleBuilder, TransformBuilder };
