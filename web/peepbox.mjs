import { Scene, Point3D, WidthAndHeight, Axis } from "../modules/scene.mjs";
function createScene() {
    var cameraPosition = new Point3D(0, 500, 0);
    var scene = new Scene(300, cameraPosition);
    var widthAndHeight = new WidthAndHeight(150, 150);
    var leftWall = scene.createRectangle(widthAndHeight, new Point3D(-75, 0, -75), Axis.x, "green", 1);
    var rightWall = scene.createRectangle(widthAndHeight, new Point3D(75, 0, -75), Axis.x, "yellow", 1);
    var backWall = scene.createRectangle(widthAndHeight, new Point3D(-75, 0, -75), Axis.y, "red", 1);
    var ceiling = scene.createRectangle(widthAndHeight, new Point3D(-75, 0, 75), Axis.z, "purple", 1);
    var floor = scene.createRectangle(widthAndHeight, new Point3D(-75, 0, -75), Axis.z, "blue", 1);
}
window.onload = function (event) {
    createScene();
};
