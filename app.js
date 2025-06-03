window.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);
    let headMesh = null; // 👈 Definito fuori per usarlo globalmente

    const createScene = function () {
        const scene = new BABYLON.Scene(engine);

        const camera = new BABYLON.ArcRotateCamera("camera",
            -Math.PI / 2, Math.PI / 2.5, 4, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);

        new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

        BABYLON.SceneLoader.Append("", "head.glb", scene, function () {
            headMesh = scene.meshes.find(mesh => mesh.name !== "__root__"); // evita "__root__"
            if (headMesh) {
                headMesh.position = BABYLON.Vector3.Zero();
                headMesh.scaling = new BABYLON.Vector3(2, 2, 2);
            }
        });

        return scene;
    };

    const scene = createScene();

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener('resize', function () {
        engine.resize();
    });

    // 👉 Controlli con frecce
    window.addEventListener("keydown", (event) => {
        if (!headMesh) return;
        if (event.key === "ArrowLeft") {
            headMesh.rotation.y -= 0.1;
        } else if (event.key === "ArrowRight") {
            headMesh.rotation.y += 0.1;
        }
    });

    // Musica fallback
    document.getElementById("playMusic").addEventListener("click", () => {
        const theme = document.getElementById("theme");
        theme.play();
    });
});
