const svgNamespace = "http://www.w3.org/2000/svg";

function createSvgElement(name: string) {
    return document.createElementNS(svgNamespace, name);
}

class PathBuilder {
    #pathCommands = [];

    #addCommand(letter: string, parameters: Array<string>) {
        this.#pathCommands.push(letter + " " + parameters.join(" "));
    }

    #formatCoordinates(x: number, y: number) {
        return x + "," + y;
    }

    addMoveCommand(position: Array<number>) {
        this.#addCommand("M", [this.#formatCoordinates(position[0], position[1])]);
    }

    addLineCommand(position: Array<number>) {
        this.#addCommand("L", [this.#formatCoordinates(position[0], position[1])]);
    }

    addDeltaLineCommand(position: Array<number>) {
        this.#addCommand("l", [this.#formatCoordinates(position[0], position[1])]);
    }

    addArcCommand(rx: number, ry: number, xAxisRotation: number, largeArcFlag: number, sweepFlag: number, position: Array<number>) {
        this.#innerAddArcCommand("A", rx, ry, xAxisRotation, largeArcFlag, sweepFlag, position);
    }

    addDeltaArcCommand(rx: number, ry: number, xAxisRotation: number, largeArcFlag: number, sweepFlag: number, position: Array<number>) {
        this.#innerAddArcCommand("a", rx, ry, xAxisRotation, largeArcFlag, sweepFlag, position);
    }

    #innerAddArcCommand(commandLetter: string, rx: number, ry: number, xAxisRotation: number, largeArcFlag: number, sweepFlag: number, position: Array<number>) {
        this.#addCommand("A", [rx.toString(), ry.toString(), xAxisRotation.toString(), largeArcFlag.toString(), sweepFlag.toString(), this.#formatCoordinates(position[0], position[1])]);
    }

    build() {
        return this.#pathCommands.join(" ");
    }
}

class CssStyleBuilder {
    #styles = [];

    add(name: string, value: string) {
        this.#styles.push(name + ": " + value);
        return this;
    }

    addStrokeWidth(value: number) {
        return this.add("stroke-width", String(value));
    }

    addFontSize(value: number) {
        return this.add("font-size", String(value));
    }

    build() {
        return this.#styles.join("; ");
    }
}

class TransformBuilder {
    #transforms = [];

    addRotate(degrees: number) {
        this.addTransform("rotate", degrees);
        return this;
    }

    addScale(x: number, y: number) {
        this.addTransform("scale", x, y);
        return this;
    }

    addTranslate(x: number, y: number) {
        this.addTransform("translate", x, y);
        return this;
    }

    addTransform(name: string, ...args: Array<number>) {
        this.#transforms.push(`${name}(${args.join(",")})`);
    }

    build() {
        return this.#transforms.join(" ");
    }
}

export { PathBuilder, createSvgElement, CssStyleBuilder, TransformBuilder };