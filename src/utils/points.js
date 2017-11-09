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
export const spherePoints = (width, height, size, alpha) => {
	const dimension = alpha ? 4 : 3;
	const len = width * height * dimension;
	const data = new Float32Array(len);
	const p = new THREE.Vector3();
	for (let i = 0; i < len; i += dimension) {
		getPoint(p, size);
		data[i] = p.x;
		data[i + 1] = p.y;
		data[i + 2] = p.z;
		// keep track of some sort of vertice index
		if (alpha) data[i + 3] = i;
	}
	return data;
};

export const imagePoints = (image, width, height, elevation) => {
	const img = new Image();
	img.src = image;
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0);

	const imgData = ctx.getImageData(0, 0, width, height);
	const iData = imgData.data;

	const l = width * height;
	const data = new Float32Array(l * 3);
	for (let i = 0; i < l; i++) {
		const i3 = i * 3;
		const i4 = i * 4;
		data[i3] = ((i % width) / width - 0.5) * width;
		data[i3 + 1] =
			(iData[i4] / 0xff * 0.299 +
				iData[i4 + 1] / 0xff * 0.587 +
				iData[i4 + 2] / 0xff * 0.114) *
			elevation;
		data[i3 + 2] = (i / width / height - 0.5) * height;
	}
	return data;
};
