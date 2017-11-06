// coming from the vertex shader
varying vec4 vColor;
varying float vAlpha;

void main() {
	gl_FragColor = vec4(vColor.xyz, vAlpha);
}
