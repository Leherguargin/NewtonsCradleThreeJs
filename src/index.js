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

//light
// const light = new THREE.AmbientLight();
// const light = new THREE.DirectionalLight(0xffffff, 0.5);
// const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
const light = new THREE.SpotLight(0xffffff, 2, 300);
light.position.set(0, 150, 0);
light.castShadow = true;
scene.add(light);

// const lights = [1, 1, 1, 1, 1, 1].map(
//   (e) => new THREE.PointLight(0xffffff, 2, 200)
// );
// lights.forEach((e) => (e.castShadow = true));
// lights[0].position.set(100, 120, 0);
// lights[1].position.set(50, 150, 0);
// lights[2].position.set(-50, 150, 0);
// lights[3].position.set(-100, 120, 0);
// lights[4].position.set(0, 50, 150);
// lights[5].position.set(0, 50, -150);
// scene.add(...lights);

//Create a plane that receives shadows (but does not cast them)
const planeGeometry = new THREE.PlaneGeometry(200, 200, 32, 32);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xfffff0 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.rotation.set(-Math.PI / 2, 0, 0);
plane.position.set(0, -20, 0);
scene.add(plane);

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

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  pivotPen1.rotation.z = Math.PI / 6;
}
utils.addEvents(renderer, camera, pivot, { startCameraPos, lookAt });
animate();
