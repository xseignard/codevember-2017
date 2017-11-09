import React, { Component } from 'react';
import * as THREE from 'three';
import initThree from '../../utils/initThree';
import FBO from '../../utils/fbo';
import { spherePoints } from '../../utils/points';

import Title from '../../components/Title';
import Footer from '../../components/Footer';

import simulationVert from './shaders/simulationVert.glsl';
import simulationFrag from './shaders/simulationFrag.glsl';
import renderVert from './shaders/renderVert.glsl';
import renderFrag from './shaders/renderFrag.glsl';

// see http://barradeau.com/blog/?p=621

class D3 extends Component {
	componentDidMount() {
		// init three
		const { stats, renderer, scene, camera, controls } = initThree(this.canvas, {
			axisHelper: false,
			camera: {
				z: 40,
			},
		});
		this.renderer = renderer;
		this.stats = stats;

		const width = 256;
		const height = 256;

		// generate random postions (Float32Array)
		const data = spherePoints(width, height, 20);
		// use them in a texture
		const positions = new THREE.DataTexture(
			data,
			width,
			height,
			THREE.RGBFormat,
			THREE.FloatType
		);
		positions.needsUpdate = true;

		// simulation shader, updates the above texture
		const simulationShader = new THREE.ShaderMaterial({
			uniforms: {
				positions: { type: 't', value: positions },
				timer: { type: 'f', value: 0 },
				frequency: { type: 'f', value: 0.1 },
				amplitude: { type: 'f', value: 10 },
				maxDistance: { type: 'f', value: 15 },
			},
			vertexShader: simulationVert,
			fragmentShader: simulationFrag,
		});

		// render shader to display the particles on screen
		const renderShader = new THREE.ShaderMaterial({
			uniforms: {
				positions: { type: 't', value: null },
			},
			vertexShader: renderVert,
			fragmentShader: renderFrag,
		});

		//init the FBO
		const fbo = new FBO(width, height, renderer, simulationShader, renderShader);
		scene.add(fbo.particles);

		const animate = timestamp => {
			this.rafID = requestAnimationFrame(animate);
			stats.begin();
			fbo.update();
			simulationShader.uniforms.timer.value += 0.01;
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
					title="Slowmo sphere explosion, curl noise"
					url="http://barradeau.com/blog/?p=621"
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

export default D3;
