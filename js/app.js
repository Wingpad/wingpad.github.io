paper.install(window);

var draw, drag;
var segment, path;
var movePath = false;
var color;

var hitOptions = {
  segments: true,
  stroke: true,
  fill: true,
  tolerance: 5
};

function updateColor(jscolor) {
  color = jscolor;
}

window.onload = function() {
  paper.setup('mainCanvas');

  var raster = new Raster('marth');
  raster.position = view.center;

  draw = new Tool();

  draw.onMouseDown = function(event) {
    path = new Path({
      segments: [event.point],
      strokeColor: '#' + color
    });
  }

  draw.onMouseDrag = function(event) {
    path.add(event.point);
  }

  draw.onMouseUp = function(event) {
    path.simplify(10);
  }

  drag = new Tool();

  drag.onMouseDown = function(event) {
    segment = path = null;

    var hitResult = project.hitTest(event.point, hitOptions);

    if (!hitResult) {
      return;
    }

    if (event.modifiers.shift) {
      hitResult.item.remove();
      return;
    }

    path = hitResult.item;
    if (hitResult.type == 'segment') {
      segment = hitResult.segment;
    } else if (hitResult.type == 'stroke') {
      var location = hitResult.location;
      segment = path.insert(location.index + 1, event.point);
      path.smooth();
    }

    movePath = hitResult.type == 'fill';

    if (movePath) {
      project.activeLayer.addChild(hitResult.item);
    }
  }

  drag.onMouseMove = function(event) {
    project.activeLayer.selected = false;

    if (event.item) {
      event.item.selected = true;
    }
  }

  drag.onMouseDrag = function(event) {
    if (segment) {
      segment.point = segment.point.add(event.delta);
      path.smooth();
    } else if (path) {
      path.position = path.position.add(event.delta);
    }
  }
}
