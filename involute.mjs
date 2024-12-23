import { Vector2D } from "./geometry.mjs";

function involute(alpha) {
    const x = Math.cos(alpha) + alpha * Math.sin(alpha);
    const y = Math.sin(alpha) - alpha * Math.cos(alpha);
    return new Vector2D(x, y);
}

export { involute };