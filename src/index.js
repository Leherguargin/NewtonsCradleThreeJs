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

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//start creating Newton's cradle
function getPendulum(radius, height, color, [x, y, z] = [0, 0, 0]) {
  const start = [x, y, z];
  const end = [x, y - height, z];
  const ball = utils.getBall(radius, 0, end);
  const line = utils.drawLine(
    color,
    [start, end].map((e) => new THREE.Vector3(...e))
  );
  const pendulum = new THREE.Group();
  pendulum.add(line, ball);
  return pendulum;
}
const ramR = 1,
  ballR = 5,
  pendulumLen = 40,
  ramZ = pendulumLen / 2,
  ramTexture = 1,
  uLen = 12 * ballR,
  uLenHalf = uLen / 2,
  linesColor = 0xffffff;
const u1 = utils.getCylinder(ramR, uLen, ramTexture, [0, 30, -ramZ]);
u1.rotation.set(0, 0, Math.PI / 2);
const u2 = utils.getCylinder(ramR, uLen, 1, [0, 30, ramZ]);
u2.rotation.set(0, 0, Math.PI / 2);
const v1 = utils.getCylinder(ramR, uLen, 1, [-uLenHalf, 0, -ramZ]);
const v2 = utils.getCylinder(ramR, uLen, 1, [uLenHalf, 0, ramZ]);
const v3 = utils.getCylinder(ramR, uLen, 1, [uLenHalf, 0, -ramZ]);
const v4 = utils.getCylinder(ramR, uLen, 1, [-uLenHalf, 0, ramZ]);
const b1 = utils.getBall(ramR, ramTexture, [uLenHalf, uLenHalf, -ramZ]);
const b2 = utils.getBall(ramR, ramTexture, [uLenHalf, uLenHalf, ramZ]);
const b3 = utils.getBall(ramR, ramTexture, [-uLenHalf, uLenHalf, ramZ]);
const b4 = utils.getBall(ramR, ramTexture, [-uLenHalf, uLenHalf, -ramZ]);

const floor = utils.getBox(uLen + 20, 5, uLen + 10, 2);
floor.position.set(0, -uLen / 2, 0);

scene.add(u1, u2, v1, v2, v3, v4, b1, b2, b3, b4, floor);

const pendulum1 = getPendulum(ballR, pendulumLen, linesColor, [-20, 30, 0]);
const pendulum2 = getPendulum(ballR, pendulumLen, linesColor, [-10, 30, 0]);
const pendulum3 = getPendulum(ballR, pendulumLen, linesColor, [0, 30, 0]);
const pendulum4 = getPendulum(ballR, pendulumLen, linesColor, [10, 30, 0]);
const pendulum5 = getPendulum(ballR, pendulumLen, linesColor, [20, 30, 0]);

scene.add(pendulum1, pendulum2, pendulum3, pendulum4, pendulum5);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
utils.addEvents(renderer, camera, pivot, { startCameraPos, lookAt });
animate();
