@import ../../../utils/shaders/curl;

uniform sampler2D positions;
uniform float timer;
uniform float frequency;
uniform float amplitude;
uniform float maxDistance;

varying vec2 vUv;

void main() {
	// get the particle position from the Float32Array
	vec3 pos = texture2D(positions, vUv).rgb;
	// moving particle
	vec3 curled = pos + curl(pos.x * frequency, pos.y * frequency, pos.z * frequency, timer) * amplitude;
	float d = length(pos - curled) / maxDistance;
	pos = mix(pos, curled, pow(d, 1.3 / timer));
	gl_FragColor = vec4(pos, 1.0);
}
