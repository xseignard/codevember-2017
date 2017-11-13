uniform sampler2D worldMap;
uniform sampler2D bordersMap;
uniform sampler2D continentsMap;
uniform sampler2D indexMap;

uniform float clicked;

uniform vec3 borderColor;
uniform vec3 clickColor;
uniform vec3 countryColor;

varying vec2 vUv;

void main() {
	vec4 borders = texture2D(bordersMap, vUv) * vec4(borderColor, 1.0);
	vec4 world = texture2D(worldMap, vUv) * 2.0;
	vec4 continents = texture2D(continentsMap, vUv) / 5.0;
	vec4 index = texture2D(indexMap, vUv);
	vec4 globeCol = vec4(countryColor, 1.0);

	if (abs(clicked - index.r) < 0.0035 && clicked / index.r > 0.0) {
		globeCol = vec4(clickColor, 0.7);
	}

	float r = globeCol.r * world.r + borders.r + continents.r;
	float g = globeCol.g * world.g + borders.g + continents.g;
	float b = globeCol.b * world.b + borders.b + continents.b;

	gl_FragColor = vec4(r,g,b,1.0);
}
