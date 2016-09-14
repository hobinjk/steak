function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

var lengths = [13, 17, 34, 25, 50, 100, 150];
var speeds = [1, 2, 3, 5, 7, 11, 13, -1, -7, 17];
var baseSpeed = 1 / 3000;

function makeSegment() {
  return {
    r: randomChoice(lengths) * 2,
    theta: 0,
    speed: randomChoice(speeds)
  };
}

function makeSegments() {
  var segs = [];
  for (var i = 0; i < Math.random() * 2 + 3; i++) {
    segs.push(makeSegment());
  }
  return segs;

}

var cycleDuration = 2 * Math.PI / baseSpeed;

var segments = [];

var canvas = document.querySelector('canvas');
var width;
var height;
var lastPoint;
var nextChange;
var lastUpdate;
var ctx;
var drawing = false;

function create() {
  width = Math.min(window.innerHeight, window.innerWidth) * 2;
  height = width;
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width / 2 + 'px';
  canvas.style.height = height / 2 + 'px';

  lastUpdate = Date.now();

  ctx = canvas.getContext('2d');
  ctx.lineWidth = 2;

  regenerate();

  if (!drawing) {
    drawing = true;
    draw();
  }
}

function regenerate() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
  segments = makeSegments();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'hsla(' + Math.random() * 360 + ', 100%, 50%, 1)';
  nextChange = Date.now() + cycleDuration + 2000;
  lastPoint = null;
}

function draw() {
  if (Date.now() > nextChange) {
    regenerate();
  }

  var dt = Date.now() - lastUpdate;
  if (dt > 50) {
    dt = 50;
  }

  if (Date.now() > nextChange - 1500) {
    dt = 0;
  }

  var point = {
    x: width / 2,
    y: height / 2
  };

  for (var i = 0; i < segments.length; i++) {
    var seg = segments[i];

    point.x += Math.cos(seg.theta) * seg.r;
    point.y += Math.sin(seg.theta) * seg.r;
    seg.theta += seg.speed * dt * baseSpeed;
  }
  if (lastPoint) {
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }

  lastPoint = point;
  lastUpdate = Date.now();

  requestAnimationFrame(draw);
}

create();

document.body.addEventListener('click', function() {
  document.body.requestFullscreen();
  setTimeout(create, 500);
});
