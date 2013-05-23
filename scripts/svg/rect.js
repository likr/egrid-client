"use strict";

function rectLeft(rect) {
  return rect.x;
}


function rectRight(rect) {
  return rect.x + rect.width;
}


function rectTop(rect) {
  return rect.y;
}


function rectBottom(rect) {
  return rect.y + rect.height;
}


function rectCenterX(rect) {
  return rect.x + rect.width / 2;
}


function rectCenterY(rect) {
  return rect.y + rect.height / 2;
}


function Rect(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
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
