const vec2 halfUnit = vec2(0.5,0.5);

attribute vec2 aPosition;
varying vec2 vPosition;
varying vec2 vTexture;

void main() {
  vTexture = aPosition.xy * halfUnit + halfUnit;
  vPosition = aPosition;
  vTexture.y = 1.0 - vTexture.y;
  gl_Position = vec4(aPosition.xy, 0.5, 1.0);
}
