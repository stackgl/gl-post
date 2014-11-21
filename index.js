var triangle = require('a-big-triangle')
var FBO      = require('gl-fbo')

module.exports = Post

function Post(gl, shader, opts) {
  if (!(this instanceof Post)) return new Post(gl, shader, opts)

  opts = opts || {}
  shader = typeof shader === 'function'
    ? shader(gl)
    : shader

  this.gl     = gl
  this.canvas = gl.canvas
  this.shader = shader
  this.shader.attributes.position.location = 0

  this._colorBufferName = opts.colorBufferName || 'colorBuffers'

  this.fbo = FBO(gl, [gl.drawingBufferWidth, gl.drawingBufferHeight])
  this.fbo.color[0].minFilter = opts.minFilter || gl.LINEAR
  this.fbo.color[0].magFilter = opts.magFilter || gl.LINEAR
}

var dims = [0, 0]

Post.prototype.bind = function() {
  var gl = this.gl

  dims[0] = gl.drawingBufferWidth
  dims[1] = gl.drawingBufferHeight

  this.fbo.bind()
  this.fbo.shape = dims
}

Post.prototype.unbind = function() {
  this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
}

Post.prototype.draw = function() {
  var gl = this.gl

  this.unbind()

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.disable(gl.DEPTH_TEST)
  gl.disable(gl.CULL_FACE)

  this.shader.bind()
  this.shader.uniforms[this._colorBufferName] = this.fbo.color[0].bind(0)

  triangle(gl)
}
