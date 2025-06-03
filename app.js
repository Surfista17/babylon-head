window.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('renderCanvas');
  const engine = new BABYLON.Engine(canvas, true);

  let headMesh;
  let crawlMeshes = [];

  // Caricamento audio Babylon.js
  let musicSound;

  // Testi degli episodi Star Wars completi (puoi sostituire qui o caricare da file se vuoi)
  const starWarsTexts = [
    {
      episode: "Episode I",
      title: "THE PHANTOM MENACE",
      text: `Turmoil has engulfed the Galactic Republic. The taxation of trade routes to outlying star systems is in dispute.

Hoping to resolve the matter with a blockade of deadly battleships, the greedy Trade Federation has stopped all shipping to the small planet of Naboo.

While the Congress of the Republic endlessly debates this alarming chain of events, the Supreme Chancellor has secretly dispatched two Jedi Knights, the guardians of peace and justice in the galaxy, to settle the conflict....`
    },
    {
      episode: "Episode II",
      title: "ATTACK OF THE CLONES",
      text: `There is unrest in the Galactic Senate. Several thousand solar systems have declared their intentions to leave the Republic.

This separatist movement, under the leadership of the mysterious Count Dooku, has made it difficult for the limited number of Jedi Knights to maintain peace and order in the galaxy.

Senator Amidala, the former Queen of Naboo, is returning to the Galactic Senate to vote on the critical issue of creating an ARMY OF THE REPUBLIC to assist the overwhelmed Jedi....`
    },
    {
      episode: "Episode III",
      title: "REVENGE OF THE SITH",
      text: `War! The Republic is crumbling under attacks by the ruthless Sith Lord, Count Dooku. There are heroes on both sides. Evil is everywhere.

In a stunning move, the fiendish droid leader, General Grievous, has swept into the Republic capital and kidnapped Chancellor Palpatine, leader of the Galactic Senate.

As the Separatist Droid Army attempts to flee the besieged capital with their valuable hostage, two Jedi Knights lead a desperate mission to rescue the captive Chancellor....`
    },
    {
      episode: "Episode IV",
      title: "A NEW HOPE",
      text: `It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire.

During the battle, Rebel spies managed to steal secret plans to the Empire's ultimate weapon, the DEATH STAR, an armored space station with enough power to destroy an entire planet.

Pursued by the Empire's sinister agents, Princess Leia races home aboard her starship, custodian of the stolen plans that can save her people and restore freedom to the galaxy....`
    },
    {
      episode: "Episode V",
      title: "THE EMPIRE STRIKES BACK",
      text: `It is a dark time for the Rebellion. Although the Death Star has been destroyed, Imperial troops have driven the Rebel forces from their hidden base and pursued them across the galaxy.

Evading the dreaded Imperial Starfleet, a group of freedom fighters led by Luke Skywalker has established a new secret base on the remote ice world of Hoth.

The evil lord Darth Vader, obsessed with finding young Skywalker, has dispatched thousands of remote probes into the far reaches of space....`
    },
    {
      episode: "Episode VI",
      title: "RETURN OF THE JEDI",
      text: `Luke Skywalker has returned to his home planet of Tatooine in an attempt to rescue his friend Han Solo from the clutches of the vile gangster Jabba the Hutt.

Little does Luke know that the GALACTIC EMPIRE has secretly begun construction on a new armored space station even more powerful than the first dreaded Death Star.

When completed, this ultimate weapon will spell certain doom for the small band of rebels struggling to restore freedom to the galaxy...`
    },
    {
      episode: "Episode VII",
      title: "THE FORCE AWAKENS",
      text: `Luke Skywalker has vanished. In his absence, the sinister FIRST ORDER has risen from the ashes of the Empire and will not rest until Skywalker, the last Jedi, has been destroyed.

With the support of the REPUBLIC, General Leia Organa leads a brave RESISTANCE. She is desperate to find her brother Luke and gain his help in restoring peace and justice to the galaxy.

Leia has sent her most daring pilot on a secret mission to Jakku, where an old ally has discovered a clue to Luke's whereabouts....`
    },
    {
      episode: "Episode VIII",
      title: "THE LAST JEDI",
      text: `The FIRST ORDER reigns. Having decimated the peaceful Republic, Supreme Leader Snoke now deploys his merciless legions to seize military control of the galaxy.

Only General Leia Organa's band of RESISTANCE fighters stand against the rising tyranny, certain that Jedi Master Luke Skywalker will return and restore a spark of hope to the fight.

But the Resistance has been exposed. As the First Order speeds toward the rebel base, the brave heroes mount a desperate escape....`
    },
    {
      episode: "Episode IX",
      title: "THE RISE OF SKYWALKER",
      text: `The dead speak! The galaxy has heard a mysterious broadcast, a threat of REVENGE in the sinister voice of the late EMPEROR PALPATINE.

GENERAL LEIA ORGANA dispatches secret agents to gather intelligence, while REY, the last hope of the Jedi, trains for battle against the diabolical FIRST ORDER.

Meanwhile, Supreme Leader KYLO REN rages in search of the phantom Emperor, determined to destroy any threat to his power....`
    },
  ];

  function createCrawlText(scene) {
    // Posizione iniziale sotto la vista, scorre verso l'alto
    const startY = -10;
    const spacing = 4;

    let groupY = startY;

    starWarsTexts.forEach((ep, idx) => {
      const fullText = `${ep.episode}\n${ep.title}\n\n${ep.text}`;
      // Creiamo un DynamicTexture per il testo
      const dynamicTexture = new BABYLON.DynamicTexture(
        `crawlText${idx}`, {width:1024, height:1024}, scene, false
      );
      dynamicTexture.hasAlpha = true;

      const ctx = dynamicTexture.getContext();
      ctx.font = "28px Orbitron";
      ctx.fillStyle = "yellow";
      ctx.textAlign = "center";
      ctx.clearRect(0, 0, 1024, 1024);

      // Scriviamo multilinea con semplice split
      const lines = fullText.split('\n');
      let y = 50;
      lines.forEach(line => {
        ctx.fillText(line, 512, y);
        y += 36;
      });

      dynamicTexture.update();

      // Creiamo piano per il testo
      const plane = BABYLON.MeshBuilder.CreatePlane(`crawlPlane${idx}`, {width:8, height:6}, scene);
      const mat = new BABYLON.StandardMaterial(`crawlMat${idx}`, scene);
      mat.diffuseTexture = dynamicTexture;
      mat.emissiveColor = BABYLON.Color3.Yellow();
      mat.backFaceCulling = false;
      plane.material = mat;

      plane.position = new BABYLON.Vector3(0, groupY, 0);
      plane.rotation.x = BABYLON.Tools.ToRadians(70); // inclinazione tipo crawl
      plane.position.z = 3;

      crawlMeshes.push(plane);

      groupY -= spacing;
    });
  }

  function createStarWarsLogo(scene) {
    // Semplice piano con texture testo o scritta 3D con dynamic texture
    const dt = new BABYLON.DynamicTexture("logoTexture", {width:512, height:256}, scene, false);
    dt.hasAlpha = true;
    const ctx = dt.getContext();

    ctx.font = "bold 72px Orbitron";
    ctx.fillStyle = "yellow";
    ctx.textAlign = "center";
    ctx.clearRect(0, 0, 512, 256);
    ctx.fillText("STAR WARS", 256, 150);
    dt.update();

    const plane = BABYLON.MeshBuilder.CreatePlane("logoPlane", {width:8, height:4}, scene);
    const mat = new BABYLON.StandardMaterial("logoMat", scene);
    mat.diffuseTexture = dt;
    mat.emissiveColor = BABYLON.Color3.Yellow();
    mat.backFaceCulling = false;
    plane.material = mat;

    plane.position = new BABYLON.Vector3(0, 6, 0);
    plane.rotation.x = BABYLON.Tools.ToRadians(80);
    plane.position.z = 3;

    return plane;
  }

  const createScene = function () {
    const scene = new BABYLON.Scene(engine);

    // Camera orbitale con controllo
    const camera
