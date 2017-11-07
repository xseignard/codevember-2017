@import ../../../utils/shaders/rgb2hsv;

// coming from js
uniform sampler2D texture;
uniform float time;
uniform vec3 boundingMin;
uniform vec3 boundingMax;

// going to the fragment shader
varying vec4 vColor;
varying float vAlpha;

void main() {
	// rangeX and rangeY are the size of the bounding box
	float rangeX = (boundingMin.x - boundingMax.x) * -1.0;
	float rangeY = (boundingMin.y - boundingMax.y) * -1.0;
	// offsets on x and y from the origin
	float offsetX = 0.0 - boundingMin.x;
	float offsetY = 0.0 - boundingMin.y;
	// normalized position that will map a pixel on the texture
	float pickX = (position.x + offsetX) / rangeX;
	float pickY = (position.y + offsetY) / rangeY;
	vColor = texture2D(texture, vec2(pickX, pickY));
	// convert to hsv in order to use the luminance value to change the z
	// position of the vertex
	vec3 hsv = rgb2hsv(vColor.xyz);
	// use luminance as the alpha
	vAlpha = hsv.z;
	// manipulate position of the vertex
	vec3 newPos = position;
	newPos.z += hsv.z * 6.0 * abs(sin(time * 0.0005));
	// size of the particle
	gl_PointSize = 1.7;
	// position of the particle
	gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);;
}
