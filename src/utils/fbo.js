import * as THREE from 'three';

// see: http://barradeau.com/blog/?p=621

class FBO {
	constructor(width, height, renderer, simulationMaterial, renderMaterial, format) {
		this.scene = new THREE.Scene();
		this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1);

		const options = {
			minFilter: THREE.NearestFilter, // important as we want to sample square pixels
			magFilter: THREE.NearestFilter,
			format: format || THREE.RGBFormat, // could be RGBAFormat
			type: THREE.FloatType, // important as we need precise coordinates (not ints)
		};
		this.rtt = new THREE.WebGLRenderTarget(width, height, options);

		// 5 the simulation:
		// create a bi-unit quadrilateral and uses the simulation material to update the Float Texture
		const geom = new THREE.BufferGeometry();
		geom.addAttribute(
			'position',
			new THREE.BufferAttribute(
				new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]),
				3
			)
		);
		geom.addAttribute(
			'uv',
			new THREE.BufferAttribute(new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]), 2)
		);
		this.scene.add(new THREE.Mesh(geom, simulationMaterial));

		// 6 the particles:
		// create a vertex buffer of size width * height with normalized coordinates
		const l = width * height;
		const vertices = new Float32Array(l * 3);
		for (let i = 0; i < l; i++) {
			const i3 = i * 3;
			vertices[i3] = (i % width) / width;
			vertices[i3 + 1] = i / width / height;
		}

		// create the particles geometry
		const geometry = new THREE.BufferGeometry();
		geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));

		// the rendermaterial is used to render the particles
		this.particles = new THREE.Points(geometry, renderMaterial);
		this.renderer = renderer;
	}

	// 7 update loop
	update() {
		// 1 update the simulation and render the result in a target texture
		this.renderer.render(this.scene, this.camera, this.rtt, true);
		// 2 use the result of the swap as the new position for the particles' renderer
		this.particles.material.uniforms.positions.value = this.rtt;
	}
}

export default FBO;
