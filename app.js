window.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('renderCanvas');
  const engine = new BABYLON.Engine(canvas, true);

  let headMesh = null;
  let rotationSpeed = 0.01;
  let rotationDirection = 0; // 0 no rotation, -1 left, 1 right

  const scene = new BABYLON.Scene(engine);

  // Camera
  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 2.5,
    4,
    BABYLON.Vector3.Zero(),
    scene
  );
  camera.attachControl(canvas, true);

  // Light
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

  // Load the head model
  BABYLON.SceneLoader.Append("", "head.glb", scene, function () {
    headMesh = scene.meshes[scene.meshes.length - 1];
    headMesh.position = BABYLON.Vector3.Zero();
    headMesh.scaling = new BABYL
