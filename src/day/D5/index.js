import React, { Component } from 'react';
import * as THREE from 'three';
import initThree from '../../utils/initThree';
import FBO from '../../utils/fbo';
import { spherePoints } from '../../utils/points';

import Title from '../../components/Title';
import Footer from '../../components/Footer';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

class D5 extends Component {
	componentDidMount() {
		// init three
		const { stats, renderer, scene, controls } = initThree(this.canvas, {
			axisHelper: false,
		});
		const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1);
		this.renderer = renderer;
		this.stats = stats;

		// shader material
		// uniforms : the same for each vertice during ONE render loop
		const uniforms = {
			resolution: {
				type: 'v2',
				value: new THREE.Vector2(window.innerWidth, window.innerHeight),
			},
			time: { type: 'f', value: 0 },
		};
		const shaderMaterial = new THREE.ShaderMaterial({
			uniforms,
			vertexShader,
			fragmentShader,
			transparent: true,
		});

		const geometry = new THREE.BufferGeometry();
		geometry.addAttribute(
			'position',
			new THREE.BufferAttribute(
				new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]),
				3
			)
		);
		const mesh = new THREE.Mesh(geometry, shaderMaterial);
		scene.add(mesh);

		const animate = timestamp => {
			this.rafID = requestAnimationFrame(animate);
			stats.begin();
			// update the time uniform
			uniforms.time.value += 0.005;
			renderer.render(scene, camera);
			stats.end();
		};
		animate();
	}

	componentWillUnmount() {
		this.renderer.dispose();
		this.canvas.outerHTML = '';
		this.stats.domElement.outerHTML = '';
		delete this.canvas;
		delete this.stats.domElement;
		window.cancelAnimationFrame(this.rafID);
	}

	render() {
		return (
			<div>
				<Title
					title="Shiny squared metaballs, ray marching"
					url="http://jamie-wong.com/2016/07/15/ray-marching-signed-distance-functions/"
				/>
				<canvas
					id="canvas"
					ref={canvas => {
						this.canvas = canvas;
					}}
				/>
				<Footer />
			</div>
		);
	}
}

export default D5;
