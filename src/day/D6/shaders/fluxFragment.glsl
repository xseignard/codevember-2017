uniform vec3 color;
uniform sampler2D texture;
uniform float displacement;

varying vec2 vUv;

void main() {
	vec4 texColor = texture2D(texture, vec2(vUv.x+displacement, vUv.y));
	gl_FragColor = texColor * vec4(color,1.0);
}
