var Geometry = require('gl-geometry')
var mat4     = require('gl-mat4')
var normals  = require('normals')
var glslify  = require('glslify')
var bunny    = require('bunny')
var Post     = require('../')

var canvas = document.body.appendChild(document.createElement('canvas'))
var gl     = require('gl-context')(canvas, render)
var camera = require('canvas-orbit-camera')(canvas)
var start  = Date.now()

var post = Post(gl, glslify({
    vert: '../post.vert'
  , frag: './post.frag'
}))

window.addEventListener('resize'
  , require('canvas-fit')(canvas)
  , false
)

var geometry = Geometry(gl)

geometry.attr('aPosition', bunny.positions)
geometry.attr('aNormal', normals.vertexNormals(
    bunny.cells
  , bunny.positions
))

geometry.faces(bunny.cells)

var projection = mat4.create()
var model      = mat4.create()
var view       = mat4.create()
var height
var width

var shader = glslify({
    vert: './bunny.vert'
  , frag: './bunny.frag'
})(gl)

function update() {
  width  = gl.drawingBufferWidth
  height = gl.drawingBufferHeight

  camera.view(view)
  camera.tick()

  mat4.perspective(projection
    , Math.PI / 4
    , gl.drawingBufferWidth / gl.drawingBufferHeight
    , 0.01
    , 100
  )
}

function render() {
  update()

  post.bind()

  gl.viewport(0, 0, width, height)
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)

  geometry.bind(shader)

  shader.uniforms.uProjection = projection
  shader.uniforms.uView = view
  shader.uniforms.uModel = model

  geometry.draw(gl.TRIANGLES)

  post.shader.bind()
  post.shader.uniforms.t = (Date.now() - start) * 0.001
  post.draw()
}
