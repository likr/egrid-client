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
