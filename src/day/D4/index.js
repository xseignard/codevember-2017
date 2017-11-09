import React, { Component } from 'react';
import * as THREE from 'three';
import initThree from '../../utils/initThree';

import Title from '../../components/Title';
import Footer from '../../components/Footer';

import Sheep from './sheep';
import Fart from './fart';
import { createGrass } from './grass';

class D3 extends Component {
	componentDidMount() {
		// init three
		const { stats, renderer, scene, camera, controls } = initThree(this.canvas, {
			axisHelper: false,
			renderer: {
				shadowMap: true,
			},
			camera: {
				fov: 90,
				x: 0,
				y: 0,
				z: 40,
			},
			ambient: {
				color: 0x888888,
			},
		});
		this.renderer = renderer;
		this.stats = stats;

		const dy = 15;

		const spotLight = new THREE.SpotLight(0x88aa88);
		spotLight.angle = 25 * (Math.PI / 180);
		spotLight.position.set(-10, 80 - dy, -20);
		spotLight.castShadow = true;
		spotLight.distance = 200;
		spotLight.decay = 2;
		spotLight.penumbra = 0.9;
		scene.add(spotLight);
		// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
		// scene.add(spotLightHelper);

		const spotLight2 = new THREE.SpotLight(0xaa44aa);
		spotLight2.angle = 25 * (Math.PI / 180);
		spotLight2.position.set(80, 80 - dy, 50);
		spotLight2.distance = 200;
		spotLight2.decay = 2;
		spotLight2.penumbra = 0.9;
		scene.add(spotLight2);
		// const spotLightHelper2 = new THREE.SpotLightHelper(spotLight2);
		// scene.add(spotLightHelper2);

		// beeeeeeeeeeeeeeeeh
		const sheep = Sheep();
		sheep.group.position.y = 11.5 - dy;
		sheep.group.rotation.y = -Math.PI / 3;
		scene.add(sheep.group);

		// fart
		const fart = Fart();
		fart.group.position.set(-5, 15 - dy, -10);
		scene.add(fart.group);

		// floor
		const grassMaterial = new THREE.MeshPhongMaterial({
			color: 0x42f4bc,
			side: THREE.DoubleSide,
			emissive: 0x000000,
			specular: 0x888888,
		});
		const planeSize = 60;
		const geometry = new THREE.PlaneGeometry(planeSize * 2, planeSize * 2, 5, 5);
		geometry.vertices.forEach(v => {
			if (Math.random() > 0.5) v.z -= Math.random();
		});
		const plane = new THREE.Mesh(geometry, grassMaterial);
		plane.rotation.x = Math.PI / 2;
		plane.position.y = -dy;
		plane.receiveShadow = true;
		scene.add(plane);
		// grass
		const g = createGrass(grassMaterial, planeSize, 1500);
		g.position.y = -dy;
		scene.add(g);

		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();
		let canClick = true;
		const handleClick = e => {
			e.preventDefault();
			mouse.x = e.clientX / window.innerWidth * 2 - 1;
			mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
			raycaster.setFromCamera(mouse, camera);
			const intersects = raycaster.intersectObjects(sheep.group.children);
			if (intersects.length > 0) {
				// && intersects[0].object.uuid === sheep.nose.uuid) {
				let i = 0;
				const interval = setInterval(() => {
					if (i <= 100) {
						fart.particles[i].fart();
						i++;
					} else clearInterval(interval);
				}, 10);
				TweenMax.to(sheep.nose.scale, 0.3, {
					x: '+=2',
					y: '+=2',
					z: '+=2',
					ease: Power2.easeInOut,
					repeat: 1,
					yoyo: true,
				});
			}
		};
		addEventListener('click', handleClick);

		const animate = timestamp => {
			this.rafID = requestAnimationFrame(animate);
			stats.begin();
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
				<Title title="Low poly sheep, click on it!" />
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
