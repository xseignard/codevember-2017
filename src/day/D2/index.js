import React, { Component } from 'react';
import * as THREE from 'three';
import 'three/examples/js/loaders/MTLLoader';
import 'three/examples/js/loaders/OBJLoader';
import Loader from 'react-loaders';
import 'loaders.css';

import './style.css';
import initThree from '../../utils/initThree';

import Title from '../../components/Title';
import Footer from '../../components/Footer';

import modelGeometry from './models/TourLu_low.obj';
import modelMaterial from './models/TourLu_low.mtl';

class D2 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
		};
	}

	componentDidMount() {
		// init three
		const { stats, renderer, scene, camera, controls } = initThree(this.canvas, {
			camera: {
				z: 50,
			},
			axisHelper: false,
		});
		this.renderer = renderer;
		this.stats = stats;

		const spotLight = new THREE.SpotLight(0xff0000);
		spotLight.angle = 25 * (Math.PI / 180);
		spotLight.position.set(40, 40, 0);
		spotLight.castShadow = true;
		spotLight.distance = 200;
		spotLight.decay = 2;
		spotLight.penumbra = 0.9;
		scene.add(spotLight);

		const mtlLoader = new THREE.MTLLoader();
		mtlLoader.load(modelMaterial, materials => {
			materials.preload();
			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials(materials);
			objLoader.load(modelGeometry, object => {
				object.traverse(node => {
					if (node.material) node.material.side = THREE.DoubleSide;
				});
				object.rotation.set(-Math.PI / 2, 0, -Math.PI / 2);
				object.position.set(2, -30, 0);
				scene.add(object);
				setTimeout(() => {
					this.setState({ loaded: true });
				}, 3000);
			});
		});

		const animate = timestamp => {
			this.rafID = requestAnimationFrame(animate);
			stats.begin();
			// update the time uniform
			// uniforms.time.value = timestamp;
			renderer.render(scene, camera);
			stats.end();
		};
		requestAnimationFrame(animate);
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
					title="The LU tower (Nantes, FR), photogrammetry"
					url="http://knowing-nantes.blogspot.fr/2012/07/unique-place-at-nantes-le-lieu-unique.html"
				/>
				<Loader type="line-scale-pulse-out" active={!this.state.loaded} />
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

export default D2;
