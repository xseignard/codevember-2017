@import ./simplex;

vec3 curl(float x, float y, float z, float timer) {
	float eps = 1.0;
	float eps2 = 2.0 * eps;
	float n1, n2, a, b;

	x += timer * 0.05;
	y += timer * 0.05;
	z += timer * 0.05;

	vec3 curl = vec3(0.0);

	n1 = snoise(vec2(x, y + eps));
	n2 = snoise(vec2(x, y - eps));
	a = (n1 - n2)/eps2;

	n1 = snoise(vec2(x, z + eps));
	n2 = snoise(vec2(x, z - eps));
	b = (n1 - n2)/eps2;

	curl.x = a - b;

	n1 = snoise(vec2(y, z + eps));
	n2 = snoise(vec2(y, z - eps));
	a = (n1 - n2)/eps2;

	n1 = snoise(vec2(x + eps, z));
	n2 = snoise(vec2(x + eps, z));
	b = (n1 - n2)/eps2;

	curl.y = a - b;

	n1 = snoise(vec2(x + eps, y));
	n2 = snoise(vec2(x - eps, y));
	a = (n1 - n2)/eps2;

	n1 = snoise(vec2( y + eps, z));
	n2 = snoise(vec2( y - eps, z));
	b = (n1 - n2)/eps2;

	curl.z = a - b;

	return curl;
}
