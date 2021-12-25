import * as THREE from "three";
import * as utils from "./utils";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
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
    0x00ff00,
    [...start, ...end].map((x) => new THREE.Vector3(x))
  );
  const pendulum = new THREE.Group();
  pendulum.add(line, ball);
  return pendulum;
}
// const cylinder = utils.getCylinder(5, 100, 1, [1, 2, 3]);

const pendulum1 = getPendulum(5, 10, 0xffffff);

scene.add(pendulum1);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
}
utils.addEvents(renderer, camera, pivot);
animate();
