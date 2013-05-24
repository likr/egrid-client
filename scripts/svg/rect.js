"use strict";


function Rect(x, y, width, height) {
  this.x = x || 0;
  this.y = y || 0;
  this.width = width || 0;
  this.height = height || 0;
}


Rect.prototype.left = function left() {
  return this.x;
};


Rect.prototype.right = function right() {
  return this.x + this.width;
};


Rect.prototype.top = function top() {
  return this.y;
};


Rect.prototype.bottom = function bottom() {
  return this.y + this.height;
};


Rect.prototype.center = function center() {
  return new Point(this.x + this.width / 2, this.y + this.height / 2);
};
