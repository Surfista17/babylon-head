window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('renderCanvas');
  const engine = new BABYLON.Engine(canvas, true);

  // Testi crawl completi di tutti gli episodi Star Wars come da tuo input originale
  const crawlText = `
Episode I
THE PHANTOM MENACE
Turmoil has engulfed the Galactic Republic. The taxation of trade routes to outlying star systems is in dispute.
Hoping to resolve the matter with a blockade of deadly battleships, the greedy Trade Federation has stopped all shipping to the small planet of Naboo.
While the Congress of the Republic endlessly debates this alarming chain of events, the Supreme Chancellor has secretly dispatched two Jedi Knights, the guardians of peace and justice in the galaxy, to settle the conflict....

Episode II
ATTACK OF THE CLONES
There is unrest in the Galactic Senate. Several thousand solar systems have declared their intentions to leave the Republic.
This separatist movement, under the leadership of the mysterious Count Dooku, has made it difficult for the limited number of Jedi Knights to maintain peace and order in the galaxy.
Senator Amidala, the former Queen of Naboo, is returning to the Galactic Senate to vote on the critical issue of creating an ARMY OF THE REPUBLIC to assist the overwhelmed Jedi....

Episode III
REVENGE OF THE SITH
War! The Republic is crumbling under attacks by the ruthless Sith Lord, Count Dooku.
There are heroes on both sides. Evil is everywhere.
In a stunning move, the fiendish droid leader, General Grievous, has swept into the Republic capital and kidnapped Chancellor Palpatine, leader of the Galactic Senate.
As the Separatist Droid Army attempts to flee the besieged capital with their valuable hostage, two Jedi Knights lead a desperate mission to rescue the captive Chancellor....

Episode IV
A NEW HOPE
It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire.
During the battle, Rebel spies managed to steal secret plans to the Empire's ultimate weapon, the DEATH STAR, an armored space station with enough power to destroy an entire planet.
Pursued by the Empire's sinister agents, Princess Leia races home aboard her starship, custodian of the stolen plans that can save her people and restore freedom to the galaxy....

Episode V
THE EMPIRE STRIKES BACK
It is a dark time for the Rebellion. Although the Death Star has been destroyed, Imperial troops have driven the Rebel forces from their hidden base and pursued them across the galaxy.
Evading the dreaded Imperial Starfleet, a group of freedom fighters led by Luke Skywalker has established a new secret base on the remote ice world of Hoth.
The evil lord Darth Vader, obsessed with finding young Skywalker, has dispatched thousands of remote probes into the far reaches of space....

Episode VI
RETURN OF THE JEDI
Luke Skywalker has returned to his home planet of Tatooine in an attempt to rescue his friend Han Solo from the clutches of the vile gangster Jabba the Hutt.
Little does Luke know that the GALACTIC EMPIRE has secretly begun construction on a new armored space station even more powerful than the first dreaded Death Star.
When completed, this ultimate weapon will spell certain doom for the small band of rebels struggling to restore freedom to the galaxy....

Episode VII
THE FORCE AWAKENS
Luke Skywalker has vanished. In his absence, the sinister FIRST ORDER has risen from the ashes of the Empire and will not rest until Skywalker, the last Jedi, has been destroyed.
With the support of the REPUBLIC, General Leia Organa leads a brave RESISTANCE.
She is desperate to find her brother Luke and gain his help in restoring peace and justice to the galaxy.
Leia has sent her most daring pilot on a secret mission to Jakku, where an old ally has discovered a clue to Luke's whereabouts....

Episode VIII
THE LAST JEDI
The FIRST ORDER reigns. Having decimated the peaceful Republic, Supreme Leader Snoke now deploys his merciless legions to seize military control of the galaxy.
Only General Leia Organa's band of RESISTANCE fighters stand against the rising tyranny, certain that Jedi Master Luke Skywalker will return and restore a spark of hope to the fight.
But the Resistance has been exposed. As the First Order speeds toward the rebel base, the brave heroes mount a desperate escape....

Episode IX
THE RISE OF SKYWALKER
The dead speak! The galaxy has heard a mysterious broadcast, a threat of REVENGE in the sinister voice of the late EMPEROR PALPATINE.
GENERAL LEIA ORGANA dispatches secret agents to gather intelligence, while REY, the last hope of the Jedi, trains for battle against the diabolical FIRST ORDER.
Meanwhile, Supreme Leader KYLO REN rages in search of the phantom Emperor, determined to destroy any threat to his power....
`;

  const scene = new BABYLON.Scene(engine);

  // Camera
  const camera = new BABYLON.ArcRotateCamera("camera",
    -Math.PI / 2, Math.PI / 2.5, 20, new BABYLON.Vector3(0, 0, 5), scene);
  camera.attachControl(canvas, true);

  // Light
  new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

  // Background Stars - particelle semplici
  const starSystem = new BABYLON.ParticleSystem("stars", 1000, scene);
  starSystem.particleTexture = new BABYLON.Texture("https://i.ibb.co/hfBtcP6/starfield.jpg", scene);
  starSystem.minEmitBox = new BABYLON.Vector3(-50, -50, -50);
  starSystem.maxEmitBox = new BABYLON.Vector3(50, 50, 50);
  starSystem.color1 = new BABYLON.Color4(1, 1, 1, 1);
  starSystem.color2 = new BABYLON.Color4(1, 1, 1, 1);
  starSystem.minSize = 0.1;
  starSystem.maxSize = 0.5;
  starSystem.minLifeTime = Number.MAX_VALUE;
  starSystem.emitRate = 1000;
  starSystem.gravity = new BABYLON.Vector3(0, 0, 0);
  starSystem.direction1 = new BABYLON.Vector3(0, 0, 1);
  starSystem.direction2 = new BABYLON.Vector3(0, 0, 1);
  starSystem.minAngularSpeed = 0;
  starSystem.maxAngularSpeed = 0;
  starSystem.minEmitPower = 0;
  starSystem.maxEmitPower = 0;
  starSystem.updateSpeed = 0.005;
  starSystem.start();

  // Carica modello testa 3D (file head.glb DEVE essere nella stessa cartella)
  let headMesh = null;
  BABYLON.SceneLoader.Append("", "head.glb", scene, () => {
    headMesh = scene.meshes[scene.meshes.length - 1];
    headMesh.position = new BABYLON.Vector3(0, 0, 0);
    headMesh.scaling = new BABYLON.Vector3(3, 3, 3);
  });

  // Logo "STAR WARS" con DynamicTexture su piano
  const logoPlane = BABYLON.MeshBuilder.CreatePlane("logoPlane", {width: 12, height: 4}, scene);
  logoPlane.position = new BABYLON.Vector3(0, 8, 8);
  const logoTexture = new BABYLON.DynamicTexture("logoTex", 512, scene, false);
  const ctxLogo = logoTexture.getContext();
  ctxLogo.font = "bold 80px Arial Black, sans-serif";
  ctxLogo.fillStyle = "yellow";
  ctxLogo.textAlign = "center";
  ctxLogo.clearRect(0, 0, 512, 512);
  ctxLogo.fillText("STAR WARS", 256, 100);
  logoTexture.update();
  const logoMat = new BABYLON.StandardMaterial("logoMat", scene);
  logoMat.diffuseTexture = logoTexture;
  logoMat.emissiveColor = new BABYLON.Color3(1, 1, 0);
  logoMat.backFaceCulling = false;
  logoPlane.material = logoMat;

  // Crawl testo su DynamicTexture molto alta per lo scroll verticale
  const crawlWidth = 20;
  const crawlHeight = 60;
  const crawlTexture = new BABYLON.DynamicTexture("crawlTex", {width: 1024, height: 4096}, scene, false);
  const crawlMat = new BABYLON.StandardMaterial("crawlMat", scene);
  crawlMat.diffuseTexture = crawlTexture;
  crawlMat.emissiveColor = new BABYLON.Color3(1, 1, 0);
  crawlMat.backFaceCulling = false;

  const ctxCrawl = crawlTexture.getContext();
  ctxCrawl.font = "24px Arial, sans-serif";
  ctxCrawl.fillStyle = "yellow";
  ctxCrawl.textAlign = "left";
  ctxCrawl.clearRect(0, 0, 1024, 4096);

  let y = 30;
  const lineHeight = 30;
  // divido crawlText per linee e le disegno tutte sul texture
  crawlText.split('\n').forEach(line => {
    if(line.trim().length > 0) {
      ctxCrawl.fillText(line.trim(), 20, y);
      y += lineHeight;
    }
  });
  crawlTexture.update();

  const crawlPlane = BABYLON.MeshBuilder.CreatePlane("crawlPlane", {width: crawlWidth, height: crawlHeight}, scene);
  crawlPlane.position = new BABYLON.Vector3(0, -10, 8);
  crawlPlane.rotation.x = BABYLON.Tools.ToRadians(25);
  crawlPlane.material = crawlMat;

  // Animazione scroll crawl
  scene.onBeforeRenderObservable.add(() => {
    crawlMat.diffuseTexture.vOffset -= 0.0004; // scrolla verso l'alto
    if (crawlMat.diffuseTexture.vOffset < -1) {
      crawlMat.diffuseTexture.vOffset = 0;
    }
  });

  // Musica sottofondo
  const musicUrl = "https://ia600407.us.archive.org/33/items/StarWarsOpeningTheme_201601/StarWarsOpeningTheme.mp3";
  const music = new Audio(musicUrl);
  music.loop = true;
  music.volume = 0.5;

  const playButton = document.getElementById("playButton");
  let musicStarted = false;

  playButton.addEventListener("click", () => {
    music.play().then(() => {
      musicStarted = true;
      playButton.style.display = "none";
    });
  });

  // Tentativo autoplay musica
  music.play().then(() => {
    musicStarted = true;
    playButton.style.display = "none";
  }).catch(() => {
    playButton.style.display = "block"; // Mostra bottone se autoplay fallisce
  });

  // Rotazione testa con frecce
  window.addEventListener("keydown", (e) => {
    if (!headMesh) return;
    const step = 0.05;
    switch(e.key) {
      case "ArrowLeft":
        headMesh.rotation.y -= step;
        break;
      case "ArrowRight":
        headMesh.rotation.y += step;
        break;
      case "ArrowUp":
        headMesh.rotation.x -= step;
        break;
      case "ArrowDown":
        headMesh.rotation.x += step;
        break;
    }
  });

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener("resize", () => {
    engine.resize();
  });
});
