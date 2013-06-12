var egm = egm || {};
egm.layout = egm.layout || {};

egm.layout.circle = function() {
  var circle = {},
      event = d3.dispatch("start", "tick", "end"),
      friction = .9,
      linkDistance = 20,
      linkStrength = 1,
      charge = -30,
      gravity = .1,
      theta = .8,
      grid,
      distances,
      strengths,
      charges;

  circle.tick = function() {
    if ((alpha *= .99) < .005) {
      event.end({type: "end", alpha: alpha = 0});
      return true;
    }

    for (i = 0; i < m; ++i) {
    }
  };

  circle.alpha = function(x) {
    if (!arguments.length) return alpha;

    x = +x;
    if (alpha) {
      if (x > 0) alpha = x;
      else alpha = 0;
    } else if (x > 0) {
      event.start({type: "start", alpha: alpha = x});
      d3.timer(force.tick);
    }
    
    return circle;
  };

  circle.start = function() {
    return force.resume();
  };

  circle.resume = function() {
    return circle.alpha(.1);
  };

  circle.stop = function() {
    return circle.alpha(0);
  };

  return d3.rebind(circle, event, "on");
};
