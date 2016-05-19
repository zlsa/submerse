
precision mediump float;

uniform samplerCube uTexture;
uniform vec3 uVector;
uniform vec2 uResolution;

varying vec2 vPosition;
varying vec2 vTexture;
varying vec3 vView;

void main() {
  gl_FragColor = texture(uTexture, vView);
}
