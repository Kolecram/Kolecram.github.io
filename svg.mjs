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

    addArcCommand(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, position) {
        this.#addCommand("A", [rx, ry, xAxisRotation, largeArcFlag, sweepFlag, this.#formatCoordinates(position[0], position[1])]);
    }

    build() {
        return this.#pathCommands.join(" ");
    }
}

export {PathBuilder, createSvgElement};