import * as THREE from 'three';

import indexed_map from './img/indexed_map.png';

/**
 * Converts x,y,z coords to latitude and longitude, for the given mesh
 * @param {THREE.Vector3} point - the point to convert
 * @param {THREE.Mesh} mesh - the sphere geometry based mesh
 * @returns {Obejct} containing lat and lon coords
 */
export const xyzToLatLon = (point, mesh) => {
	const currentLat = 90 - Math.acos(point.y / mesh.geometry.parameters.radius) * 180 / Math.PI;
	let currentLon = (270 + Math.atan2(point.x, point.z) * 180 / Math.PI) % 360;
	if (currentLon >= 180) currentLon -= 360;
	return { lat: currentLat, lon: currentLon };
};

/**
 * Converts latitude and longitude to x,y,z coords, for the given mesh
 * @param {Number} lat - latitude
 * @param {Number} lon - longitude
 * @param {THREE.Mesh} mesh - the sphere geometry based mesh
 * @returns {Obejct} containing x,y and z coords
 */
export const latLonToXyz = (lat, lon, mesh) => {
	const phi = lat * Math.PI / 180;
	const theta = lon * Math.PI / 180;
	const point = new THREE.Vector3();
	point.x = mesh.geometry.parameters.radius * Math.cos(phi) * Math.cos(theta);
	point.y = mesh.geometry.parameters.radius * Math.sin(phi);
	point.z = -mesh.geometry.parameters.radius * Math.cos(phi) * Math.sin(theta);
	point.add(mesh.position);
	return point;
};

/**
 * Loads the indexed map and translates the xyz coordinates where the user clicked on the globe
 * to xy coordinates on its greyscale indexed map.
 * @param {THREE.Vector3} point - the clicked point on the mesh
 * @param {Globe} globe - the globe, holding the indexed map
 * @param {function} callback - will pass the result (number from 0 to 255)
 */
export const getIndex = (point, globe, callback) => {
	const img = new Image();
	img.src = indexed_map;
	img.onload = () => {
		// get the xy coords from the point
		const latLon = xyzToLatLon(point, globe);
		let x = Math.floor(latLon.lon / 360 * img.width + img.width / 2);
		let y = Math.floor(-latLon.lat / 360 * img.width + img.height / 2);
		if (x > img.width) x -= img.width;
		if (y > img.height) y -= img.height;
		// create a canvas to manipulate the image
		const canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;
		canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
		// get the pixel data and callback
		const pixelData = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
		callback(pixelData[0]);
	};
};
