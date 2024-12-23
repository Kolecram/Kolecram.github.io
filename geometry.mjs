class Vector2D {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    x() {
        return this.x;
    }
    y() {
        return this.y;
    }
    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    angle() {
        // returns angle alpha in radians, where -Math.PI < alpha <= Math.PI
        return Math.atan2(this.y, this.x);
    }
    array() {
        return [this.x, this.y];
    }
    plus(v) {
        return new Vector2D(this.x + v.x, this.y + v.y);
    }
    minus(v) {
        return new Vector2D(this.x - v.x, this.y - v.y);
    }
    times(a) {
        return new Vector2D(a * this.x, a * this.y);
    }
    static createPolarVector(angle, radius) {
        return new Vector2D(Math.cos(angle), Math.sin(angle)).times(radius);
    }
}

export { Vector2D };