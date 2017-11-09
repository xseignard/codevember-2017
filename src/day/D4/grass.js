import * as THREE from 'three';

export const createGrass = (material, size, amount) => {
	const group = new THREE.Group();
	for (let i = 0; i < amount; i++) {
		const h = Math.random() * 0.7 + 1;
		const geometry = new THREE.PlaneGeometry(0.1, h, 5, 5);
		geometry.vertices.forEach(v => {
			if (Math.random() > 0.5) v.x += Math.random() * 0.05;
		});
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();
		const plane = new THREE.Mesh(geometry, material);
		const x = (Math.random() * 2 - 1) * size;
		const z = (Math.random() * 2 - 1) * size;
		plane.position.set(x, h / 2, z);
		if (Math.random() > 0.5) plane.rotation.y = Math.PI / 3;
		group.add(plane);
		group.traverse(m => (m.castShadow = true));
	}
	return group;
};
