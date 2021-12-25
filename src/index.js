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
// const cylinder = utils.getCylinder(5, 100, 1, [1, 2, 3]);

const pendulum1 = getPendulum(5, 50, 0xffffff, [-30, 30, 0]);
const pendulum2 = getPendulum(5, 50, 0xffffff, [-20, 30, 0]);
const pendulum3 = getPendulum(5, 50, 0xffffff, [-10, 30, 0]);
const pendulum4 = getPendulum(5, 50, 0xffffff, [0, 30, 0]);
const pendulum5 = getPendulum(5, 50, 0xffffff, [10, 30, 0]);

scene.add(pendulum1, pendulum2, pendulum3, pendulum4, pendulum5);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
utils.addEvents(renderer, camera, pivot, { startCameraPos, lookAt });
animate();
