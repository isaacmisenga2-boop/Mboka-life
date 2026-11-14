
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// ==========================================
// MBOKA LIFE - NOUVELLE BASE
// Ville : MWANGAZA
// Moteur 3D - Version 1.0
// ==========================================

const game = document.querySelector('#game');
const loading = document.querySelector('#loading');
const message = document.querySelector('#message');

if (!game) throw new Error('Zone de jeu introuvable');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9bc6d2);
scene.fog = new THREE.Fog(0x9bc6d2, 35, 120);

const camera = new THREE.PerspectiveCamera(
  60, innerWidth / innerHeight, 0.1, 200
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance'
});

renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
game.appendChild(renderer.domElement);

// ---------- LUMIÈRES ----------

scene.add(new THREE.HemisphereLight(0xd9efff, 0x667044, 2));

const sun = new THREE.DirectionalLight(0xffe3b5, 2.2);
sun.position.set(-25, 40, 20);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -45;
sun.shadow.camera.right = 45;
sun.shadow.camera.top = 45;
sun.shadow.camera.bottom = -45;
scene.add(sun);

// ---------- MATÉRIAUX ----------

const mat = color => new THREE.MeshStandardMaterial({
  color,
  roughness: 0.9
});

const grassMat = mat(0x789b55);
const roadMat = mat(0x555958);
const concreteMat = mat(0xb7b2a5);
const wallColors = [
  0xd6a16f, 0xe0d1aa, 0xc47d62,
  0xd2c6b0, 0xc9a66b, 0xa9b7a0
];

// ---------- OUTILS 3D ----------

function box(parent, x, y, z, w, h, d, material) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    material
  );
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function sphere(parent, x, y, z, sx, sy, sz, material) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 20, 16),
    material
  );
  mesh.position.set(x, y, z);
  mesh.scale.set(sx, sy, sz);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

function cylinder(parent, x, y, z, radius, height, material) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, 16),
    material
  );
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

// ---------- SOL ET ROUTES ----------

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(180, 180),
  grassMat
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Grande route
box(scene, 0, 0.025, 0, 180, 0.05, 13, roadMat);

// Trottoirs
box(scene, 0, 0.09, -7.2, 180, 0.15, 1.2, concreteMat);
box(scene, 0, 0.09, 7.2, 180, 0.15, 1.2, concreteMat);

// Marquage routier
for (let x = -85; x < 90; x += 12) {
  box(scene, x, 0.06, 0, 5, 0.025, 0.18, mat(0xf1e5ae));
}

// ---------- MAISONS ----------

function createHouse(x, z, color) {
  const house = new THREE.Group();
  house.position.set(x, 0, z);

  const wall = mat(color);
  const roof = mat(0x874a31);
  const dark = mat(0x392b25);
  const glass = mat(0x82b8c6);

  box(house, 0, 2, 0, 8, 4, 7, wall);

  // Toit
  const roofMesh = new THREE.Mesh(
    new THREE.ConeGeometry(6.2, 2.5, 4),
    roof
  );
  roofMesh.position.set(0, 5.1, 0);
  roofMesh.rotation.y = Math.PI / 4;
  roofMesh.scale.z = 0.8;
  roofMesh.castShadow = true;
  house.add(roofMesh);

  // Porte
  box(house, 0, 1.05, 3.56, 1.3, 2.1, 0.12, dark);

  // Fenêtres
  box(house, -2.5, 2.3, 3.57, 1.4, 1.2, 0.12, glass);
  box(house, 2.5, 2.3, 3.57, 1.4, 1.2, 0.12, glass);

  // Cadres
  box(house, -2.5, 2.3, 3.66, 1.5, 0.09, 0.08, dark);
  box(house, 2.5, 2.3, 3.66, 1.5, 0.09, 0.08, dark);

  scene.add(house);
}

createHouse(-16, -16, wallColors[0]);
createHouse(0, -19, wallColors[1]);
createHouse(17, -16, wallColors[2]);
createHouse(-18, 17, wallColors[3]);
createHouse(18, 18, wallColors[4]);
createHouse(0, 25, wallColors[5]);

// ---------- MARCHÉ ----------

function createStall(x, z, color) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);

  const wood = mat(0x754a2e);
  const canopy = mat(color);

  box(group, 0, 1.2, 0, 4, 0.15, 2.5, wood);
  box(group, 0, 2.7, 0, 4.5, 0.2, 3, canopy);

  for (const px of [-1.9, 1.9]) {
    for (const pz of [-1, 1]) {
      cylinder(group, px, 1.8, pz, 0.08, 1.8, wood);
    }
  }

  scene.add(group);
}

createStall(-12, -2, 0xd94d3f);
createStall(-5, -2, 0xe5bd42);
createStall(9, -2, 0x368b65);

// ---------- ARBRES ----------

function createTree(x, z) {
  const trunk = mat(0x69452b);
  const leaves = mat(0x28663b);

  cylinder(scene, x, 1.4, z, 0.35, 2.8, trunk);

  sphere(scene, x, 3.5, z, 1.8, 2, 1.8, leaves);
  sphere(scene, x - 1, 3, z + 0.4, 1.2, 1.3, 1.2, leaves);
  sphere(scene, x + 1, 3.1, z - 0.4, 1.2, 1.4, 1.2, leaves);
}

[
  [-28, -8], [28, -8], [-28, 13], [28, 13],
  [-35, -22], [35, 25], [-9, 32], [10, 35]
].forEach(p => createTree(p[0], p[1]));

// ---------- TERRAIN DE FOOTBALL ----------

const field = new THREE.Group();
field.position.set(0, 0.06, 43);

box(field, 0, 0, 0, 32, 0.08, 21, mat(0x3d8746));

const white = mat(0xffffff);

box(field, 0, 0.06, -10.3, 30, 0.035, 0.12, white);
box(field, 0, 0.06, 10.3, 30, 0.035, 0.12, white);
box(field, -15.5, 0.06, 0, 0.12, 0.035, 20.6, white);
box(field, 15.5, 0.06, 0, 0.12, 0.035, 20.6, white);
box(field, 0, 0.06, 0, 0.12, 0.035, 20.6, white);

const centerCircle = new THREE.Mesh(
  new THREE.TorusGeometry(3, 0.06, 8, 40),
  white
);
centerCircle.rotation.x = Math.PI / 2;
centerCircle.position.y = 0.12;
field.add(centerCircle);

scene.add(field);

// ---------- PERSONNAGE ----------

const player = new THREE.Group();
scene.add(player);

const skin = mat(0x75452f);
const skinLight = mat(0x986047);
const shirt = mat(0x2874a6);
const trousers = mat(0x252d3a);
const shoes = mat(0x17191e);
const hair = mat(0x17120f);
const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xffffff });
const black = mat(0x17110f);

const body = new THREE.Group();
player.add(body);

// Torse
const torso = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.39, 0.65, 6, 12),
  shirt
);
torso.position.y = 1.55;
torso.castShadow = true;
body.add(torso);

// Cou
cylinder(body, 0, 2.05, 0, 0.13, 0.25, skin);

// Tête
const head = new THREE.Group();
head.position.y = 2.35;
body.add(head);

sphere(head, 0, 0, 0, 0.34, 0.43, 0.32, skin);

// Cheveux
sphere(head, 0, 0.27, -0.025, 0.35, 0.22, 0.34, hair);

// Oreilles
sphere(head, -0.34, 0, 0, 0.09, 0.13, 0.09, skinLight);
sphere(head, 0.34, 0, 0, 0.09, 0.13, 0.09, skinLight);

// Yeux
for (const side of [-1, 1]) {
  sphere(head, side * 0.13, 0.07, 0.285, 0.055, 0.065, 0.035, eyeWhite);
  sphere(head, side * 0.13, 0.07, 0.316, 0.025, 0.035, 0.018, black);
}

// Nez
sphere(head, 0, -0.035, 0.34, 0.065, 0.09, 0.09, skinLight);

// Bouche
const mouth = new THREE.Mesh(
  new THREE.BoxGeometry(0.11, 0.025, 0.025),
  mat(0x48221e)
);
mouth.position.set(0, -0.19, 0.31);
head.add(mouth);

// Membres articulés
function makeLimb(parent, x, y, upperLength, lowerLength, material) {
  const pivot = new THREE.Group();
  pivot.position.set(x, y, 0);
  parent.add(pivot);

  const upper = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.115, upperLength - 0.2, 4, 8),
    material
  );
  upper.position.y = -upperLength / 2;
  upper.castShadow = true;
  pivot.add(upper);

  const joint = new THREE.Group();
  joint.position.y = -upperLength;
  pivot.add(joint);

  sphere(joint, 0, 0, 0, 0.12, 0.12, 0.12, skin);

  const lower = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.09, lowerLength - 0.18, 4, 8),
    material
  );
  lower.position.y = -lowerLength / 2;
  lower.castShadow = true;
  joint.add(lower);

  return { pivot, joint };
}

// Bras
const leftArm = makeLimb(body, -0.48, 1.85, 0.48, 0.48, skin);
const rightArm = makeLimb(body, 0.48, 1.85, 0.48, 0.48, skin);

// Mains
sphere(leftArm.joint, 0, -0.48, 0, 0.12, 0.15, 0.12, skin);
sphere(rightArm.joint, 0, -0.48, 0, 0.12, 0.15, 0.12, skin);

// Jambes
const leftLeg = makeLimb(body, -0.19, 1.08, 0.53, 0.53, trousers);
const rightLeg = makeLimb(body, 0.19, 1.08, 0.53, 0.53, trousers);

// Chaussures
box(leftLeg.joint, 0, -0.57, 0.09, 0.2, 0.14, 0.34, shoes);
box(rightLeg.joint, 0, -0.57, 0.09, 0.2, 0.14, 0.34, shoes);

// Position de départ
player.position.set(0, 0, 4);

// ---------- COMMANDES ----------

const keys = {};
let moving = false;
let running = false;
let cameraAngle = 0;
let cameraDistance = 7;
let touchStart = null;

window.addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;
  if (e.key.startsWith('Arrow')) e.preventDefault();
});

window.addEventListener('keyup', e => {
  keys[e.key.toLowerCase()] = false;
});

window.addEventListener('blur', () => {
  for (const key in keys) keys[key] = false;
});

const controls = document.createElement('div');
controls.id = 'mobileControls';
controls.innerHTML = `
  <div class="directionPad">
    <button data-dir="up">▲</button>
    <div>
      <button data-dir="left">◀</button>
      <button data-dir="down">▼</button>
      <button data-dir="right">▶</button>
    </div>
  </div>
  <button id="runButton">COURIR</button>
`;
document.body.appendChild(controls);

const controlStyle = document.createElement('style');
controlStyle.textContent = `
  #mobileControls {
    position:fixed; inset:auto 12px 18px 12px;
    z-index:20; display:flex;
    align-items:flex-end; justify-content:space-between;
    pointer-events:none;
  }
  .directionPad, #runButton { pointer-events:auto; }
  .directionPad { display:flex; flex-direction:column; align-items:center; gap:5px; }
  .directionPad div { display:flex; gap:5px; }
  .directionPad button, #runButton {
    width:48px; height:48px; border:1px solid #ffffff66;
    border-radius:13px; color:white; background:#142d25cc;
    font-size:20px; touch-action:none;
  }
  #runButton { width:90px; font-size:12px; font-weight:bold; }
  #mobileControls button.active { background:#bc7b35; }
  @media (min-width:800px) {
    #mobileControls { opacity:0.65; }
  }
`;
document.head.appendChild(controlStyle);

const touchDirections = {};

document.querySelectorAll('[data-dir]').forEach(button => {
  const dir = button.dataset.dir;

  button.addEventListener('pointerdown', e => {
    e.preventDefault();
    touchDirections[dir] = true;
    button.classList.add('active');
    button.setPointerCapture(e.pointerId);
  });

  const release = () => {
    touchDirections[dir] = false;
    button.classList.remove('active');
  };

  button.addEventListener('pointerup', release);
  button.addEventListener('pointercancel', release);
  button.addEventListener('lostpointercapture', release);
});

const runButton = document.querySelector('#runButton');

runButton.addEventListener('pointerdown', e => {
  e.preventDefault();
  running = true;
  runButton.classList.add('active');
});

['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => {
  runButton.addEventListener(type, () => {
    running = false;
    runButton.classList.remove('active');
  });
});

// Faire tourner la caméra en faisant glisser le doigt
renderer.domElement.addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  touchStart = { x: e.clientX, y: e.clientY };
});

window.addEventListener('pointermove', e => {
  if (!touchStart) return;

  const dx = e.clientX - touchStart.x;
  cameraAngle -= dx * 0.006;

  touchStart = { x: e.clientX, y: e.clientY };
});

window.addEventListener('pointerup', () => {
  touchStart = null;
});

renderer.domElement.addEventListener('wheel', e => {
  cameraDistance = THREE.MathUtils.clamp(
    cameraDistance + e.deltaY * 0.008, 4, 12
  );
});

// ---------- DÉPLACEMENT ET ANIMATION ----------

const clock = new THREE.Clock();
let walkTime = 0;

function updatePlayer(delta) {
  const forward =
    (keys['z'] || keys['w'] || keys['arrowup'] || touchDirections.up ? 1 : 0) -
    (keys['s'] || keys['arrowdown'] || touchDirections.down ? 1 : 0);

  const sideways =
    (keys['d'] || keys['arrowright'] || touchDirections.right ? 1 : 0) -
    (keys['q'] || keys['a'] || keys['arrowleft'] || touchDirections.left ? 1 : 0);

  const direction = new THREE.Vector3(sideways, 0, -forward);

  moving = direction.lengthSq() > 0;

  if (moving) {
    direction.normalize();

    const speed = running ? 7 : 3.5;
    const angle = Math.atan2(direction.x, direction.z);

    player.rotation.y = angle;
    player.position.x += Math.sin(angle) * speed * delta;
    player.position.z += Math.cos(angle) * speed * delta;

    // Limites provisoires de la zone
    player.position.x = THREE.MathUtils.clamp(player.position.x, -55, 55);
    player.position.z = THREE.MathUtils.clamp(player.position.z, -55, 55);

    walkTime += delta * (running ? 12 : 7);
  }

  const swing = moving ? Math.sin(walkTime) * 0.55 : 0;

  leftArm.pivot.rotation.x = swing;
  rightArm.pivot.rotation.x = -swing;

  leftLeg.pivot.rotation.x = -swing;
  rightLeg.pivot.rotation.x = swing;

  leftArm.joint.rotation.x = moving ? -0.15 : 0;
  rightArm.joint.rotation.x = moving ? -0.15 : 0;

  body.position.y = moving
    ? Math.abs(Math.sin(walkTime * 2)) * 0.035
    : 0;
}

// ---------- CAMÉRA TROISIÈME PERSONNE ----------

function updateCamera() {
  const target = new THREE.Vector3(
    player.position.x,
    player.position.y + 1.6,
    player.position.z
  );

  const cameraX = target.x + Math.sin(cameraAngle) * cameraDistance;
  const cameraZ = target.z + Math.cos(cameraAngle) * cameraDistance;

  const desired = new THREE.Vector3(
    cameraX,
    target.y + 3,
    cameraZ
  );

  camera.position.lerp(desired, 0.12);
  camera.lookAt(target);
}

// ---------- BOUCLE PRINCIPALE ----------

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);

  updatePlayer(delta);
  updateCamera();

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
});

// ---------- DÉMARRAGE ----------

camera.position.set(0, 5, 12);
camera.lookAt(0, 1, 0);

animate();

if (loading) loading.remove();

if (message) {
  message.textContent = 'Bienvenue à MWANGAZA ! Explore ton quartier.';
}

console.log('MBOKA LIFE : moteur 3D démarré.');

