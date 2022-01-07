import * as THREE from "three";
import getImgs from "./textures";

const addEvents = (renderer, camera, pivot, startPos, keys = {}) => {
  let press = false;
  renderer.domElement.addEventListener("mousemove", (event) => {
    const sensitivity = 0.01;
    if (!press) {
      return;
    }
    if (keys.q) {
      pivot.rotation.x -= event.movementY * sensitivity;
      pivot.rotation.y -= event.movementX * sensitivity;
    } else {
      camera.rotation.x += event.movementY * 0.3 * sensitivity;
      camera.rotation.y += event.movementX * 0.3 * sensitivity;
    }
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
      camera.translateZ(-sensitivity);
    } else {
      camera.translateZ(sensitivity);
    }
  });
  renderer.domElement.addEventListener("dblclick", (event) => {
    const { startCameraPos, lookAt } = startPos;
    const { x, y, z } = startCameraPos;
    pivot.rotation.set(0, 0, 0);
    pivot.position.set(0, 0, 0);
    camera.position.set(x, y, z);
    camera.rotation.set(0, 0, 0);
    camera.lookAt(lookAt);
  });
  const cameraMovement = () => {
    for (const x in keys) {
      if (keys[x]) {
        switch (x) {
          case "a":
            camera.translateX(-3);
            break;
          case "d":
            camera.translateX(3);
            break;
          case "w":
            camera.translateZ(-3);
            break;
          case "s":
            camera.translateZ(3);
            break;
          default:
          //do nothing
        }
      }
    }
  };
  document.addEventListener(
    "keydown",
    (e) => {
      keys[e.key] = true;
      cameraMovement();
    },
    false
  );
  document.addEventListener(
    "keyup",
    (e) => {
      keys[e.key] = false;
    },
    false
  );
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
  sphere.castShadow = true;
  return sphere;
};

const getCylinder = (radius, height, color, [x, y, z]) => {
  const geometry = new THREE.CylinderGeometry(radius, radius, height, 32, 16);
  const material = new THREE.MeshPhongMaterial({
    color: color
  });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(x, y, z);
  sphere.castShadow = true;
  return sphere;
};

const getBox = (width, height, depth, textureNum) => {
  const geometry = new THREE.BoxGeometry(width, height, depth, 100, 100);
  const material = new THREE.MeshStandardMaterial({
    map: getTexture(textureNum)
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.receiveShadow = true;
  return cube;
};

const getLamp = () => {
  //TODO add here light and change Box geometry to something like lamp
  const geometry = new THREE.CylinderGeometry(2, 4, 6, 100, 100);
  const material = new THREE.MeshStandardMaterial({
    color: 0xfefefe
  });
  const lamp = new THREE.Mesh(geometry, material);
  // lamp.receiveShadow = true;
  lamp.castShadow = true;
  const light = new THREE.PointLight(0xffffff, 2, 200);
  lamp.add(light);
  return lamp;
};

export {
  addEvents,
  getTexture,
  getBall,
  getCylinder,
  getBox,
  drawLine,
  getLamp
};
