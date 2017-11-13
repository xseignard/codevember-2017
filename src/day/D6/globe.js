import * as THREE from 'three';

import world_4k_bw from './img/world_4k_bw.png';
import borders_map from './img/borders_map.png';
import continents_map from './img/continents_map.png';
import indexed_map from './img/indexed_map.png';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

class Globe {
	constructor(radius) {
		// create the material from the given options or defaults
		// create a globe representing the earth
		// load from pngs
		const textureLoader = new THREE.TextureLoader();
		const worldMap = textureLoader.load(world_4k_bw);
		const bordersMap = textureLoader.load(borders_map);
		const continentsMap = textureLoader.load(continents_map);
		const indexMap = textureLoader.load(indexed_map);
		indexMap.magFilter = THREE.NearestFilter;
		indexMap.minFilter = THREE.NearestFilter;

		this.globeUniforms = {
			worldMap: { type: 't', value: worldMap },
			bordersMap: { type: 't', value: bordersMap },
			continentsMap: { type: 't', value: continentsMap },
			indexMap: { type: 't', value: indexMap },
			clicked: { type: 'f', value: 0.0 },
			clickColor: { type: 'c', value: new THREE.Color(0x464ea2) },
			countryColor: { type: 'c', value: new THREE.Color(0x242ec5) },
			borderColor: { type: 'c', value: new THREE.Color(0x2237ff) },
		};
		const globeMaterial = new THREE.ShaderMaterial({
			uniforms: this.globeUniforms,
			vertexShader,
			fragmentShader,
		});
		// create the geometry from the given options or defaults
		const geometry = new THREE.SphereGeometry(radius, 40, 40);
		// create the globe
		this.planet = new THREE.Mesh(geometry, globeMaterial);
	}
}

export default Globe;
