import React, { Component } from 'react';
import * as THREE from 'three';
import TweenMax from 'gsap';

import initThree from '../../utils/initThree';

import Title from '../../components/Title';
import Footer from '../../components/Footer';

import Globe from './globe';
import Flux from './flux';
import { getIndex, xyzToLatLon } from './utils';

import texture16 from './img/texture.16.png';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fluxFragment.glsl';

class D6 extends Component {
	componentDidMount() {
		// init three
		const { stats, renderer, scene, camera, controls } = initThree(this.canvas, {
			axisHelper: true,
			camera: {
				nearPlane: 1,
				farPlane: 2000,
				z: 500,
			},
		});
		controls.minDistance = 300;
		controls.maxDistance = 500;
		this.renderer = renderer;
		this.stats = stats;

		const earth = new Globe(200);
		scene.add(earth.planet);

		const mouse = new THREE.Vector2();
		const handleMouseDown = e => {
			mouse.x = event.clientX;
			mouse.y = event.clientY;
		};

		const numberOfPoints = 50;
		const flux = new Flux(earth.planet, numberOfPoints);

		const material = new THREE.LineBasicMaterial({ color: 'red', linewidth: 1 });

		// texture passed to the flux shader
		const textureLoader = new THREE.TextureLoader();
		const shaderTexture = textureLoader.load(texture16);
		shaderTexture.wrapS = THREE.RepeatWrapping;
		shaderTexture.wrapT = THREE.RepeatWrapping;
		shaderTexture.repeat.set(100, 1);

		// manipulated uniforms in the shaders
		const fluxUniforms = {
			color: { type: 'c', value: new THREE.Color(0x242ec5) },
			texture: { type: 't', value: shaderTexture },
			displacement: { type: 'f', value: 0.0 },
		};

		// shader material
		const fluxMaterial = new THREE.ShaderMaterial({
			uniforms: fluxUniforms,
			vertexShader,
			fragmentShader,
			blending: THREE.AdditiveBlending,
			depthTest: true,
			depthWrite: false,
			transparent: true,
		});

		const raycaster = new THREE.Raycaster();
		const home = { latitude: 47.21176, longitude: -1.573 };
		let currentFlux;
		const handleMouseUp = e => {
			e.preventDefault();
			// if the drag is longer than 3 pixels (x and y axis), it's just a drag, not a click
			if (Math.abs(mouse.x - event.clientX) > 3 && Math.abs(mouse.y - event.clientY) > 3) {
				return;
			}
			// mouse coords converted in -1/+1 where center is the center of the window
			mouse.x = e.clientX / window.innerWidth * 2 - 1;
			mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
			raycaster.setFromCamera(mouse, camera);
			// see if the ray from the camera into the world hits the globe
			const intersects = raycaster.intersectObject(earth.planet, true);
			// if there is one (or more) intersections
			if (intersects.length > 0) {
				const position = intersects[0].point;
				const posLatLon = xyzToLatLon(position, earth.planet);
				getIndex(position, earth.planet, index => {
					earth.globeUniforms.clicked.value = index / 255;
					if (index > 0) {
						const fluxGeometry = flux.doubleCubicFlux(
							home.latitude,
							home.longitude,
							posLatLon.lat,
							posLatLon.lon
						);
						scene.remove(currentFlux);
						fluxUniforms.displacement.value = 0.0;
						currentFlux = new THREE.Line(fluxGeometry, fluxMaterial);
						scene.add(currentFlux);
					}
				});
			}
		};
		document.addEventListener('mousedown', handleMouseDown, false);
		document.addEventListener('mouseup', handleMouseUp, false);

		const animate = timestamp => {
			this.rafID = requestAnimationFrame(animate);
			stats.begin();
			fluxUniforms.displacement.value += 0.004;
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
				<Title title="Interactive globe, can be plugged with any geolocalized data" />
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

export default D6;
