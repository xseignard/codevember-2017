import * as THREE from 'three';

// returns an array of random 3D coordinates inside a -size/+size cube
export const cubePoints = (width, height, size) => {
	let len = width * height * 3;
	const data = new Float32Array(len);
	for (let i = 0; i < len; i++) {
		data[i] = (Math.random() * 2 - 1) * size;
	}
	return data;
};

const getPoint = (v, size) => {
	v.x = Math.random() * 2 - 1;
	v.y = Math.random() * 2 - 1;
	v.z = Math.random() * 2 - 1;
	if (v.length() > 1) return getPoint(v, size);
	return v.normalize().multiplyScalar(size);
};

// returns an array of random 3D coordinates inside a -size/+size diameter sphere
export const spherePoints = (width, height, size) => {
	var len = width * height * 3;
	var data = new Float32Array(len);
	var p = new THREE.Vector3();
	for (var i = 0; i < len; i += 3) {
		getPoint(p, size);
		data[i] = p.x;
		data[i + 1] = p.y;
		data[i + 2] = p.z;
	}
	return data;
};
