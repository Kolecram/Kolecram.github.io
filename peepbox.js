import { initScene, Point3D, WidthAndHeight, createRectangle, Axis } from "./scene.mjs";

function createScene() {
    const cameraPosition = new Point3D(0, 500, 0);
    const sceneElement = initScene(300, cameraPosition);

    const widthAndHeight = new WidthAndHeight(150, 150);
    const leftWall = createRectangle(sceneElement, widthAndHeight, new Point3D(-75, 0, -75), Axis.x, "green", 1);
    const rightWall = createRectangle(sceneElement, widthAndHeight, new Point3D(75, 0, -75), Axis.x, "yellow", 1);
    const backWall = createRectangle(sceneElement, widthAndHeight, new Point3D(-75, 0, -75), Axis.y, "red", 1);
    const ceiling = createRectangle(sceneElement, widthAndHeight, new Point3D(-75, 0, 75), Axis.z, "purple", 1);
    const floor = createRectangle(sceneElement, widthAndHeight, new Point3D(-75, 0, -75), Axis.z, "blue", 1);
}

window.onload = (event) => {
    createScene();
};
