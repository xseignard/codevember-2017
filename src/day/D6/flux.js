import * as THREE from 'three';

import { latLonToXyz } from './utils';

/**
 * Flux constructor
 * @property {THREE.Mesh} mesh - the mesh on which the flux will be calculated
 * @property {Number} numberOfPoints - the number of points to compute for a flux, deflauts to 50
 */
class Flux {
	constructor(mesh, numberOfPoints) {
		this.mesh = mesh;
		this.numberOfPoints = numberOfPoints || 50;
	}

	/**
	 * Create a geometry for the flux, based on quadratic Bezier curves,
	 * between the source and dest coords
	 * @param {Number} srcLat - source latitude
	 * @param {Number} srcLon - source longitude
	 * @param {Number} destLat - destination latitude
	 * @param {Number} destLon - destination longitude
	 * @return {THREE.Geometry} the calculated THREE.js geometry
	 */
	quadraticFlux(srcLat, srcLon, destLat, destLon) {
		// convert {latitude,longitude} coordinates to {x,y,z} ones
		const srcPoint = latLonToXyz(srcLat, srcLon, this.mesh);
		const destPoint = latLonToXyz(destLat, destLon, this.mesh);
		// distance between the src and dest
		const distance = srcPoint
			.clone()
			.sub(destPoint)
			.length();
		// get the {x,y,z} position of the middle point of the arc between src and dest and on the sphere
		const controlPoint = srcPoint
			.clone()
			.add(destPoint)
			.multiplyScalar(0.5);
		controlPoint.sub(this.mesh.position);
		controlPoint.normalize();
		// set its position up in the air at radius + something
		controlPoint.multiplyScalar(this.mesh.geometry.radius + distance * 0.7);
		controlPoint.add(this.mesh.position);
		// create the quadratic flux geometry
		const curve = new THREE.QuadraticBezierCurve3(srcPoint, controlPoint, destPoint);
		const path = new THREE.CurvePath();
		path.add(curve);
		return path.createPointsGeometry(this.numberOfPoints);
	}

	/**
	 * Create a geometry for the flux, based on cubic Bezier curves,
	 * between the source and dest coords
	 * @param {Number} srcLat - source latitude
	 * @param {Number} srcLon - source longitude
	 * @param {Number} destLat - destination latitude
	 * @param {Number} destLon - destination longitude
	 * @return {THREE.Geometry} the calculated THREE.js geometry
	 */
	cubicFlux(srcLat, srcLon, destLat, destLon) {
		// convert {latitude,longitude} coordinates to {x,y,z} ones
		const srcPoint = latLonToXyz(srcLat, srcLon, this.mesh);
		const destPoint = latLonToXyz(destLat, destLon, this.mesh);
		// distance between the src and dest
		const distance = srcPoint
			.clone()
			.sub(destPoint)
			.length();
		// src control point
		const srcControl = srcPoint.clone().sub(this.mesh.position);
		srcControl.normalize();
		srcControl.multiplyScalar(distance);
		srcControl.add(srcPoint);
		// dest control point
		const destControl = destPoint.clone().sub(this.mesh.position);
		destControl.normalize();
		destControl.multiplyScalar(distance);
		destControl.add(destPoint);
		// create the cubic flux
		const curve = new THREE.CubicBezierCurve3(srcPoint, srcControl, destControl, destPoint);
		const path = new THREE.CurvePath();
		path.add(curve);
		return path.createPointsGeometry(this.numberOfPoints);
	}

	/**
	 * Create a geometry for the flux, based on two cubic Bezier curves,
	 * between the source and a middle point, and this middle point and the destination one
	 * @param {Number} srcLat - source latitude
	 * @param {Number} srcLon - source longitude
	 * @param {Number} destLat - destination latitude
	 * @param {Number} destLon - destination longitude
	 * @return {THREE.Geometry} the calculated THREE.js geometry
	 */
	doubleCubicFlux(srcLat, srcLon, destLat, destLon) {
		// convert {latitude,longitude} coordinates to {x,y,z} ones
		const srcPoint = latLonToXyz(srcLat, srcLon, this.mesh);
		const destPoint = latLonToXyz(destLat, destLon, this.mesh);
		console.log(srcPoint);
		// distance between the src and dest
		const distance = srcPoint
			.clone()
			.sub(destPoint)
			.length();
		//	midpoint of the flux
		let midPoint = srcPoint
			.clone()
			.add(destPoint)
			.multiplyScalar(0.5)
			.sub(this.mesh.position)
			.normalize();
		// set its position up in the air at radius + something
		midPoint = midPoint.multiplyScalar(this.mesh.geometry.parameters.radius + distance * 0.2);
		midPoint = midPoint.add(this.mesh.position);
		// calculate the normal from the src and dest points
		const normal = srcPoint.clone().sub(destPoint);
		normal.normalize();
		// calculate control points
		const srcControl = midPoint.clone().add(normal.clone().multiplyScalar(distance / 2));
		const destControl = midPoint.clone().add(normal.clone().multiplyScalar(-distance / 2));
		// create 2 cubic bezier:
		// - one from src point to mid point
		// - one from mid point to dest point
		// the bezier will pass through the mid point
		// and since you can place it, it's easier to draw a nice route
		// first (resp. last) control point is the same as the src (resp. dest), it gives better results than a quadratic bezier
		const srcBezier = new THREE.CubicBezierCurve3(srcPoint, srcPoint, srcControl, midPoint);
		const destBezier = new THREE.CubicBezierCurve3(midPoint, destControl, destPoint, destPoint);
		// get the points from the 2 bezier curves that will enable the creation of the flux
		let points = srcBezier.getPoints(this.numberOfPoints / 2);
		// remove the last sampled point since it's the starting point of the dest bezier
		points = points.splice(0, points.length - 1);
		points = points.concat(destBezier.getPoints(this.numberOfPoints / 2));
		// create the flux
		const flux = new THREE.Geometry();
		flux.vertices = points;
		return flux;
	}
}

export default Flux;
