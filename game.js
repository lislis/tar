var cam = document.getElementById('camera');
var speedFactor = 0.01;
var raf;
function frame(dt) {
  //console.log(dt);
  let pos = cam.getAttribute('position');
  cam.setAttribute('position', {x: pos.x, y: pos.y, z: pos.z - speedFactor } );

  raf = window.requestAnimationFrame(frame);
}

//frame();

function cancelFrame(id) {
  window.cancelAnimationFrame(id);
}
