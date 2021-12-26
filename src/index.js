import * as THREE from "three";
import * as utils from "./utils";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const startCameraPos = { x: 0, y: 0, z: 100 };
const lookAt = new THREE.Vector3(0, 0, 0);
camera.position.z = startCameraPos.z;
camera.lookAt(lookAt);
const pivot = new THREE.Group();
pivot.position.set(0, 0, 0);
pivot.add(camera);
scene.add(pivot);

//lights
let isHemisphere = false;
const hemisphereLight = new THREE.HemisphereLight(0xff0054, 0x0808fe, 1);
const pointsLights = [1, 1, 1, 1, 1, 1].map(
  (e) => new THREE.PointLight(0xffffff, 2, 200)
);
pointsLights.forEach((e) => {
  e.castShadow = true;
});
pointsLights[0].position.set(100, 120, 0);
pointsLights[1].position.set(50, 150, 0);
pointsLights[2].position.set(-50, 150, 0);
pointsLights[3].position.set(-100, 120, 0);
pointsLights[4].position.set(0, 50, 150);
pointsLights[5].position.set(0, 50, -150);
scene.add(...pointsLights);
document.querySelector(".btn").addEventListener("click", (event) => {
  if (isHemisphere) {
    scene.remove(hemisphereLight);
    scene.add(...pointsLights);
    event.target.innerText = "hemisphere";
  } else {
    scene.remove(...pointsLights);
    scene.add(hemisphereLight);
    event.target.innerText = "point";
  }
  isHemisphere = !isHemisphere;
});

//spotLight or directionalLight - testing other
// const light = new THREE.DirectionalLight(0xffffff, 0.7);
// const light = new THREE.SpotLight(0xffffff, 2, 300);
// light.position.set(5, 150, 5);
// light.castShadow = true;
// scene.add(light);

//helpers for lights (show range)
// const helpers = pointsLights
//   .map((l) => new THREE.CameraHelper(l.shadow.camera))
//   .filter((h, i) => i === 0);
// scene.add(...helpers);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

//start creating Newton's cradle
function getPendulum(radius, height, width, color, [x, y, z] = [0, 0, 0]) {
  const start = [x, y, z - width];
  const ballXYZ = [x, y - height, z];
  const mid = [x, y - height + radius, z];
  const end = [x, y, z + width];
  const ball = utils.getBall(radius, { color: 0xffaabb }, ballXYZ);
  const line = utils.drawLine(
    color,
    [start, mid, end].map((e) => new THREE.Vector3(...e))
  );
  const pendulum = new THREE.Group();
  pendulum.add(line, ball);
  return pendulum;
}
const ramR = 1,
  ballR = 5,
  penLen = 40,
  penWidth = 30,
  ramZ = penLen / 2,
  // ramTexture = 1,
  uLen = 12 * ballR,
  uLenHalf = uLen / 2,
  linesColor = 0xffffff,
  ramsColor = { color: 0x0f0f0f };
const u1 = utils.getCylinder(ramR, uLen, ramsColor, [0, penWidth, -ramZ]);
u1.rotation.set(0, 0, Math.PI / 2);
const u2 = utils.getCylinder(ramR, uLen, ramsColor, [0, penWidth, ramZ]);
u2.rotation.set(0, 0, Math.PI / 2);
const v1 = utils.getCylinder(ramR, uLen, ramsColor, [-uLenHalf, 0, -ramZ]);
const v2 = utils.getCylinder(ramR, uLen, ramsColor, [uLenHalf, 0, ramZ]);
const v3 = utils.getCylinder(ramR, uLen, ramsColor, [uLenHalf, 0, -ramZ]);
const v4 = utils.getCylinder(ramR, uLen, ramsColor, [-uLenHalf, 0, ramZ]);
const b1 = utils.getBall(ramR, ramsColor, [uLenHalf, uLenHalf, -ramZ]);
const b2 = utils.getBall(ramR, ramsColor, [uLenHalf, uLenHalf, ramZ]);
const b3 = utils.getBall(ramR, ramsColor, [-uLenHalf, uLenHalf, ramZ]);
const b4 = utils.getBall(ramR, ramsColor, [-uLenHalf, uLenHalf, -ramZ]);

const floor = utils.getBox(uLen + 20, 5, uLen + 10, 2);
floor.position.set(0, -uLen / 2, 0);
floor.receiveShadow = true;

scene.add(u1, u2, v1, v2, v3, v4, b1, b2, b3, b4, floor);

//pendulums
const pen1 = getPendulum(ballR, penLen, ramZ, linesColor, [-20, 30, 0]);
const pen2 = getPendulum(ballR, penLen, ramZ, linesColor, [-10, 30, 0]);
const pen3 = getPendulum(ballR, penLen, ramZ, linesColor, [0, 30, 0]);
const pen4 = getPendulum(ballR, penLen, ramZ, linesColor, [10, 30, 0]);
const pen5 = getPendulum(ballR, penLen, ramZ, linesColor, [20, 30, 0]);

scene.add(pen1, pen2, pen3, pen4, pen5);

//pivots for pendulums animations
const pivotPen1 = new THREE.Object3D(pen1);
pivotPen1.position.set(0, 0, 0);

let angle = 0;
function animate() {
  requestAnimationFrame(animate);
  pivotPen1.rotation.set(0, 0, ++angle);
  renderer.render(scene, camera);
}
utils.addEvents(renderer, camera, pivot, { startCameraPos, lookAt });
animate();
