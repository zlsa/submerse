
precision mediump float;

uniform sampler2D uTexture;
uniform float uFov;
uniform vec3 uVector;
uniform vec2 uResolution;

varying vec2 vPosition;
varying vec2 vTexture;

void main() {
  vec2 texture = vec2(0.0, 0.0);

  float aspect = uResolution.x / uResolution.y;

  vec2 fov = vec2(uFov * aspect, uFov);

  /*
  10 = 5 * 2;

  5 = 10 / 2;

  x = lon * 1;
  lon = x / 1;
  */

  texture.x = (vPosition.x) / 1.0 * fov.x + uVector.x;
  texture.y = acos(vPosition.y) * fov.y;

  texture.x = mod(texture.x, 1.0);
  texture.y = mod(texture.y, 1.0);

  gl_FragColor = texture2D(uTexture, texture);
}
