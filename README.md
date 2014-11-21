# gl-post
![](http://img.shields.io/badge/stability-experimental-orange.svg?style=flat)
![](http://img.shields.io/npm/v/gl-post.svg?style=flat)
![](http://img.shields.io/npm/dm/gl-post.svg?style=flat)
![](http://img.shields.io/npm/l/gl-post.svg?style=flat)

Simple WebGL post-processing using some pieces from [stackgl](http://stack.gl/).

## Usage

[![NPM](https://nodei.co/npm/gl-post.png)](https://nodei.co/npm/gl-post/)

See the [example](example) code for a full usage example.

### `post = glPost(gl, shader, opts={})`

Creates a new post-processing instance, where `gl` is a `WebGLContext` instance
and `shader` is a shader instance from either
[gl-shader-core](http://github.com/mikolalysenko/gl-shader-core) or
[glslify](http://github.com/stackgl/glslify).

The vertex shader is supplied for you, and available at `gl-post/post.vert`.
The shader you pass in may also be a function that takes a `WebGLContext` and
returns a shader instance too, so the following is valid:

``` javascript
var glslify = require('glslify')
var glPost  = require('gl-post')

post = glPost(gl, glslify({
    vert: 'gl-post'
  , frag: './src/my-shader.frag'
}))
```

There are also a few options you can include too:

* `minFilter`: the texture minification filter to use. Defaults to `gl.LINEAR`.
* `magFilter`: the texture magnification filter to use. Defaults to `gl.LINEAR`.
* `colorBufferName`: the name of your color buffer uniform to use in your
  shader. Defaults to `colorBuffer`.

In simple cases, you'll want to do something like this:

``` javascript
var glslify = require('glslify')
var glPost  = require('gl-post')

post = glPost(gl, glslify({
    vert: 'gl-post'
  , frag: './src/my-shader.frag'
}))

function render() {
  post.bind()

  // Note that it's important you clear your
  // depth/color buffers for this to work properly :)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.viewport(0, 0, canvas.width, canvas.height)

  // ...draw your scene to the framebuffer here...

  post.draw()
}
```

### `post.shader`

The shader you gave `gl-post` will also be exposed here, for quickly changing
uniform variable values.

### `post.bind()`

Starts drawing to the post-processing buffer. Anything you do now will not be
immediately drawn to the screen, but instead drawn to an off-screen
[framebuffer](http://github.com/stackgl/gl-fbo) for you to draw later using
the post-processing shader.

You should this when you're ready to start drawing your scene.

### `post.draw()`

Draws the framebuffer to the screen using your shader, returning your drawing
power to the screen in the process.

### `post.unbind()`

Call this if you want to explicitly disable rendering to the framebuffer before
drawing to the screen.

## License

MIT. See [LICENSE.md](http://github.com/stackgl/gl-post/blob/master/LICENSE.md) for details.
