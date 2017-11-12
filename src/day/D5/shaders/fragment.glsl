uniform vec2 resolution;
uniform float time;

// sdf meatball
float meatball(vec2 p1, vec2 p0) {
	return 0.02 / (pow(p1.x - p0.x, 3.0) + pow(p1.y - p0.y, 3.0));
	// return 0.02 / pow(length(p1 - p0), 3.0);
}

void main() {
	// fragment coordinates
	vec2 p = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
	p.x *= resolution.x / resolution.y;

	// compute 3 meatball positions
	float s2 = sin(time * 2.0);
	float s3 = sin(time * 3.0);
	float s4 = sin(time * 4.0);
	float c2 = cos(time * 2.0);
	float c3 = cos(time * 3.0);

	vec2 mb1 = vec2(s4 + c3, s3 + c3) * 0.5;
	vec2 mb2 = vec2(s3 + c2, -s4 + c3) * 0.5;
	vec2 mb3 = vec2(s3 + c3, -s4 + c2) * 0.5;

	// starting color
	vec3 col = vec3(1.0);
	// each channel gets its color from a metaball position
	col.r *= length(mb1.xy - p.xy);
	col.g *= length(mb2.xy - p.xy);
	col.b *= length(mb3.xy - p.xy);
	// tweak the color
	col *= pow(meatball(mb1, p) + meatball(mb2, p) + meatball(mb3, p), 1.8);

	gl_FragColor = vec4(col,1.0);
}
