/* */ 
(function(process) {
  SVG.Matrix = SVG.invent({
    create: function(source) {
      var i,
          base = arrayToMatrix([1, 0, 0, 1, 0, 0]);
      source = source instanceof SVG.Element ? source.matrixify() : typeof source === 'string' ? stringToMatrix(source) : arguments.length == 6 ? arrayToMatrix([].slice.call(arguments)) : typeof source === 'object' ? source : base;
      for (i = abcdef.length - 1; i >= 0; --i)
        this[abcdef[i]] = source && typeof source[abcdef[i]] === 'number' ? source[abcdef[i]] : base[abcdef[i]];
    },
    extend: {
      extract: function() {
        var px = deltaTransformPoint(this, 0, 1),
            py = deltaTransformPoint(this, 1, 0),
            skewX = 180 / Math.PI * Math.atan2(px.y, px.x) - 90;
        return {
          x: this.e,
          y: this.f,
          transformedX: (this.e * Math.cos(skewX * Math.PI / 180) + this.f * Math.sin(skewX * Math.PI / 180)) / Math.sqrt(this.a * this.a + this.b * this.b),
          transformedY: (this.f * Math.cos(skewX * Math.PI / 180) + this.e * Math.sin(-skewX * Math.PI / 180)) / Math.sqrt(this.c * this.c + this.d * this.d),
          skewX: -skewX,
          skewY: 180 / Math.PI * Math.atan2(py.y, py.x),
          scaleX: Math.sqrt(this.a * this.a + this.b * this.b),
          scaleY: Math.sqrt(this.c * this.c + this.d * this.d),
          rotation: skewX,
          a: this.a,
          b: this.b,
          c: this.c,
          d: this.d,
          e: this.e,
          f: this.f,
          matrix: new SVG.Matrix(this)
        };
      },
      clone: function() {
        return new SVG.Matrix(this);
      },
      morph: function(matrix) {
        this.destination = new SVG.Matrix(matrix);
        return this;
      },
      at: function(pos) {
        if (!this.destination)
          return this;
        var matrix = new SVG.Matrix({
          a: this.a + (this.destination.a - this.a) * pos,
          b: this.b + (this.destination.b - this.b) * pos,
          c: this.c + (this.destination.c - this.c) * pos,
          d: this.d + (this.destination.d - this.d) * pos,
          e: this.e + (this.destination.e - this.e) * pos,
          f: this.f + (this.destination.f - this.f) * pos
        });
        if (this.param && this.param.to) {
          var param = {
            rotation: this.param.from.rotation + (this.param.to.rotation - this.param.from.rotation) * pos,
            cx: this.param.from.cx,
            cy: this.param.from.cy
          };
          matrix = matrix.rotate((this.param.to.rotation - this.param.from.rotation * 2) * pos, param.cx, param.cy);
          matrix.param = param;
        }
        return matrix;
      },
      multiply: function(matrix) {
        return new SVG.Matrix(this.native().multiply(parseMatrix(matrix).native()));
      },
      inverse: function() {
        return new SVG.Matrix(this.native().inverse());
      },
      translate: function(x, y) {
        return new SVG.Matrix(this.native().translate(x || 0, y || 0));
      },
      scale: function(x, y, cx, cy) {
        if (arguments.length == 1 || arguments.length == 3)
          y = x;
        if (arguments.length == 3) {
          cy = cx;
          cx = y;
        }
        return this.around(cx, cy, new SVG.Matrix(x, 0, 0, y, 0, 0));
      },
      rotate: function(r, cx, cy) {
        r = SVG.utils.radians(r);
        return this.around(cx, cy, new SVG.Matrix(Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0));
      },
      flip: function(a, o) {
        return a == 'x' ? this.scale(-1, 1, o, 0) : this.scale(1, -1, 0, o);
      },
      skew: function(x, y, cx, cy) {
        return this.around(cx, cy, this.native().skewX(x || 0).skewY(y || 0));
      },
      skewX: function(x, cx, cy) {
        return this.around(cx, cy, this.native().skewX(x || 0));
      },
      skewY: function(y, cx, cy) {
        return this.around(cx, cy, this.native().skewY(y || 0));
      },
      around: function(cx, cy, matrix) {
        return this.multiply(new SVG.Matrix(1, 0, 0, 1, cx || 0, cy || 0)).multiply(matrix).multiply(new SVG.Matrix(1, 0, 0, 1, -cx || 0, -cy || 0));
      },
      native: function() {
        var matrix = SVG.parser.native.createSVGMatrix();
        for (var i = abcdef.length - 1; i >= 0; i--)
          matrix[abcdef[i]] = this[abcdef[i]];
        return matrix;
      },
      toString: function() {
        return 'matrix(' + this.a + ',' + this.b + ',' + this.c + ',' + this.d + ',' + this.e + ',' + this.f + ')';
      }
    },
    parent: SVG.Element,
    construct: {
      ctm: function() {
        return new SVG.Matrix(this.node.getCTM());
      },
      screenCTM: function() {
        return new SVG.Matrix(this.node.getScreenCTM());
      }
    }
  });
})(require('process'));
