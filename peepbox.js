import { Scene, Point3D, WidthAndHeight, Axis } from "./scene.mjs";

function createScene() {
    const cameraPosition = new Point3D(0, 500, 0);
    const scene = new Scene(300, cameraPosition);

    const widthAndHeight = new WidthAndHeight(150, 150);
    const leftWall = scene.createRectangle(widthAndHeight, new Point3D(-75, 0, -75), Axis.x, "green", 1);
    const rightWall = scene.createRectangle(widthAndHeight, new Point3D(75, 0, -75), Axis.x, "yellow", 1);
    const backWall = scene.createRectangle(widthAndHeight, new Point3D(-75, 0, -75), Axis.y, "red", 1);
    const ceiling = scene.createRectangle(widthAndHeight, new Point3D(-75, 0, 75), Axis.z, "purple", 1);
    const floor = scene.createRectangle(widthAndHeight, new Point3D(-75, 0, -75), Axis.z, "blue", 1);
}

window.onload = (event) => {
    createScene();
};
