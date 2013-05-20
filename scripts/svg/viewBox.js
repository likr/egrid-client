function ViewBox(minX, minY, width, height) {
  this.minX = minX;
  this.minY = minY;
  this.width = width;
  this.height = height;
  this.toString = function() {
    return [this.minX, this.minY, this.width, this.height].join(" ")
  }
}


function viewBoxFromString(str) {
  var vals = str.split(" ").map(Number);
  return new ViewBox(vals[0], vals[1], vals[2], vals[3]);
}
