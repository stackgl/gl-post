var pixels  = require('canvas-pixels')
var Geom    = require('gl-geometry')
var mat4    = require('gl-mat4')
var glslify = require('glslify')
var glPost  = require('../')
var bunny   = require('bunny')
var test    = require('tape')

test('gl-post', function(t) {
  var canvas = document.body.appendChild(document.createElement('canvas'))
  var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

  var camera = require('canvas-orbit-camera')(canvas)
  var width  = canvas.width  = 300
  var height = canvas.height = 300
  var post = glPost(gl, glslify({
      vert: '../post.vert'
    , frag: './test.frag'
  }))

  var shader = glslify({
      vert: './bunny.vert'
    , frag: './bunny.frag'
  })(gl)

  var proj = mat4.create()
  var view = mat4.create()
  var geom = Geom(gl)
  geom.attr('position', bunny.positions)
  geom.faces(bunny.cells)

  function drawScene() {
    camera.distance = 17
    camera.center = [0, 4, 0]
    camera.view(view)
    mat4.perspective(proj, Math.PI / 4, width / height, 0.01, 100)

    gl.viewport(0, 0, width, height)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    geom.bind(shader)
    shader.uniforms.proj = proj
    shader.uniforms.view = view
    geom.draw()
  }

  drawScene()
  var plain = pixels(gl)

  post.bind()
  drawScene()
  post.draw()

  var postplain = pixels(gl)
  var count = 0

  for (var i = 0; i < plain.length; i++) {
    if (plain[i] !== postplain[i]) count++
  }

  var error = count / plain.length
  var percent = (100-error*100).toFixed(2)

  t.ok(error <= 0.01, 'images matched! ' + percent + '% equivalent')
  t.end()
})
