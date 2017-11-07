import * as THREE from 'three';
import 'three/examples/js/controls/OrbitControls';
import Stats from 'stats.js';

const initThree = (canvas, opts) => {
	// default opts
	const defaults = {
		renderer: {
			alpha: true,
		},
		camera: {
			fov: 75,
			nearPlane: 0.1,
			farPlane: 1000,
			x: 0,
			y: 2,
			z: 20,
		},
		axisHelper: true,
	};
	// merged opts
	const mergedOpts = Object.assign({}, defaults, opts);
	// stats
	const stats = new Stats();
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.top = '';
	document.body.appendChild(stats.domElement);

	// renderer
	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: mergedOpts.renderer.alpha,
		canvas,
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.top = '0px';
	renderer.domElement.style.left = '0px';
	document.body.appendChild(renderer.domElement);

	// scene
	const scene = new THREE.Scene();

	// camera
	const camera = new THREE.PerspectiveCamera(
		mergedOpts.camera.fov,
		window.innerWidth / window.innerHeight,
		mergedOpts.camera.nearPlane,
		mergedOpts.camera.farPlane
	);
	camera.position.x = mergedOpts.camera.x;
	camera.position.y = mergedOpts.camera.y;
	camera.position.z = mergedOpts.camera.z;

	// controls
	const controls = new THREE.OrbitControls(camera, renderer.domElement);

	// axis helper
	const axisHelper = new THREE.AxisHelper(50);
	if (mergedOpts.axisHelper) scene.add(axisHelper);

	// ambient light
	const ambient = new THREE.AmbientLight(0xffffff);
	scene.add(ambient);

	// directional light
	const directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(camera.position);
	directionalLight.position.z = camera.position.z * 2;
	scene.add(directionalLight);

	const handleResize = () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	};
	addEventListener('resize', handleResize);

	return { stats, renderer, scene, camera, controls };
};

export default initThree;
