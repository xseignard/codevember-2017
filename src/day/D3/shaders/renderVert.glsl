// updated positions from the simulation shader
uniform sampler2D positions;

varying float alpha;

void main() {
	// pick the particle position in the updated texture from the simulation shader
	vec3 pos = texture2D(positions, position.xy).xyz;
	// get some alpha
	alpha = abs(normalize(pos).z);
	gl_PointSize = 1.0;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
