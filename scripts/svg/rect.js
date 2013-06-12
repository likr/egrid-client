"use strict";


function Rect(x, y, width, height, theta) {
  this.x = x || 0;
  this.y = y || 0;
  this.width = width || 0;
  this.height = height || 0;
  this.theta = theta || 0;
}


Rect.prototype.left = function left() {
  return new Point(
      - this.width / 2 * Math.cos(this.theta) + this.x,
      this.width / 2 * Math.sin(this.theta) + this.y);
};


Rect.prototype.right = function right() {
  return new Point(
      this.width / 2 * Math.cos(this.theta) + this.x,
      this.width / 2 * Math.sin(this.theta) + this.y);
};


Rect.prototype.top = function top() {
  return new Point(
      this.height / 2 * Math.sin(this.theta) + this.x,
      this.height / 2 * Math.cos(this.theta) + this.y);
};


Rect.prototype.bottom = function bottom() {
  return new Point(
      this.height / 2 * Math.sin(this.theta) + this.x,
      - this.height / 2 * Math.cos(this.theta) + this.y);
};


Rect.prototype.center = function center() {
  return new Point(this.x, this.y);
};
