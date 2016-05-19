
var util = require('./util.js');
var events = require('./events.js');
var loader = require('./loader.js');

var layer = require('./layer.js');

class Scene extends loader.JSONLoader {

  constructor(url) {
    super();

    this.createElement();

    this.url = url;
    this.resolution = [1, 1];
    this.aspect = 1;

    this.name = null;
    this.credit = null;

    this.layers = [];

    this.on('loaded', util.withScope(this, this.parseScene));

    if(url) this.load();
  }

  createElement() {
    this.element = util.createElement('div.submerse-scene');

    this.createCanvas();
  }

  createCanvas() {
    this.canvas = util.createElement('canvas.submerse-canvas');

    this.context = this.canvas.getContext('webgl');

    if(!this.context) {
      alert('no webgl support, submerse is borked')
      console.warn('no webgl support, submerse is borked');
      return;
    }

    this.element.appendChild(this.canvas);
  }

  setName(newName) {
    this.name = newName;
  }

  setCredit(newCredit) {
    this.newCredit = newCredit;
  }

  addLayer(layer) {
    this.layers.push(layer);
  }

  parseScene() {
    var d = this.data;

    this.setName(util.getValue(d, 'name', this.name));
    this.setCredit(util.getValue(d, 'credit', this.credit));

    var layers = util.getValue(d, 'layers', []);
    var newLayer, layerData, layerType;

    for(var i=0; i<layers.length; i++) {
      layerData = layers[i];
      layerType = util.getValue(layerData, 'type', null);

      if(layerType === 'equirectangular') {
        newLayer = new layer.EquirectangularLayer(this);
        newLayer.parseLayerData(layerData);
        this.addLayer(newLayer);
      } else {
        console.warn('unknown layer type', layerData);
        continue;
      }

    }
    
  }

  clearCanvas() {
    var gl = this.context;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  resize() {
    if(!this.element.parentElement) return;
    
    var parent = this.element.parentElement;
    
    var newWidth = parent.offsetWidth;
    var newHeight = parent.offsetHeight;

    this.canvas.width = newWidth;
    this.canvas.height = newHeight;

    this.element.style.width = '100%';
    this.element.style.height = '100%';

    this.context.viewport(0, 0, newWidth, newHeight);

    this.resolution = [newWidth, newHeight];
    this.aspect = newWidth / newHeight;
  }

  autoResize() {
    var _this = this;
    
    var resize = function() {
      _this.resize.call(_this);
    };

    resize();

    window.addEventListener('resize', resize);
    
  }

  render() {
    if(!this.context) return;

    if(this.layers.length >= 1 && this.layers[0].transparent == true)
      this.clearCanvas();

    for(var i=0; i<this.layers.length; i++) {
      this.layers[i].render();
    }
    
  }

  autoRender() {
    var _this = this;
    
    var render = function() {
      _this.render.call(_this);

      requestAnimationFrame(render);
    };

    render();
    
  }

}

exports.Scene = Scene;
