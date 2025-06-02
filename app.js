window.addEventListener('DOMContentLoaded', function () {
    // Get the canvas element
    const canvas = document.getElementById('renderCanvas');

    // Create Babylon engine
    const engine = new BABYLON.Engine(canvas, true);

    // Create scene function
    const createScene = function () {
        const scene = new BABYLON.Scene(engine);

        // A camera to orbit around
        const camera = new BABYLON.ArcRotateCamera("camera", 
            -Math.PI / 2, Math.PI / 2.5, 4, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);

        // Light
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

        // Load the .glb model (sostituisci 'head.glb' con il tuo file)
        BABYLON.SceneLoader.Append("", "head.glb", scene, function (scene) {
            const headMesh = scene.meshes[scene.meshes.length - 1]; // prendi l'ultimo mesh caricato
            // Posiziona la testa al centro e scala se serve
            headMesh.position = BABYLON.Vector3.Zero();
            headMesh.scaling = new BABYLON.Vector3(2, 2, 2);

            // Ruota la testa ogni frame
            scene.onBeforeRenderObservable.add(() => {
                headMesh.rotation.y += 0.01; // ruota lungo l'asse Y
            });
        });

        return scene;
    };

    const scene = createScene();

    // Render loop
    engine.runRenderLoop(function () {
        scene.render();
    });

    // Resize
    window.addEventListener('resize', function () {
        engine.resize();
    });
});
