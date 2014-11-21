precision mediump float;

uniform sampler2D colorBuffer;
uniform float t;

varying vec2 screenPosition;

void main() {
  gl_FragColor = texture2D(colorBuffer, screenPosition);
}
