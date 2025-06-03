window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('renderCanvas');
  const engine = new BABYLON.Engine(canvas, true);

  let headMesh = null;
  let crawlPlanes = [];
  let crawlSpeed = 0.02;

  // Audio
  let music;
  const playBtn = document.getElementById('playMusicBtn');

  // Testi completi Star Wars (testo di esempio ridotto, metti i testi completi che hai tu)
  const starWarsTexts = [
    {
      episode: "Episode I",
      title: "THE PHANTOM MENACE",
      text: `Turmoil has engulfed the Galactic Republic. The taxation of trade routes to outlying star systems is in dispute.

Hoping to resolve the matter with a blockade of deadly battleships, the greedy Trade Federation has stopped all shipping to the small planet of Naboo.

While the Congress of the Republic endlessly debates this alarming chain of events, the Supreme Chancellor has secretly dispatched two Jedi Knights, the guardians of peace and justice in the galaxy, to settle the conflict....`
    },
    // Inserisci qui tutti gli altri episodi come nel tuo file originale
  ];

  const createScene = async () => {
    const scene = new BABYLON.Scene(engine);

    // Camera orbitale
    const camera = new BABYLON.ArcRotateCamera("cam", BABYLON.Tools.ToRadians(180), BABYLON.Tools.ToRadians(70), 15, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 8;
    camera.upperRadiusLimit = 20;

    // Luce
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.9;

    // Skybox galassia
    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000}, scene);
    const skyboxMaterial = new BABYLON.StandardMaterial("skyBoxMat", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("https://playground.babylonjs.com/textures/galaxy", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

    // Carica modello testa 3D glTF (scegli un modello semplice o il tuo file)
    // Se hai un file .glb chiamalo 'head.glb' e mettilo nella root
    // Per test rapido uso modello demo
    await BABYLON.SceneLoader.ImportMeshAsync(null, "https://models.babylonjs.com/", "BoomBox.glb", scene)
      .then(result => {
        headMesh = result.meshes[0];
        headMesh.position = new BABYLON.Vector3(0, 0, 0);
        headMesh.scaling = new BABYLON.Vector3(3, 3, 3);
      });

    // Funzione per creare crawl text come piani con texture dinamiche
    function createCrawlText() {
      let yStart = -10;
      let spacing = 7;

      starWarsTexts.forEach((episode, i) => {
        const fullText = `${episode.episode}\n${episode.title}\n\n${episode.text}`;
        const dt = new BABYLON.DynamicTexture(`crawlTex${i}`, {width:1024, height:1024}, scene, false);
        dt.hasAlpha = true;

        const ctx = dt.getContext();
        ctx.clearRect(0, 0, 1024, 1024);
        ctx.font = "28px Orbitron";
        ctx.fillStyle = "yellow";
        ctx.textAlign = "center";

        // Multilinea semplice con \n
        const lines = fullText.split('\n');
        let y = 40;
        lines.forEach(line => {
          ctx.fillText(line, 512, y);
          y += 36;
        });

        dt.update();

        const plane = BABYLON.MeshBuilder.CreatePlane(`crawlPlane${i}`, {width:10, height:6}, scene);
        const mat = new BABYLON.StandardMaterial(`crawlMat${i}`, scene);
        mat.diffuseTexture = dt;
        mat.emissiveColor = BABYLON.Color3.Yellow();
        mat.backFaceCulling = false;
        plane.material = mat;

        plane.position = new BABYLON.Vector3(0, yStart - (i * spacing), 3);
        plane.rotation.x = BABYLON.Tools.ToRadians(70);

        crawlPlanes.push(plane);
      });
    }

    createCrawlText();

    // Funzione per aggiornare posizione crawl (scorrimento verticale)
    scene.onBeforeRenderObservable.add(() => {
      crawlPlanes.forEach(plane => {
        plane.position.y += crawlSpeed;
        if (plane.position.y > 15) {
          plane.position.y = -30;
        }
      });
    });

    // Creazione audio Babylon
    music = new BABYLON.Sound("StarWarsMusic", "starwars.mp3", scene, null, {
      loop: true,
      autoplay: true,
      volume: 0.4,
      spatialSound: false,
    });

    // Fallback bottone play se autoplay bloccato
    music.onPlayObservable.add(() => {
      playBtn.classList.add("hidden");
    });

    playBtn.addEventListener("click", () => {
      music.play();
      playBtn.classList.add("hidden");
    });

    // Controllo rotazione testa con frecce
    let rotationY = 0;
    window.addEventListener("keydown", (evt) => {
      if (!headMesh) return;
      const step = 0.1;
      if (evt.key === "ArrowLeft") {
        rotationY -= step;
      } else if (evt.key === "ArrowRight") {
        rotationY += step;
      }
      headMesh.rotation.y = rotationY;
    });

    return scene;
  };

  const scene = createScene();

  engine.runRenderLoop(() => {
    if (scene.then) {
      scene.then(s => s.render());
    } else {
      scene.render();
    }
  });

  window.addEventListener('resize', () => {
    engine.resize();
  });
});
