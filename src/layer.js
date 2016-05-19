
var util = require('./util.js');
var events = require('./events.js');
var loader = require('./loader.js');

var twgl = require('twgl.js');

var ecf = require('equirect-cubemap-faces-js');

class Layer extends events.Events {

  constructor(scene, data) {
    super();

    this.scene = scene;
  }

  parseLayerData(data) {
    
  }

}

var cubemap_shader_vertex = require('../shaders/full-screen-quad.glsl');
var cubemap_shader_fragment = require('../shaders/quad-cubemap.glsl');

class CubemapLayer extends Layer {

  constructor(scene, data) {
    super(scene);

    this.image = new loader.ImageLoader();
    
    this.programInfo = twgl.createProgramInfo(this.scene.context, [cubemap_shader_vertex, cubemap_shader_fragment]);

    this.createBuffers();
    
    this.transparent = false;
  }

  createBuffers() {
    var gl = this.scene.context;
    
    var arrays = {
      aPosition: {
        numComponents: 2,
        data: [
          -1,  1,
           1,  1,
           1, -1,
          -1,  1,
          -1, -1,
           1, -1,
        ],
      }
    };
    
    this.bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  }

  parseLayerData(data) {
    super.parseLayerData(data);

    this.transparent = util.getValue(data, 'transparent', this.transparent);
    var url = util.getValue(data, 'url', null);

    if(!url) {
      console.warn('layer does not include a url', d);
      return;
    }

    url = this.scene.getURLPath() + url;

    this.image.on('complete', util.withScope(this, this.createTexture));

    this.image.load(url);
  }

  createTexture() {
    var gl = this.scene.context;
    
    this.texture = twgl.createTexture(gl, {
      target: gl.TEXTURE_CUBE_MAP,
      src: this.image.data
    });

  }

  render() {
    if(!this.texture) return;

    var gl = this.scene.context;
    
    gl.useProgram(this.programInfo.program);

    var projection = twgl.m4.perspective(60 * Math.PI / 180, this.scene.aspect, 0.1, 10);

    var uniforms = {
      uTexture: this.texture
      uView: 
    };
    
    twgl.setBuffersAndAttributes(gl, this.programInfo, this.bufferInfo);
    twgl.setUniforms(this.programInfo, uniforms);
    twgl.drawBufferInfo(gl, gl.TRIANGLES, this.bufferInfo);
  }

}

var equirectangular_shader_vertex = require('../shaders/full-screen-quad.glsl');
var equirectangular_shader_fragment = require('../shaders/quad-equirectangular.glsl');

class EquirectangularLayer extends CubemapLayer {

  constructor(scene, data) {
    super(scene, data);
  }

  createTexture() {
    var gl = this.scene.context;
    
    this.texture = twgl.createTexture(gl, {
      target: gl.TEXTURE_CUBE_MAP,
      src: ecf(this.image.data)
    });

  }

}

exports.Layer = Layer;
exports.EquirectangularLayer = EquirectangularLayer;
