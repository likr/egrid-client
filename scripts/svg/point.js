"use strict";


function Point(x, y) {
  this.x = x;
  this.y = y;
}


Point.distance(p1, p2) {
  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}


Point.angle(p1, p2) {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}


Point.prototype.distanceTo(other) {
  return Point.distance(this, other);
}


Point.prototype.angleTo(other) {
  return Point.angle(this, other);
}
