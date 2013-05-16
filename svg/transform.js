"use strict";

function TransformList(items) {
  this.items = items;
}

function Translate(x, y) {
  this.x = x;
  this.y = y;
  this.toString = function() {
    return "translate(" + this.x + "," + this.y + ")";
  };
}


function Scale(sx, sy) {
  this.sx = sx;
  this.sy = sy;
  this.toString = function() {
    return "scale(" + this.sx + "," + this.sy + ")";
  };
}


function Rotate(angle) {
  this.angle = angle;
  this.toString = function() {
    return "rotate(" + this.angle + ")";
  };
}
