
window.onload = function() {
  var s = new submerse.Scene('example/scene/falcon-9-barge.json');
  document.getElementById('scene').appendChild(s.element);
  s.autoResize();
  s.autoRender();
};
