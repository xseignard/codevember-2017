import * as THREE from 'three';
import TweenMax from 'gsap';

const material = color =>
	new THREE.MeshPhongMaterial({
		color,
		side: THREE.DoubleSide,
		emissive: 0x000000,
		specular: 0xffffff,
		flatShading: true,
	});

export default () => {
	console.log('beeeeeeeeeeeeeeeeh!');
	const group = new THREE.Group();

	const body = new THREE.Mesh(new THREE.IcosahedronGeometry(10, 1), material(0xfffccc));

	const face = new THREE.Mesh(new THREE.IcosahedronGeometry(5, 1), material(0x000000));
	face.position.set(10, 5, 0);

	const hair1 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5, 1), material(0xfffccc));
	hair1.position.set(10.3, 9.9, -1);
	const hair2 = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), material(0xfffccc));
	hair2.position.set(10, 9.5, -2);
	const hair3 = hair2.clone();
	hair3.position.set(9, 9.5, 1);
	const hair4 = hair2.clone();
	hair4.position.set(10, 9.7, 0.3);
	const hair5 = hair2.clone();
	hair5.position.set(9.2, 9.7, -0.3);

	const leftEye = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 12), material(0xffffff));
	leftEye.position.set(13.5, 7, 2.3);
	leftEye.rotation.z = Math.PI / 2;

	const rightEye = leftEye.clone();
	rightEye.position.z = -2.3;

	const leftPupil = new THREE.Mesh(
		new THREE.CylinderGeometry(0.5, 0.3, 1, 12),
		material(0x000000),
		true
	);
	leftPupil.position.set(13.7, 7, 2.1);
	leftPupil.rotation.z = Math.PI / 2;

	const rightPupil = leftPupil.clone();
	rightPupil.position.z = -2.1;

	const nose = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 1), material('red'));
	nose.position.set(14.7, 5, 0);

	const mouth = new THREE.Mesh(
		new THREE.CylinderGeometry(2, 2, 2, 8, 1, true, Math.PI, Math.PI),
		material(0xffffff),
		true
	);
	mouth.rotation.z = Math.PI / 2;
	mouth.position.set(13.2, 3.5, 0);

	const blLeg = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1, 7), material(0x000000));
	blLeg.position.set(-5, -8, 4);

	const brLeg = blLeg.clone();
	brLeg.position.set(5, -8, 4);

	const flLeg = blLeg.clone();
	flLeg.position.set(-5, -8, -4);

	const frLeg = blLeg.clone();
	frLeg.position.set(5, -8, -4);

	const tail = new THREE.Mesh(new THREE.IcosahedronGeometry(2, 1), material(0x000000));
	tail.position.set(-10, 0, 0);

	group.add(hair1);
	group.add(hair2);
	group.add(hair3);
	group.add(hair4);
	group.add(hair5);
	group.add(leftEye);
	group.add(rightEye);
	group.add(leftPupil);
	group.add(rightPupil);
	group.add(nose);
	group.add(mouth);
	group.add(blLeg);
	group.add(brLeg);
	group.add(flLeg);
	group.add(frLeg);
	group.add(tail);
	group.add(body);
	group.add(face);
	group.traverse(m => (m.castShadow = true));

	setInterval(() => {
		TweenMax.to(leftPupil.scale, 0.3, {
			y: 0.6,
			ease: Power2.easeInOut,
			repeat: 1,
			yoyo: true,
		});
		TweenMax.to(rightPupil.scale, 0.3, {
			y: 0.6,
			ease: Power2.easeInOut,
			repeat: 1,
			yoyo: true,
		});
	}, 1000 + Math.random() * 2000);
	return { group, nose };
};
