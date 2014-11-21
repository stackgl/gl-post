precision mediump float;

uniform sampler2D colorBuffer;
uniform float t;

varying vec2 screenPosition;

void main() {
  // Here we're changing the texture sample coordinates
  // to get a distorted image.
  vec2 samplePosition = screenPosition;

  samplePosition = (sin(screenPosition * 15.0) + 1.0) * 0.5;
  samplePosition = samplePosition + (cos(t) + 1.0) * 0.25;

  vec4 sampleColor = texture2D(colorBuffer, samplePosition);

  gl_FragColor = vec4(sampleColor.rgb, 1);
}
