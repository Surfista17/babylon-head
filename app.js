window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);

    const createScene = () => {
        const scene = new BABYLON.Scene(engine);
        const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 4, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

        BABYLON.SceneLoader.Append("", "head.glb", scene, (scene) => {
            const headMesh = scene.meshes.find(mesh => mesh.name !== "__root__");
            headMesh.position = BABYLON.Vector3.Zero();
            headMesh.scaling = new BABYLON.Vector3(2, 2, 2);

            // Rotazione automatica
            scene.onBeforeRenderObservable.add(() => {
                headMesh.rotation.y += rotationSpeed;
            });

            // Rotazione controllata da tastiera
            window.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowLeft') headMesh.rotation.y -= 0.1;
                if (event.key === 'ArrowRight') headMesh.rotation.y += 0.1;
                if (event.key === 'ArrowUp') headMesh.rotation.x -= 0.1;
                if (event.key === 'ArrowDown') headMesh.rotation.x += 0.1;
            });
        });

        return scene;
    };

    const scene = createScene();
    let rotationSpeed = 0.01;

    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener('resize', () => {
        engine.resize();
    });

    // Musica fallback
    const theme = document.getElementById("theme");
    document.getElementById("playMusic").addEventListener("click", () => {
        theme.play();
    });
});
