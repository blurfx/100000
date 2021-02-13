const MAX_POINTS = 1e4;

const cursor = new THREE.Vector3();

let numPoints = 0;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
camera.position.set(0, 0, 1);

const scene = new THREE.Scene();

const material = new THREE.LineBasicMaterial({ color: 0xdddddd });

const geometry = new THREE.BufferGeometry();

const positions = new Float32Array(MAX_POINTS * 3);
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const line = new THREE.Line(geometry, material);

scene.add(line);

// DOM Events
const calcDistance = ({x, y}) => {
  const dist = Math.sqrt(
    Math.pow(positions[(numPoints - 1) * 3] - x, 2) +
      Math.pow(positions[(numPoints - 1) * 3 + 1] - y, 2)
  );
  return dist;
}

const onMousemove = (e) => {
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  const y = -(e.clientY / window.innerHeight) * 2 + 1;
  cursor.x = x;
  cursor.y = y;
  cursor.z = 0;
  cursor.unproject(camera);

  const dist = calcDistance({
    x: cursor.x,
    y: cursor.y,
  });
  
  if (numPoints === 0 || (dist >= 0.07)) {
    positions[numPoints * 3] = cursor.x;
    positions[numPoints * 3 + 1] = cursor.y;
    positions[numPoints * 3 + 2] = cursor.z;
    numPoints += 1;
    
    line.geometry.setDrawRange(0, numPoints);
    line.geometry.attributes.position.needsUpdate = true;
  }
};

document.addEventListener('mousemove', onMousemove);

// raf
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
