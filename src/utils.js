import * as THREE from "three";
import getImgs from "./textures";

const addEvents = (renderer, camera, pivot, startPos) => {
  let press = false;
  renderer.domElement.addEventListener("mousemove", (event) => {
    if (!press) {
      return;
    }
    const sensitivity = 0.01;

    pivot.rotation.x -= event.movementY * sensitivity;
    pivot.rotation.y -= event.movementX * sensitivity;
  });
  renderer.domElement.addEventListener("mousedown", (event) => {
    press = true;
  });
  renderer.domElement.addEventListener("mouseup", (event) => {
    press = false;
  });
  renderer.domElement.addEventListener("mouseleave", (event) => {
    press = false;
  });
  renderer.domElement.addEventListener("wheel", (event) => {
    const direction = event.wheelDelta;
    const sensitivity = 10;
    if (direction > 0) {
      camera.position.z -= sensitivity;
    } else {
      camera.position.z += sensitivity;
    }
  });
  renderer.domElement.addEventListener("dblclick", (event) => {
    const { startCameraPos, lookAt } = startPos;
    const { x, y, z } = startCameraPos;
    pivot.rotation.set(0, 0, 0);
    pivot.position.set(0, 0, 0);
    camera.lookAt(lookAt);
    camera.position.set(x, y, z);
  });
  //why key event dont work?
  document.addEventListener("keyPress", (event) => {
    document.querySelector(".lights").innerHTML = "<button>xD</button>";
  });
};

const getTexture = (index) => {
  const image = new Image();
  image.src = getImgs(index);
  const texture = new THREE.Texture();
  texture.image = image;
  image.onload = function () {
    texture.needsUpdate = true;
  };
  return texture;
};

const drawLine = (color, points) => {
  const material = new THREE.LineBasicMaterial({ color });
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  return line;
};

const getBall = (radius, color, [x, y, z] = [0, 0, 0]) => {
  const geometry = new THREE.SphereGeometry(radius, 32, 16);
  const material = new THREE.MeshPhongMaterial({
    color
  });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(x, y, z);
  return sphere;
};

const getCylinder = (radius, height, color, [x, y, z]) => {
  const geometry = new THREE.CylinderGeometry(radius, radius, height, 32, 16);
  const material = new THREE.MeshPhongMaterial({
    color: color
  });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(x, y, z);
  return sphere;
};

const getBox = (width, height, depth, textureNum) => {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshStandardMaterial({
    map: getTexture(textureNum)
  });
  const cube = new THREE.Mesh(geometry, material);
  return cube;
};

export { addEvents, getTexture, getBall, getCylinder, getBox, drawLine };
