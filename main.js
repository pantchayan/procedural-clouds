import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.19.0/+esm';

var loader = new THREE.TextureLoader();
var backgroundTexture = loader.load('sky.jpg');

let sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}
let aspectRatio = sizes.width / sizes.height;

const canvas = document.querySelector('canvas.webgl');

const scene = new THREE.Scene();
scene.background = backgroundTexture;

let cloudGroup;
let makeCloud = (obj) => {
    const typeOfGeometry = obj.typeOfGeometry;
    const numberOfGeometries = obj.numberOfGeometries;
    const scaleRangeBottom = obj.scaleRangeBottom;
    const scaleRangeTop = obj.scaleRangeTop;
    const XrotationRange = obj.XrotationRange;
    const YrotationRange = obj.YrotationRange;
    const ZrotationRange = obj.ZrotationRange;
    const positionRange = obj.positionRange;
    const randomizationIntensity = obj.randomizationIntensity;


    cloudGroup = new THREE.Group();
    let geometry;
    if (typeOfGeometry === 'Cube') {
        geometry = new THREE.BoxGeometry(1, 1, 1);
    }
    else if (typeOfGeometry === 'Icosahedron') {
        geometry = new THREE.IcosahedronGeometry(1, 0);
    }

    for (let i = 0; i < numberOfGeometries; i++) {
        let randomizeBy = randomizationIntensity === 0 ? 1 : Math.random() * randomizationIntensity;
        let currMesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 'white' }));
        currMesh.position.x = i * positionRange;
        currMesh.rotation.x = randomizeBy * XrotationRange;
        currMesh.rotation.y = randomizeBy * YrotationRange;
        currMesh.rotation.z = randomizeBy * ZrotationRange;
        let scaleRandom = randomizeBy;
        let scaleFactor = scaleRangeBottom + (scaleRandom * (scaleRangeTop));
        currMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
        cloudGroup.add(currMesh);
    }
    cloudGroup.name = 'Cloud';
    cloudGroup.position.x = -1 * (numberOfGeometries) / 2;
    scene.add(cloudGroup);
    return cloudGroup;
}

let generateNewCloud = () => {
    scene.remove(cloudGroup);
    makeCloud(obj);
}

// let addMoreClouds = () => {
//     cloudGroup
//     makeCloud(obj.numberOfGeometries, obj.scaleRangeBottom, obj.scaleRangeTop, obj.XrotationRange, obj.YrotationRange, obj.ZrotationRange, obj.positionRange, obj.randomizationIntensity)
// }


let obj = {
    typeOfGeometry: 'Cube',
    numberOfGeometries: 5,
    scaleRangeBottom: 0.25,
    scaleRangeTop: 1,
    positionRange: 1,
    XrotationRange: Math.PI * 2,
    YrotationRange: Math.PI * 2,
    ZrotationRange: Math.PI * 2,
    randomizationIntensity: 1,
    generateNewCloud
}

makeCloud(obj);

let gui = new GUI();

gui.add(document, 'title');

gui.add(obj, 'typeOfGeometry', ['Cube', 'Icosahedron']).onFinishChange(generateNewCloud);


gui.add(obj, 'numberOfGeometries')
    .min(1)
    .max(20)
    .step(1)
    .onFinishChange(generateNewCloud);

gui.add(obj, 'scaleRangeBottom').min(0).max(3).step(0.1).onFinishChange(generateNewCloud);
gui.add(obj, 'scaleRangeTop').min(0).max(3).step(0.1).onFinishChange(generateNewCloud);
gui.add(obj, 'positionRange').min(0).max(3).step(0.1).onFinishChange(generateNewCloud);
gui.add(obj, 'XrotationRange').min(-Math.PI * 2).max(Math.PI * 2).step(0.1).onFinishChange(generateNewCloud);
gui.add(obj, 'YrotationRange').min(-Math.PI * 2).max(Math.PI * 2).step(0.1).onFinishChange(generateNewCloud);
gui.add(obj, 'ZrotationRange').min(-Math.PI * 2).max(Math.PI * 2).step(0.1).onFinishChange(generateNewCloud);
gui.add(obj, 'randomizationIntensity').min(0).max(1).step(0.1).onFinishChange(generateNewCloud)
gui.add(obj, 'generateNewCloud')

// let axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

let ambientLight = new THREE.AmbientLight('white', 1);
scene.add(ambientLight);

let directionalLight = new THREE.DirectionalLight('white', 6);
directionalLight.position.z = 10;
directionalLight.position.y = 2;
scene.add(directionalLight);

let camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 100);
camera.position.z = 10;
camera.position.y = 2;
camera.position.x = 3;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.01;

window.addEventListener('resize', () => {
    sizes.height = window.innerHeight;
    sizes.width = window.innerWidth;

    renderer.setSize(sizes.width, sizes.height);
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
})



let clock = new THREE.Clock();

let animation = () => {
    // let deltaTimeSinceBeginning = clock.elapsedTime();
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animation);
}

animation()
