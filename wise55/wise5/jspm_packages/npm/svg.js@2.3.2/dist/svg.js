/* */ 
"format cjs";
(function(process) {
  ;
  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      define(function() {
        return factory(root, root.document);
      });
    } else if (typeof exports === 'object') {
      module.exports = root.document ? factory(root, root.document) : function(w) {
        return factory(w, w.document);
      };
    } else {
      root.SVG = factory(root, root.document);
    }
  }(typeof window !== "undefined" ? window : this, function(window, document) {
    var SVG = this.SVG = function(element) {
      if (SVG.supported) {
        element = new SVG.Doc(element);
        if (!SVG.parser.draw)
          SVG.prepare();
        return element;
      }
    };
    SVG.ns = 'http://www.w3.org/2000/svg';
    SVG.xmlns = 'http://www.w3.org/2000/xmlns/';
    SVG.xlink = 'http://www.w3.org/1999/xlink';
    SVG.svgjs = 'http://svgjs.com/svgjs';
    SVG.supported = (function() {
      return !!document.createElementNS && !!document.createElementNS(SVG.ns, 'svg').createSVGRect;
    })();
    if (!SVG.supported)
      return false;
    SVG.did = 1000;
    SVG.eid = function(name) {
      return 'Svgjs' + capitalize(name) + (SVG.did++);
    };
    SVG.create = function(name) {
      var element = document.createElementNS(this.ns, name);
      element.setAttribute('id', this.eid(name));
      return element;
    };
    SVG.extend = function() {
      var modules,
          methods,
          key,
          i;
      modules = [].slice.call(arguments);
      methods = modules.pop();
      for (i = modules.length - 1; i >= 0; i--)
        if (modules[i])
          for (key in methods)
            modules[i].prototype[key] = methods[key];
      if (SVG.Set && SVG.Set.inherit)
        SVG.Set.inherit();
    };
    SVG.invent = function(config) {
      var initializer = typeof config.create == 'function' ? config.create : function() {
        this.constructor.call(this, SVG.create(config.create));
      };
      if (config.inherit)
        initializer.prototype = new config.inherit;
      if (config.extend)
        SVG.extend(initializer, config.extend);
      if (config.construct)
        SVG.extend(config.parent || SVG.Container, config.construct);
      return initializer;
    };
    SVG.adopt = function(node) {
      if (!node)
        return null;
      if (node.instance)
        return node.instance;
      var element;
      if (node.nodeName == 'svg')
        element = node.parentNode instanceof SVGElement ? new SVG.Nested : new SVG.Doc;
      else if (node.nodeName == 'linearGradient')
        element = new SVG.Gradient('linear');
      else if (node.nodeName == 'radialGradient')
        element = new SVG.Gradient('radial');
      else if (SVG[capitalize(node.nodeName)])
        element = new SVG[capitalize(node.nodeName)];
      else
        element = new SVG.Element(node);
      element.type = node.nodeName;
      element.node = node;
      node.instance = element;
      if (element instanceof SVG.Doc)
        element.namespace().defs();
      element.setData(JSON.parse(node.getAttribute('svgjs:data')) || {});
      return element;
    };
    SVG.prepare = function() {
      var body = document.getElementsByTagName('body')[0],
          draw = (body ? new SVG.Doc(body) : new SVG.Doc(document.documentElement).nested()).size(2, 0);
      SVG.parser = {
        body: body || document.documentElement,
        draw: draw.style('opacity:0;position:fixed;left:100%;top:100%;overflow:hidden'),
        poly: draw.polyline().node,
        path: draw.path().node,
        native: SVG.create('svg')
      };
    };
    SVG.parser = {native: SVG.create('svg')};
    document.addEventListener('DOMContentLoaded', function() {
      if (!SVG.parser.draw)
        SVG.prepare();
    }, false);
    SVG.regex = {
      numberAndUnit: /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i,
      hex: /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
      rgb: /rgb\((\d+),(\d+),(\d+)\)/,
      reference: /#([a-z0-9\-_]+)/i,
      matrix: /matrix\(|\)/g,
      matrixElements: /,*\s+|,/,
      whitespace: /\s/g,
      isHex: /^#[a-f0-9]{3,6}$/i,
      isRgb: /^rgb\(/,
      isCss: /[^:]+:[^;]+;?/,
      isBlank: /^(\s+)?$/,
      isNumber: /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
      isPercent: /^-?[\d\.]+%$/,
      isImage: /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i,
      negExp: /e\-/gi,
      comma: /,/g,
      hyphen: /\-/g,
      pathLetters: /[MLHVCSQTAZ]/gi,
      isPathLetter: /[MLHVCSQTAZ]/i,
      whitespaces: /\s+/,
      X: /X/g
    };
    SVG.utils = {
      map: function(array, block) {
        var i,
            il = array.length,
            result = [];
        for (i = 0; i < il; i++)
          result.push(block(array[i]));
        return result;
      },
      radians: function(d) {
        return d % 360 * Math.PI / 180;
      },
      degrees: function(r) {
        return r * 180 / Math.PI % 360;
      },
      filterSVGElements: function(p) {
        return [].filter.call(p, function(el) {
          return el instanceof SVGElement;
        });
      }
    };
    SVG.defaults = {attrs: {
        'fill-opacity': 1,
        'stroke-opacity': 1,
        'stroke-width': 0,
        'stroke-linejoin': 'miter',
        'stroke-linecap': 'butt',
        fill: '#000000',
        stroke: '#000000',
        opacity: 1,
        x: 0,
        y: 0,
        cx: 0,
        cy: 0,
        width: 0,
        height: 0,
        r: 0,
        rx: 0,
        ry: 0,
        offset: 0,
        'stop-opacity': 1,
        'stop-color': '#000000',
        'font-size': 16,
        'font-family': 'Helvetica, Arial, sans-serif',
        'text-anchor': 'start'
      }};
    SVG.Color = function(color) {
      var match;
      this.r = 0;
      this.g = 0;
      this.b = 0;
      if (!color)
        return;
      if (typeof color === 'string') {
        if (SVG.regex.isRgb.test(color)) {
          match = SVG.regex.rgb.exec(color.replace(/\s/g, ''));
          this.r = parseInt(match[1]);
          this.g = parseInt(match[2]);
          this.b = parseInt(match[3]);
        } else if (SVG.regex.isHex.test(color)) {
          match = SVG.regex.hex.exec(fullHex(color));
          this.r = parseInt(match[1], 16);
          this.g = parseInt(match[2], 16);
          this.b = parseInt(match[3], 16);
        }
      } else if (typeof color === 'object') {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
      }
    };
    SVG.extend(SVG.Color, {
      toString: function() {
        return this.toHex();
      },
      toHex: function() {
        return '#' + compToHex(this.r) + compToHex(this.g) + compToHex(this.b);
      },
      toRgb: function() {
        return 'rgb(' + [this.r, this.g, this.b].join() + ')';
      },
      brightness: function() {
        return (this.r / 255 * 0.30) + (this.g / 255 * 0.59) + (this.b / 255 * 0.11);
      },
      morph: function(color) {
        this.destination = new SVG.Color(color);
        return this;
      },
      at: function(pos) {
        if (!this.destination)
          return this;
        pos = pos < 0 ? 0 : pos > 1 ? 1 : pos;
        return new SVG.Color({
          r: ~~(this.r + (this.destination.r - this.r) * pos),
          g: ~~(this.g + (this.destination.g - this.g) * pos),
          b: ~~(this.b + (this.destination.b - this.b) * pos)
        });
      }
    });
    SVG.Color.test = function(color) {
      color += '';
      return SVG.regex.isHex.test(color) || SVG.regex.isRgb.test(color);
    };
    SVG.Color.isRgb = function(color) {
      return color && typeof color.r == 'number' && typeof color.g == 'number' && typeof color.b == 'number';
    };
    SVG.Color.isColor = function(color) {
      return SVG.Color.isRgb(color) || SVG.Color.test(color);
    };
    SVG.Array = function(array, fallback) {
      array = (array || []).valueOf();
      if (array.length == 0 && fallback)
        array = fallback.valueOf();
      this.value = this.parse(array);
    };
    SVG.extend(SVG.Array, {
      morph: function(array) {
        this.destination = this.parse(array);
        if (this.value.length != this.destination.length) {
          var lastValue = this.value[this.value.length - 1],
              lastDestination = this.destination[this.destination.length - 1];
          while (this.value.length > this.destination.length)
            this.destination.push(lastDestination);
          while (this.value.length < this.destination.length)
            this.value.push(lastValue);
        }
        return this;
      },
      settle: function() {
        for (var i = 0,
            il = this.value.length,
            seen = []; i < il; i++)
          if (seen.indexOf(this.value[i]) == -1)
            seen.push(this.value[i]);
        return this.value = seen;
      },
      at: function(pos) {
        if (!this.destination)
          return this;
        for (var i = 0,
            il = this.value.length,
            array = []; i < il; i++)
          array.push(this.value[i] + (this.destination[i] - this.value[i]) * pos);
        return new SVG.Array(array);
      },
      toString: function() {
        return this.value.join(' ');
      },
      valueOf: function() {
        return this.value;
      },
      parse: function(array) {
        array = array.valueOf();
        if (Array.isArray(array))
          return array;
        return this.split(array);
      },
      split: function(string) {
        return string.trim().split(/\s+/);
      },
      reverse: function() {
        this.value.reverse();
        return this;
      }
    });
    SVG.PointArray = function(array, fallback) {
      this.constructor.call(this, array, fallback || [[0, 0]]);
    };
    SVG.PointArray.prototype = new SVG.Array;
    SVG.extend(SVG.PointArray, {
      toString: function() {
        for (var i = 0,
            il = this.value.length,
            array = []; i < il; i++)
          array.push(this.value[i].join(','));
        return array.join(' ');
      },
      toLine: function() {
        return {
          x1: this.value[0][0],
          y1: this.value[0][1],
          x2: this.value[1][0],
          y2: this.value[1][1]
        };
      },
      at: function(pos) {
        if (!this.destination)
          return this;
        for (var i = 0,
            il = this.value.length,
            array = []; i < il; i++)
          array.push([this.value[i][0] + (this.destination[i][0] - this.value[i][0]) * pos, this.value[i][1] + (this.destination[i][1] - this.value[i][1]) * pos]);
        return new SVG.PointArray(array);
      },
      parse: function(array) {
        array = array.valueOf();
        if (Array.isArray(array))
          return array;
        array = this.split(array);
        for (var i = 0,
            il = array.length,
            p,
            points = []; i < il; i++) {
          p = array[i].split(',');
          points.push([parseFloat(p[0]), parseFloat(p[1])]);
        }
        return points;
      },
      move: function(x, y) {
        var box = this.bbox();
        x -= box.x;
        y -= box.y;
        if (!isNaN(x) && !isNaN(y))
          for (var i = this.value.length - 1; i >= 0; i--)
            this.value[i] = [this.value[i][0] + x, this.value[i][1] + y];
        return this;
      },
      size: function(width, height) {
        var i,
            box = this.bbox();
        for (i = this.value.length - 1; i >= 0; i--) {
          this.value[i][0] = ((this.value[i][0] - box.x) * width) / box.width + box.x;
          this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y;
        }
        return this;
      },
      bbox: function() {
        SVG.parser.poly.setAttribute('points', this.toString());
        return SVG.parser.poly.getBBox();
      }
    });
    SVG.PathArray = function(array, fallback) {
      this.constructor.call(this, array, fallback || [['M', 0, 0]]);
    };
    SVG.PathArray.prototype = new SVG.Array;
    SVG.extend(SVG.PathArray, {
      toString: function() {
        return arrayToString(this.value);
      },
      move: function(x, y) {
        var box = this.bbox();
        x -= box.x;
        y -= box.y;
        if (!isNaN(x) && !isNaN(y)) {
          for (var l,
              i = this.value.length - 1; i >= 0; i--) {
            l = this.value[i][0];
            if (l == 'M' || l == 'L' || l == 'T') {
              this.value[i][1] += x;
              this.value[i][2] += y;
            } else if (l == 'H') {
              this.value[i][1] += x;
            } else if (l == 'V') {
              this.value[i][1] += y;
            } else if (l == 'C' || l == 'S' || l == 'Q') {
              this.value[i][1] += x;
              this.value[i][2] += y;
              this.value[i][3] += x;
              this.value[i][4] += y;
              if (l == 'C') {
                this.value[i][5] += x;
                this.value[i][6] += y;
              }
            } else if (l == 'A') {
              this.value[i][6] += x;
              this.value[i][7] += y;
            }
          }
        }
        return this;
      },
      size: function(width, height) {
        var i,
            l,
            box = this.bbox();
        for (i = this.value.length - 1; i >= 0; i--) {
          l = this.value[i][0];
          if (l == 'M' || l == 'L' || l == 'T') {
            this.value[i][1] = ((this.value[i][1] - box.x) * width) / box.width + box.x;
            this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y;
          } else if (l == 'H') {
            this.value[i][1] = ((this.value[i][1] - box.x) * width) / box.width + box.x;
          } else if (l == 'V') {
            this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y;
          } else if (l == 'C' || l == 'S' || l == 'Q') {
            this.value[i][1] = ((this.value[i][1] - box.x) * width) / box.width + box.x;
            this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y;
            this.value[i][3] = ((this.value[i][3] - box.x) * width) / box.width + box.x;
            this.value[i][4] = ((this.value[i][4] - box.y) * height) / box.height + box.y;
            if (l == 'C') {
              this.value[i][5] = ((this.value[i][5] - box.x) * width) / box.width + box.x;
              this.value[i][6] = ((this.value[i][6] - box.y) * height) / box.height + box.y;
            }
          } else if (l == 'A') {
            this.value[i][1] = (this.value[i][1] * width) / box.width;
            this.value[i][2] = (this.value[i][2] * height) / box.height;
            this.value[i][6] = ((this.value[i][6] - box.x) * width) / box.width + box.x;
            this.value[i][7] = ((this.value[i][7] - box.y) * height) / box.height + box.y;
          }
        }
        return this;
      },
      parse: function(array) {
        if (array instanceof SVG.PathArray)
          return array.valueOf();
        var i,
            x0,
            y0,
            s,
            seg,
            arr,
            x = 0,
            y = 0,
            paramCnt = {
              'M': 2,
              'L': 2,
              'H': 1,
              'V': 1,
              'C': 6,
              'S': 4,
              'Q': 4,
              'T': 2,
              'A': 7
            };
        if (typeof array == 'string') {
          array = array.replace(SVG.regex.negExp, 'X').replace(SVG.regex.pathLetters, ' $& ').replace(SVG.regex.hyphen, ' -').replace(SVG.regex.comma, ' ').replace(SVG.regex.X, 'e-').trim().split(SVG.regex.whitespaces);
          for (i = array.length; --i; ) {
            if (array[i].indexOf('.') != array[i].lastIndexOf('.')) {
              var split = array[i].split('.');
              var first = [split.shift(), split.shift()].join('.');
              array.splice.apply(array, [i, 1].concat(first, split.map(function(el) {
                return '.' + el;
              })));
            }
          }
        } else {
          array = array.reduce(function(prev, curr) {
            return [].concat.apply(prev, curr);
          }, []);
        }
        var arr = [];
        do {
          if (SVG.regex.isPathLetter.test(array[0])) {
            s = array[0];
            array.shift();
          } else if (s == 'M') {
            s = 'L';
          } else if (s == 'm') {
            s = 'l';
          }
          seg = [s.toUpperCase()];
          for (i = 0; i < paramCnt[seg[0]]; ++i) {
            seg.push(parseFloat(array.shift()));
          }
          if (s == seg[0]) {
            if (s == 'M' || s == 'L' || s == 'C' || s == 'Q' || s == 'S' || s == 'T') {
              x = seg[paramCnt[seg[0]] - 1];
              y = seg[paramCnt[seg[0]]];
            } else if (s == 'V') {
              y = seg[1];
            } else if (s == 'H') {
              x = seg[1];
            } else if (s == 'A') {
              x = seg[6];
              y = seg[7];
            }
          } else {
            if (s == 'm' || s == 'l' || s == 'c' || s == 's' || s == 'q' || s == 't') {
              seg[1] += x;
              seg[2] += y;
              if (seg[3] != null) {
                seg[3] += x;
                seg[4] += y;
              }
              if (seg[5] != null) {
                seg[5] += x;
                seg[6] += y;
              }
              x = seg[paramCnt[seg[0]] - 1];
              y = seg[paramCnt[seg[0]]];
            } else if (s == 'v') {
              seg[1] += y;
              y = seg[1];
            } else if (s == 'h') {
              seg[1] += x;
              x = seg[1];
            } else if (s == 'a') {
              seg[6] += x;
              seg[7] += y;
              x = seg[6];
              y = seg[7];
            }
          }
          if (seg[0] == 'M') {
            x0 = x;
            y0 = y;
          }
          if (seg[0] == 'Z') {
            x = x0;
            y = y0;
          }
          arr.push(seg);
        } while (array.length);
        return arr;
      },
      bbox: function() {
        SVG.parser.path.setAttribute('d', this.toString());
        return SVG.parser.path.getBBox();
      }
    });
    SVG.Number = SVG.invent({
      create: function(value, unit) {
        this.value = 0;
        this.unit = unit || '';
        if (typeof value === 'number') {
          this.value = isNaN(value) ? 0 : !isFinite(value) ? (value < 0 ? -3.4e+38 : +3.4e+38) : value;
        } else if (typeof value === 'string') {
          unit = value.match(SVG.regex.numberAndUnit);
          if (unit) {
            this.value = parseFloat(unit[1]);
            if (unit[5] == '%')
              this.value /= 100;
            else if (unit[5] == 's')
              this.value *= 1000;
            this.unit = unit[5];
          }
        } else {
          if (value instanceof SVG.Number) {
            this.value = value.valueOf();
            this.unit = value.unit;
          }
        }
      },
      extend: {
        toString: function() {
          return (this.unit == '%' ? ~~(this.value * 1e8) / 1e6 : this.unit == 's' ? this.value / 1e3 : this.value) + this.unit;
        },
        toJSON: function() {
          return this.toString();
        },
        valueOf: function() {
          return this.value;
        },
        plus: function(number) {
          return new SVG.Number(this + new SVG.Number(number), this.unit);
        },
        minus: function(number) {
          return this.plus(-new SVG.Number(number));
        },
        times: function(number) {
          return new SVG.Number(this * new SVG.Number(number), this.unit);
        },
        divide: function(number) {
          return new SVG.Number(this / new SVG.Number(number), this.unit);
        },
        to: function(unit) {
          var number = new SVG.Number(this);
          if (typeof unit === 'string')
            number.unit = unit;
          return number;
        },
        morph: function(number) {
          this.destination = new SVG.Number(number);
          return this;
        },
        at: function(pos) {
          if (!this.destination)
            return this;
          return new SVG.Number(this.destination).minus(this).times(pos).plus(this);
        }
      }
    });
    SVG.Element = SVG.invent({
      create: function(node) {
        this._stroke = SVG.defaults.attrs.stroke;
        this.dom = {};
        if (this.node = node) {
          this.type = node.nodeName;
          this.node.instance = this;
          this._stroke = node.getAttribute('stroke') || this._stroke;
        }
      },
      extend: {
        x: function(x) {
          return this.attr('x', x);
        },
        y: function(y) {
          return this.attr('y', y);
        },
        cx: function(x) {
          return x == null ? this.x() + this.width() / 2 : this.x(x - this.width() / 2);
        },
        cy: function(y) {
          return y == null ? this.y() + this.height() / 2 : this.y(y - this.height() / 2);
        },
        move: function(x, y) {
          return this.x(x).y(y);
        },
        center: function(x, y) {
          return this.cx(x).cy(y);
        },
        width: function(width) {
          return this.attr('width', width);
        },
        height: function(height) {
          return this.attr('height', height);
        },
        size: function(width, height) {
          var p = proportionalSize(this.bbox(), width, height);
          return this.width(new SVG.Number(p.width)).height(new SVG.Number(p.height));
        },
        clone: function(parent) {
          var clone = assignNewId(this.node.cloneNode(true));
          if (parent)
            parent.add(clone);
          else
            this.after(clone);
          return clone;
        },
        remove: function() {
          if (this.parent())
            this.parent().removeElement(this);
          return this;
        },
        replace: function(element) {
          this.after(element).remove();
          return element;
        },
        addTo: function(parent) {
          return parent.put(this);
        },
        putIn: function(parent) {
          return parent.add(this);
        },
        id: function(id) {
          return this.attr('id', id);
        },
        inside: function(x, y) {
          var box = this.bbox();
          return x > box.x && y > box.y && x < box.x + box.width && y < box.y + box.height;
        },
        show: function() {
          return this.style('display', '');
        },
        hide: function() {
          return this.style('display', 'none');
        },
        visible: function() {
          return this.style('display') != 'none';
        },
        toString: function() {
          return this.attr('id');
        },
        classes: function() {
          var attr = this.attr('class');
          return attr == null ? [] : attr.trim().split(/\s+/);
        },
        hasClass: function(name) {
          return this.classes().indexOf(name) != -1;
        },
        addClass: function(name) {
          if (!this.hasClass(name)) {
            var array = this.classes();
            array.push(name);
            this.attr('class', array.join(' '));
          }
          return this;
        },
        removeClass: function(name) {
          if (this.hasClass(name)) {
            this.attr('class', this.classes().filter(function(c) {
              return c != name;
            }).join(' '));
          }
          return this;
        },
        toggleClass: function(name) {
          return this.hasClass(name) ? this.removeClass(name) : this.addClass(name);
        },
        reference: function(attr) {
          return SVG.get(this.attr(attr));
        },
        parent: function(type) {
          var parent = this;
          if (!parent.node.parentNode)
            return null;
          parent = SVG.adopt(parent.node.parentNode);
          if (!type)
            return parent;
          while (parent && parent.node instanceof SVGElement) {
            if (typeof type === 'string' ? parent.matches(type) : parent instanceof type)
              return parent;
            parent = SVG.adopt(parent.node.parentNode);
          }
        },
        doc: function() {
          return this instanceof SVG.Doc ? this : this.parent(SVG.Doc);
        },
        parents: function(type) {
          var parents = [],
              parent = this;
          do {
            parent = parent.parent(type);
            if (!parent || !parent.node)
              break;
            parents.push(parent);
          } while (parent.parent);
          return parents;
        },
        matches: function(selector) {
          return matches(this.node, selector);
        },
        native: function() {
          return this.node;
        },
        svg: function(svg) {
          var well = document.createElement('svg');
          if (svg && this instanceof SVG.Parent) {
            well.innerHTML = '<svg>' + svg.replace(/\n/, '').replace(/<(\w+)([^<]+?)\/>/g, '<$1$2></$1>') + '</svg>';
            for (var i = 0,
                il = well.firstChild.childNodes.length; i < il; i++)
              this.node.appendChild(well.firstChild.firstChild);
          } else {
            well.appendChild(svg = document.createElement('svg'));
            this.writeDataToDom();
            svg.appendChild(this.node.cloneNode(true));
            return well.innerHTML.replace(/^<svg>/, '').replace(/<\/svg>$/, '');
          }
          return this;
        },
        writeDataToDom: function() {
          if (this.each || this.lines) {
            var fn = this.each ? this : this.lines();
            fn.each(function() {
              this.writeDataToDom();
            });
          }
          this.node.removeAttribute('svgjs:data');
          if (Object.keys(this.dom).length)
            this.node.setAttribute('svgjs:data', JSON.stringify(this.dom));
          return this;
        },
        setData: function(o) {
          this.dom = o;
          return this;
        },
        is: function(obj) {
          return is(this, obj);
        }
      }
    });
    SVG.easing = {
      '-': function(pos) {
        return pos;
      },
      '<>': function(pos) {
        return -Math.cos(pos * Math.PI) / 2 + 0.5;
      },
      '>': function(pos) {
        return Math.sin(pos * Math.PI / 2);
      },
      '<': function(pos) {
        return -Math.cos(pos * Math.PI / 2) + 1;
      }
    };
    SVG.morph = function(pos) {
      return function(from, to) {
        return new SVG.MorphObj(from, to).at(pos);
      };
    };
    SVG.Situation = SVG.invent({create: function(o) {
        this.init = false;
        this.reversed = false;
        this.reversing = false;
        this.duration = new SVG.Number(o.duration).valueOf();
        this.delay = new SVG.Number(o.delay).valueOf();
        this.start = +new Date() + this.delay;
        this.finish = this.start + this.duration;
        this.ease = o.ease;
        this.loop = false;
        this.loops = false;
        this.animations = {};
        this.attrs = {};
        this.styles = {};
        this.transforms = [];
        this.once = {};
      }});
    SVG.Delay = function(delay) {
      this.delay = new SVG.Number(delay).valueOf();
    };
    SVG.FX = SVG.invent({
      create: function(element) {
        this._target = element;
        this.situations = [];
        this.active = false;
        this.situation = null;
        this.paused = false;
        this.lastPos = 0;
        this.pos = 0;
      },
      extend: {
        animate: function(o, ease, delay) {
          if (typeof o == 'object') {
            ease = o.ease;
            delay = o.delay;
            o = o.duration;
          }
          var situation = new SVG.Situation({
            duration: o || 1000,
            delay: delay || 0,
            ease: SVG.easing[ease || '-'] || ease
          });
          this.queue(situation);
          return this;
        },
        delay: function(delay) {
          var delay = new SVG.Delay(delay);
          return this.queue(delay);
        },
        target: function(target) {
          if (target && target instanceof SVG.Element) {
            this._target = target;
            return this;
          }
          return this._target;
        },
        timeToPos: function(timestamp) {
          return (timestamp - this.situation.start) / (this.situation.duration);
        },
        posToTime: function(pos) {
          return this.situation.duration * pos + this.situation.start;
        },
        startAnimFrame: function() {
          this.stopAnimFrame();
          this.animationFrame = requestAnimationFrame(function() {
            this.step();
          }.bind(this));
        },
        stopAnimFrame: function() {
          cancelAnimationFrame(this.animationFrame);
        },
        start: function() {
          if (!this.active && this.situation) {
            this.situation.start = +new Date + this.situation.delay;
            this.situation.finish = this.situation.start + this.situation.duration;
            this.initAnimations();
            this.active = true;
            this.startAnimFrame();
          }
          return this;
        },
        queue: function(fn) {
          if (typeof fn == 'function' || fn instanceof SVG.Situation || fn instanceof SVG.Delay)
            this.situations.push(fn);
          if (!this.situation)
            this.situation = this.situations.shift();
          return this;
        },
        dequeue: function() {
          this.situation && this.situation.stop && this.situation.stop();
          this.situation = this.situations.shift();
          if (this.situation) {
            var fn = function() {
              if (this.situation instanceof SVG.Situation)
                this.initAnimations().at(0);
              else if (this.situation instanceof SVG.Delay)
                this.dequeue();
              else
                this.situation.call(this);
            }.bind(this);
            if (this.situation.delay) {
              setTimeout(function() {
                fn();
              }, this.situation.delay);
            } else {
              fn();
            }
          }
          return this;
        },
        initAnimations: function() {
          var i;
          var s = this.situation;
          if (s.init)
            return this;
          for (i in s.animations) {
            if (i == 'viewbox') {
              s.animations[i] = this.target().viewbox().morph(s.animations[i]);
            } else {
              s.animations[i].value = (i == 'plot' ? this.target().array().value : this.target()[i]());
              if (s.animations[i].value.value) {
                s.animations[i].value = s.animations[i].value.value;
              }
              if (s.animations[i].relative)
                s.animations[i].destination.value = s.animations[i].destination.value + s.animations[i].value;
            }
          }
          for (i in s.attrs) {
            if (s.attrs[i] instanceof SVG.Color) {
              var color = new SVG.Color(this.target().attr(i));
              s.attrs[i].r = color.r;
              s.attrs[i].g = color.g;
              s.attrs[i].b = color.b;
            } else {
              s.attrs[i].value = this.target().attr(i);
            }
          }
          for (i in s.styles) {
            s.styles[i].value = this.target().style(i);
          }
          s.initialTransformation = this.target().matrixify();
          s.init = true;
          return this;
        },
        clearQueue: function() {
          this.situations = [];
          return this;
        },
        clearCurrent: function() {
          this.situation = null;
          return this;
        },
        stop: function(jumpToEnd, clearQueue) {
          if (!this.active)
            this.start();
          if (clearQueue) {
            this.clearQueue();
          }
          this.active = false;
          if (jumpToEnd && this.situation) {
            this.situation.loop = false;
            if (this.situation.loops % 2 == 0 && this.situation.reversing) {
              this.situation.reversed = true;
            }
            this.at(1);
          }
          this.stopAnimFrame();
          clearTimeout(this.timeout);
          return this.clearCurrent();
        },
        reset: function() {
          if (this.situation) {
            var temp = this.situation;
            this.stop();
            this.situation = temp;
            this.at(0);
          }
          return this;
        },
        finish: function() {
          this.stop(true, false);
          while (this.dequeue().situation && this.stop(true, false))
            ;
          this.clearQueue().clearCurrent();
          return this;
        },
        at: function(pos) {
          this.pos = pos;
          this.situation.start = +new Date - pos * this.situation.duration;
          this.situation.finish = this.situation.start + this.situation.duration;
          return this.step(true);
        },
        speed: function(speed) {
          this.situation.duration = this.situation.duration * this.pos + (1 - this.pos) * this.situation.duration / speed;
          this.situation.finish = this.situation.start + this.situation.duration;
          return this.at(this.pos);
        },
        loop: function(times, reverse) {
          this.situation.loop = this.situation.loops = times || true;
          if (reverse)
            this.last().reversing = true;
          return this;
        },
        pause: function() {
          this.paused = true;
          this.stopAnimFrame();
          clearTimeout(this.timeout);
          return this;
        },
        play: function() {
          if (!this.paused)
            return this;
          this.paused = false;
          return this.at(this.pos);
        },
        reverse: function(reversed) {
          var c = this.last();
          if (typeof reversed == 'undefined')
            c.reversed = !c.reversed;
          else
            c.reversed = reversed;
          return this;
        },
        progress: function(easeIt) {
          return easeIt ? this.situation.ease(this.pos) : this.pos;
        },
        after: function(fn) {
          var c = this.last(),
              wrapper = function wrapper(e) {
                if (e.detail.situation == c) {
                  fn.call(this, c);
                  this.off('finished.fx', wrapper);
                }
              };
          this.target().on('finished.fx', wrapper);
          return this;
        },
        during: function(fn) {
          var c = this.last(),
              wrapper = function(e) {
                if (e.detail.situation == c) {
                  fn.call(this, e.detail.pos, SVG.morph(e.detail.pos), e.detail.eased, c);
                }
              };
          this.target().off('during.fx', wrapper).on('during.fx', wrapper);
          return this.after(function() {
            this.off('during.fx', wrapper);
          });
        },
        afterAll: function(fn) {
          var wrapper = function wrapper(e) {
            fn.call(this);
            this.off('allfinished.fx', wrapper);
          };
          this.target().off('allfinished.fx', wrapper).on('allfinished.fx', wrapper);
          return this;
        },
        duringAll: function(fn) {
          var wrapper = function(e) {
            fn.call(this, e.detail.pos, SVG.morph(e.detail.pos), e.detail.eased, e.detail.situation);
          };
          this.target().off('during.fx', wrapper).on('during.fx', wrapper);
          return this.afterAll(function() {
            this.off('during.fx', wrapper);
          });
        },
        last: function() {
          return this.situations.length ? this.situations[this.situations.length - 1] : this.situation;
        },
        add: function(method, args, type) {
          this.last()[type || 'animations'][method] = args;
          setTimeout(function() {
            this.start();
          }.bind(this), 0);
          return this;
        },
        step: function(ignoreTime) {
          if (!ignoreTime)
            this.pos = this.timeToPos(+new Date);
          if (this.pos >= 1 && (this.situation.loop === true || (typeof this.situation.loop == 'number' && --this.situation.loop))) {
            if (this.situation.reversing) {
              this.situation.reversed = !this.situation.reversed;
            }
            return this.at(this.pos - 1);
          }
          if (this.situation.reversed)
            this.pos = 1 - this.pos;
          if (this.pos > 1)
            this.pos = 1;
          if (this.pos < 0)
            this.pos = 0;
          var eased = this.situation.ease(this.pos);
          for (var i in this.situation.once) {
            if (i > this.lastPos && i <= eased) {
              this.situation.once[i].call(this.target(), this.pos, eased);
              delete this.situation.once[i];
            }
          }
          if (this.active)
            this.target().fire('during', {
              pos: this.pos,
              eased: eased,
              fx: this,
              situation: this.situation
            });
          if (!this.situation) {
            return this;
          }
          this.eachAt();
          if ((this.pos == 1 && !this.situation.reversed) || (this.situation.reversed && this.pos == 0)) {
            this.stopAnimFrame();
            this.target().fire('finished', {
              fx: this,
              situation: this.situation
            });
            if (!this.situations.length) {
              this.target().fire('allfinished');
              this.target().off('.fx');
              this.active = false;
            }
            if (this.active)
              this.dequeue();
            else
              this.clearCurrent();
          } else if (!this.paused && this.active) {
            this.startAnimFrame();
          }
          this.lastPos = eased;
          return this;
        },
        eachAt: function() {
          var i,
              at,
              self = this,
              target = this.target(),
              s = this.situation;
          for (i in s.animations) {
            at = [].concat(s.animations[i]).map(function(el) {
              return el.at ? el.at(s.ease(self.pos), self.pos) : el;
            });
            target[i].apply(target, at);
          }
          for (i in s.attrs) {
            at = [i].concat(s.attrs[i]).map(function(el) {
              return el.at ? el.at(s.ease(self.pos), self.pos) : el;
            });
            target.attr.apply(target, at);
          }
          for (i in s.styles) {
            at = [i].concat(s.styles[i]).map(function(el) {
              return el.at ? el.at(s.ease(self.pos), self.pos) : el;
            });
            target.style.apply(target, at);
          }
          if (s.transforms.length) {
            at = s.initialTransformation;
            for (i in s.transforms) {
              var a = s.transforms[i];
              if (a instanceof SVG.Matrix) {
                if (a.relative) {
                  at = at.multiply(a.at(s.ease(this.pos)));
                } else {
                  at = at.morph(a).at(s.ease(this.pos));
                }
                continue;
              }
              if (!a.relative)
                a.undo(at.extract());
              at = at.multiply(a.at(s.ease(this.pos)));
            }
            target.matrix(at);
          }
          return this;
        },
        once: function(pos, fn, isEased) {
          if (!isEased)
            pos = this.situation.ease(pos);
          this.situation.once[pos] = fn;
          return this;
        }
      },
      parent: SVG.Element,
      construct: {
        animate: function(o, ease, delay) {
          return (this.fx || (this.fx = new SVG.FX(this))).animate(o, ease, delay);
        },
        delay: function(delay) {
          return (this.fx || (this.fx = new SVG.FX(this))).delay(delay);
        },
        stop: function(jumpToEnd, clearQueue) {
          if (this.fx)
            this.fx.stop(jumpToEnd, clearQueue);
          return this;
        },
        finish: function() {
          if (this.fx)
            this.fx.finish();
          return this;
        },
        pause: function() {
          if (this.fx)
            this.fx.pause();
          return this;
        },
        play: function() {
          if (this.fx)
            this.fx.play();
          return this;
        }
      }
    });
    SVG.MorphObj = SVG.invent({
      create: function(from, to) {
        if (SVG.Color.isColor(to))
          return new SVG.Color(from).morph(to);
        if (SVG.regex.numberAndUnit.test(to))
          return new SVG.Number(from).morph(to);
        this.value = 0;
        this.destination = to;
      },
      extend: {
        at: function(pos, real) {
          return real < 1 ? this.value : this.destination;
        },
        valueOf: function() {
          return this.value;
        }
      }
    });
    SVG.extend(SVG.FX, {
      attr: function(a, v, relative) {
        if (typeof a == 'object') {
          for (var key in a)
            this.attr(key, a[key]);
        } else {
          this.add(a, new SVG.MorphObj(null, v), 'attrs');
        }
        return this;
      },
      style: function(s, v) {
        if (typeof s == 'object')
          for (var key in s)
            this.style(key, s[key]);
        else
          this.add(s, new SVG.MorphObj(null, v), 'styles');
        return this;
      },
      x: function(x, relative) {
        if (this.target() instanceof SVG.G) {
          this.transform({x: x}, relative);
          return this;
        }
        var num = new SVG.Number().morph(x);
        num.relative = relative;
        return this.add('x', num);
      },
      y: function(y, relative) {
        if (this.target() instanceof SVG.G) {
          this.transform({y: y}, relative);
          return this;
        }
        var num = new SVG.Number().morph(y);
        num.relative = relative;
        return this.add('y', num);
      },
      cx: function(x) {
        return this.add('cx', new SVG.Number().morph(x));
      },
      cy: function(y) {
        return this.add('cy', new SVG.Number().morph(y));
      },
      move: function(x, y) {
        return this.x(x).y(y);
      },
      center: function(x, y) {
        return this.cx(x).cy(y);
      },
      size: function(width, height) {
        if (this.target() instanceof SVG.Text) {
          this.attr('font-size', width);
        } else {
          var box;
          if (!width || !height) {
            box = this.target().bbox();
          }
          if (!width) {
            width = box.width / box.height * height;
          }
          if (!height) {
            height = box.height / box.width * width;
          }
          this.add('width', new SVG.Number().morph(width)).add('height', new SVG.Number().morph(height));
        }
        return this;
      },
      plot: function(p) {
        return this.add('plot', this.target().array().morph(p));
      },
      leading: function(value) {
        return this.target().leading ? this.add('leading', new SVG.Number().morph(value)) : this;
      },
      viewbox: function(x, y, width, height) {
        if (this.target() instanceof SVG.Container) {
          this.add('viewbox', new SVG.ViewBox(x, y, width, height));
        }
        return this;
      },
      update: function(o) {
        if (this.target() instanceof SVG.Stop) {
          if (typeof o == 'number' || o instanceof SVG.Number) {
            return this.update({
              offset: arguments[0],
              color: arguments[1],
              opacity: arguments[2]
            });
          }
          if (o.opacity != null)
            this.attr('stop-opacity', o.opacity);
          if (o.color != null)
            this.attr('stop-color', o.color);
          if (o.offset != null)
            this.attr('offset', o.offset);
        }
        return this;
      }
    });
    SVG.BBox = SVG.invent({
      create: function(element) {
        if (element) {
          var box;
          try {
            if (!document.documentElement.contains(element.node))
              throw new Exception('Element not in the dom');
            box = element.node.getBBox();
          } catch (e) {
            if (element instanceof SVG.Shape) {
              var clone = element.clone(SVG.parser.draw);
              box = clone.bbox();
              clone.remove();
            } else {
              box = {
                x: element.node.clientLeft,
                y: element.node.clientTop,
                width: element.node.clientWidth,
                height: element.node.clientHeight
              };
            }
          }
          this.x = box.x;
          this.y = box.y;
          this.width = box.width;
          this.height = box.height;
        }
        fullBox(this);
      },
      parent: SVG.Element,
      construct: {bbox: function() {
          return new SVG.BBox(this);
        }}
    });
    SVG.TBox = SVG.invent({
      create: function(element) {
        if (element) {
          var t = element.ctm().extract(),
              box = element.bbox();
          this.width = box.width * t.scaleX;
          this.height = box.height * t.scaleY;
          this.x = box.x + t.x;
          this.y = box.y + t.y;
        }
        fullBox(this);
      },
      parent: SVG.Element,
      construct: {tbox: function() {
          return new SVG.TBox(this);
        }}
    });
    SVG.RBox = SVG.invent({
      create: function(element) {
        if (element) {
          var e = element.doc().parent(),
              box = element.node.getBoundingClientRect(),
              zoom = 1;
          this.x = box.left;
          this.y = box.top;
          this.x -= e.offsetLeft;
          this.y -= e.offsetTop;
          while (e = e.offsetParent) {
            this.x -= e.offsetLeft;
            this.y -= e.offsetTop;
          }
          e = element;
          while (e.parent && (e = e.parent())) {
            if (e.viewbox) {
              zoom *= e.viewbox().zoom;
              this.x -= e.x() || 0;
              this.y -= e.y() || 0;
            }
          }
          this.width = box.width /= zoom;
          this.height = box.height /= zoom;
        }
        fullBox(this);
        this.x += window.pageXOffset;
        this.y += window.pageYOffset;
      },
      parent: SVG.Element,
      construct: {rbox: function() {
          return new SVG.RBox(this);
        }}
    });
    ;
    [SVG.BBox, SVG.TBox, SVG.RBox].forEach(function(c) {
      SVG.extend(c, {merge: function(box) {
          var b = new c();
          b.x = Math.min(this.x, box.x);
          b.y = Math.min(this.y, box.y);
          b.width = Math.max(this.x + this.width, box.x + box.width) - b.x;
          b.height = Math.max(this.y + this.height, box.y + box.height) - b.y;
          return fullBox(b);
        }});
    });
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
    SVG.Point = SVG.invent({
      create: function(x, y) {
        var i,
            source,
            base = {
              x: 0,
              y: 0
            };
        source = Array.isArray(x) ? {
          x: x[0],
          y: x[1]
        } : typeof x === 'object' ? {
          x: x.x,
          y: x.y
        } : y != null ? {
          x: x,
          y: y
        } : base;
        this.x = source.x;
        this.y = source.y;
      },
      extend: {
        clone: function() {
          return new SVG.Point(this);
        },
        morph: function(point) {
          this.destination = new SVG.Point(point);
          return this;
        },
        at: function(pos) {
          if (!this.destination)
            return this;
          var point = new SVG.Point({
            x: this.x + (this.destination.x - this.x) * pos,
            y: this.y + (this.destination.y - this.y) * pos
          });
          return point;
        },
        native: function() {
          var point = SVG.parser.native.createSVGPoint();
          point.x = this.x;
          point.y = this.y;
          return point;
        },
        transform: function(matrix) {
          return new SVG.Point(this.native().matrixTransform(matrix.native()));
        }
      }
    });
    SVG.extend(SVG.Element, {point: function(x, y) {
        return new SVG.Point(x, y).transform(this.screenCTM().inverse());
      }});
    SVG.extend(SVG.Element, {attr: function(a, v, n) {
        if (a == null) {
          a = {};
          v = this.node.attributes;
          for (n = v.length - 1; n >= 0; n--)
            a[v[n].nodeName] = SVG.regex.isNumber.test(v[n].nodeValue) ? parseFloat(v[n].nodeValue) : v[n].nodeValue;
          return a;
        } else if (typeof a == 'object') {
          for (v in a)
            this.attr(v, a[v]);
        } else if (v === null) {
          this.node.removeAttribute(a);
        } else if (v == null) {
          v = this.node.getAttribute(a);
          return v == null ? SVG.defaults.attrs[a] : SVG.regex.isNumber.test(v) ? parseFloat(v) : v;
        } else {
          if (a == 'stroke-width')
            this.attr('stroke', parseFloat(v) > 0 ? this._stroke : null);
          else if (a == 'stroke')
            this._stroke = v;
          if (a == 'fill' || a == 'stroke') {
            if (SVG.regex.isImage.test(v))
              v = this.doc().defs().image(v, 0, 0);
            if (v instanceof SVG.Image)
              v = this.doc().defs().pattern(0, 0, function() {
                this.add(v);
              });
          }
          if (typeof v === 'number')
            v = new SVG.Number(v);
          else if (SVG.Color.isColor(v))
            v = new SVG.Color(v);
          else if (Array.isArray(v))
            v = new SVG.Array(v);
          else if (v instanceof SVG.Matrix && v.param)
            this.param = v.param;
          if (a == 'leading') {
            if (this.leading)
              this.leading(v);
          } else {
            typeof n === 'string' ? this.node.setAttributeNS(n, a, v.toString()) : this.node.setAttribute(a, v.toString());
          }
          if (this.rebuild && (a == 'font-size' || a == 'x'))
            this.rebuild(a, v);
        }
        return this;
      }});
    SVG.extend(SVG.Element, {transform: function(o, relative) {
        var target = this,
            matrix;
        if (typeof o !== 'object') {
          matrix = new SVG.Matrix(target).extract();
          return typeof o === 'string' ? matrix[o] : matrix;
        }
        matrix = new SVG.Matrix(target);
        relative = !!relative || !!o.relative;
        if (o.a != null) {
          matrix = relative ? matrix.multiply(new SVG.Matrix(o)) : new SVG.Matrix(o);
        } else if (o.rotation != null) {
          ensureCentre(o, target);
          matrix = relative ? matrix.rotate(o.rotation, o.cx, o.cy) : matrix.rotate(o.rotation - matrix.extract().rotation, o.cx, o.cy);
        } else if (o.scale != null || o.scaleX != null || o.scaleY != null) {
          ensureCentre(o, target);
          o.scaleX = o.scale != null ? o.scale : o.scaleX != null ? o.scaleX : 1;
          o.scaleY = o.scale != null ? o.scale : o.scaleY != null ? o.scaleY : 1;
          if (!relative) {
            var e = matrix.extract();
            o.scaleX = o.scaleX * 1 / e.scaleX;
            o.scaleY = o.scaleY * 1 / e.scaleY;
          }
          matrix = matrix.scale(o.scaleX, o.scaleY, o.cx, o.cy);
        } else if (o.skewX != null || o.skewY != null) {
          ensureCentre(o, target);
          o.skewX = o.skewX != null ? o.skewX : 0;
          o.skewY = o.skewY != null ? o.skewY : 0;
          if (!relative) {
            var e = matrix.extract();
            matrix = matrix.multiply(new SVG.Matrix().skew(e.skewX, e.skewY, o.cx, o.cy).inverse());
          }
          matrix = matrix.skew(o.skewX, o.skewY, o.cx, o.cy);
        } else if (o.flip) {
          matrix = matrix.flip(o.flip, o.offset == null ? target.bbox()['c' + o.flip] : o.offset);
        } else if (o.x != null || o.y != null) {
          if (relative) {
            matrix = matrix.translate(o.x, o.y);
          } else {
            if (o.x != null)
              matrix.e = o.x;
            if (o.y != null)
              matrix.f = o.y;
          }
        }
        return this.attr('transform', matrix);
      }});
    SVG.extend(SVG.FX, {transform: function(o, relative) {
        var target = this.target(),
            matrix;
        if (typeof o !== 'object') {
          matrix = new SVG.Matrix(target).extract();
          return typeof o === 'string' ? matrix[o] : matrix;
        }
        relative = !!relative || !!o.relative;
        if (o.a != null) {
          matrix = new SVG.Matrix(o);
        } else if (o.rotation != null) {
          ensureCentre(o, target);
          matrix = new SVG.Rotate(o.rotation, o.cx, o.cy);
        } else if (o.scale != null || o.scaleX != null || o.scaleY != null) {
          ensureCentre(o, target);
          o.scaleX = o.scale != null ? o.scale : o.scaleX != null ? o.scaleX : 1;
          o.scaleY = o.scale != null ? o.scale : o.scaleY != null ? o.scaleY : 1;
          matrix = new SVG.Scale(o.scaleX, o.scaleY, o.cx, o.cy);
        } else if (o.skewX != null || o.skewY != null) {
          ensureCentre(o, target);
          o.skewX = o.skewX != null ? o.skewX : 0;
          o.skewY = o.skewY != null ? o.skewY : 0;
          matrix = new SVG.Skew(o.skewX, o.skewY, o.cx, o.cy);
        } else if (o.flip) {
          matrix = new SVG.Matrix().morph(new SVG.Matrix().flip(o.flip, o.offset == null ? target.bbox()['c' + o.flip] : o.offset));
        } else if (o.x != null || o.y != null) {
          matrix = new SVG.Translate(o.x, o.y);
        }
        if (!matrix)
          return this;
        matrix.relative = relative;
        this.last().transforms.push(matrix);
        setTimeout(function() {
          this.start();
        }.bind(this), 0);
        return this;
      }});
    SVG.extend(SVG.Element, {
      untransform: function() {
        return this.attr('transform', null);
      },
      matrixify: function() {
        var matrix = (this.attr('transform') || '').split(/\)\s*/).slice(0, -1).map(function(str) {
          var kv = str.trim().split('(');
          return [kv[0], kv[1].split(SVG.regex.matrixElements).map(function(str) {
            return parseFloat(str);
          })];
        }).reduce(function(matrix, transform) {
          if (transform[0] == 'matrix')
            return matrix.multiply(arrayToMatrix(transform[1]));
          return matrix[transform[0]].apply(matrix, transform[1]);
        }, new SVG.Matrix());
        return matrix;
      },
      toParent: function(parent) {
        if (this == parent)
          return this;
        var ctm = this.screenCTM();
        var temp = parent.rect(1, 1);
        var pCtm = temp.screenCTM().inverse();
        temp.remove();
        this.addTo(parent).untransform().transform(pCtm.multiply(ctm));
        return this;
      },
      toDoc: function() {
        return this.toParent(this.doc());
      }
    });
    SVG.Transformation = SVG.invent({
      create: function(source, inversed) {
        if (arguments.length > 1 && typeof inversed != 'boolean') {
          return this.create([].slice.call(arguments));
        }
        if (typeof source == 'object') {
          for (var i = 0,
              len = this.arguments.length; i < len; ++i) {
            this[this.arguments[i]] = source[this.arguments[i]];
          }
        }
        if (Array.isArray(source)) {
          for (var i = 0,
              len = this.arguments.length; i < len; ++i) {
            this[this.arguments[i]] = source[i];
          }
        }
        this.inversed = false;
        if (inversed === true) {
          this.inversed = true;
        }
      },
      extend: {
        at: function(pos) {
          var params = [];
          for (var i = 0,
              len = this.arguments.length; i < len; ++i) {
            params.push(this[this.arguments[i]]);
          }
          var m = this._undo || new SVG.Matrix();
          m = new SVG.Matrix().morph(SVG.Matrix.prototype[this.method].apply(m, params)).at(pos);
          return this.inversed ? m.inverse() : m;
        },
        undo: function(o) {
          for (var i = 0,
              len = this.arguments.length; i < len; ++i) {
            o[this.arguments[i]] = typeof this[this.arguments[i]] == 'undefined' ? 0 : o[this.arguments[i]];
          }
          this._undo = new SVG[capitalize(this.method)](o, true).at(1);
          return this;
        }
      }
    });
    SVG.Translate = SVG.invent({
      parent: SVG.Matrix,
      inherit: SVG.Transformation,
      create: function(source, inversed) {
        if (typeof source == 'object')
          this.constructor.call(this, source, inversed);
        else
          this.constructor.call(this, [].slice.call(arguments));
      },
      extend: {
        arguments: ['transformedX', 'transformedY'],
        method: 'translate'
      }
    });
    SVG.Rotate = SVG.invent({
      parent: SVG.Matrix,
      inherit: SVG.Transformation,
      create: function(source, inversed) {
        if (typeof source == 'object')
          this.constructor.call(this, source, inversed);
        else
          this.constructor.call(this, [].slice.call(arguments));
      },
      extend: {
        arguments: ['rotation', 'cx', 'cy'],
        method: 'rotate',
        at: function(pos) {
          var m = new SVG.Matrix().rotate(new SVG.Number().morph(this.rotation - (this._undo ? this._undo.rotation : 0)).at(pos), this.cx, this.cy);
          return this.inversed ? m.inverse() : m;
        },
        undo: function(o) {
          this._undo = o;
        }
      }
    });
    SVG.Scale = SVG.invent({
      parent: SVG.Matrix,
      inherit: SVG.Transformation,
      create: function(source, inversed) {
        if (typeof source == 'object')
          this.constructor.call(this, source, inversed);
        else
          this.constructor.call(this, [].slice.call(arguments));
      },
      extend: {
        arguments: ['scaleX', 'scaleY', 'cx', 'cy'],
        method: 'scale'
      }
    });
    SVG.Skew = SVG.invent({
      parent: SVG.Matrix,
      inherit: SVG.Transformation,
      create: function(source, inversed) {
        if (typeof source == 'object')
          this.constructor.call(this, source, inversed);
        else
          this.constructor.call(this, [].slice.call(arguments));
      },
      extend: {
        arguments: ['skewX', 'skewY', 'cx', 'cy'],
        method: 'skew'
      }
    });
    SVG.extend(SVG.Element, {style: function(s, v) {
        if (arguments.length == 0) {
          return this.node.style.cssText || '';
        } else if (arguments.length < 2) {
          if (typeof s == 'object') {
            for (v in s)
              this.style(v, s[v]);
          } else if (SVG.regex.isCss.test(s)) {
            s = s.split(';');
            for (var i = 0; i < s.length; i++) {
              v = s[i].split(':');
              this.style(v[0].replace(/\s+/g, ''), v[1]);
            }
          } else {
            return this.node.style[camelCase(s)];
          }
        } else {
          this.node.style[camelCase(s)] = v === null || SVG.regex.isBlank.test(v) ? '' : v;
        }
        return this;
      }});
    SVG.Parent = SVG.invent({
      create: function(element) {
        this.constructor.call(this, element);
      },
      inherit: SVG.Element,
      extend: {
        children: function() {
          return SVG.utils.map(SVG.utils.filterSVGElements(this.node.childNodes), function(node) {
            return SVG.adopt(node);
          });
        },
        add: function(element, i) {
          if (!this.has(element)) {
            i = i == null ? this.children().length : i;
            this.node.insertBefore(element.node, SVG.utils.filterSVGElements(this.node.childNodes)[i] || null);
          }
          return this;
        },
        put: function(element, i) {
          this.add(element, i);
          return element;
        },
        has: function(element) {
          return this.index(element) >= 0;
        },
        index: function(element) {
          return this.children().indexOf(element);
        },
        get: function(i) {
          return this.children()[i];
        },
        first: function() {
          return this.children()[0];
        },
        last: function() {
          return this.children()[this.children().length - 1];
        },
        each: function(block, deep) {
          var i,
              il,
              children = this.children();
          for (i = 0, il = children.length; i < il; i++) {
            if (children[i] instanceof SVG.Element)
              block.apply(children[i], [i, children]);
            if (deep && (children[i] instanceof SVG.Container))
              children[i].each(block, deep);
          }
          return this;
        },
        removeElement: function(element) {
          this.node.removeChild(element.node);
          return this;
        },
        clear: function() {
          while (this.node.hasChildNodes())
            this.node.removeChild(this.node.lastChild);
          delete this._defs;
          return this;
        },
        defs: function() {
          return this.doc().defs();
        }
      }
    });
    SVG.extend(SVG.Parent, {
      ungroup: function(parent, depth) {
        if (depth === 0 || this instanceof SVG.Defs)
          return this;
        parent = parent || (this instanceof SVG.Doc ? this : this.parent(SVG.Parent));
        depth = depth || Infinity;
        this.each(function() {
          if (this instanceof SVG.Defs)
            return this;
          if (this instanceof SVG.Parent)
            return this.ungroup(parent, depth - 1);
          return this.toParent(parent);
        });
        this.node.firstChild || this.remove();
        return this;
      },
      flatten: function(parent, depth) {
        return this.ungroup(parent, depth);
      }
    });
    SVG.Container = SVG.invent({
      create: function(element) {
        this.constructor.call(this, element);
      },
      inherit: SVG.Parent
    });
    SVG.ViewBox = SVG.invent({
      create: function(source) {
        var i,
            base = [0, 0, 0, 0];
        var x,
            y,
            width,
            height,
            box,
            view,
            we,
            he,
            wm = 1,
            hm = 1,
            reg = /[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/gi;
        if (source instanceof SVG.Element) {
          we = source;
          he = source;
          view = (source.attr('viewBox') || '').match(reg);
          box = source.bbox;
          width = new SVG.Number(source.width());
          height = new SVG.Number(source.height());
          while (width.unit == '%') {
            wm *= width.value;
            width = new SVG.Number(we instanceof SVG.Doc ? we.parent().offsetWidth : we.parent().width());
            we = we.parent();
          }
          while (height.unit == '%') {
            hm *= height.value;
            height = new SVG.Number(he instanceof SVG.Doc ? he.parent().offsetHeight : he.parent().height());
            he = he.parent();
          }
          this.x = 0;
          this.y = 0;
          this.width = width * wm;
          this.height = height * hm;
          this.zoom = 1;
          if (view) {
            x = parseFloat(view[0]);
            y = parseFloat(view[1]);
            width = parseFloat(view[2]);
            height = parseFloat(view[3]);
            this.zoom = ((this.width / this.height) > (width / height)) ? this.height / height : this.width / width;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
          }
        } else {
          source = typeof source === 'string' ? source.match(reg).map(function(el) {
            return parseFloat(el);
          }) : Array.isArray(source) ? source : typeof source == 'object' ? [source.x, source.y, source.width, source.height] : arguments.length == 4 ? [].slice.call(arguments) : base;
          this.x = source[0];
          this.y = source[1];
          this.width = source[2];
          this.height = source[3];
        }
      },
      extend: {
        toString: function() {
          return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height;
        },
        morph: function(v) {
          var v = arguments.length == 1 ? [v.x, v.y, v.width, v.height] : [].slice.call(arguments);
          this.destination = new SVG.ViewBox(v);
          return this;
        },
        at: function(pos) {
          if (!this.destination)
            return this;
          return new SVG.ViewBox([this.x + (this.destination.x - this.x) * pos, this.y + (this.destination.y - this.y) * pos, this.width + (this.destination.width - this.width) * pos, this.height + (this.destination.height - this.height) * pos]);
        }
      },
      parent: SVG.Container,
      construct: {viewbox: function(v) {
          if (arguments.length == 0)
            return new SVG.ViewBox(this);
          v = arguments.length == 1 ? [v.x, v.y, v.width, v.height] : [].slice.call(arguments);
          return this.attr('viewBox', v);
        }}
    });
    ;
    ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove', 'touchstart', 'touchmove', 'touchleave', 'touchend', 'touchcancel'].forEach(function(event) {
      SVG.Element.prototype[event] = function(f) {
        var self = this;
        this.node['on' + event] = typeof f == 'function' ? function() {
          return f.apply(self, arguments);
        } : null;
        return this;
      };
    });
    SVG.listeners = [];
    SVG.handlerMap = [];
    SVG.listenerId = 0;
    SVG.on = function(node, event, listener, binding) {
      var l = listener.bind(binding || node.instance || node),
          index = (SVG.handlerMap.indexOf(node) + 1 || SVG.handlerMap.push(node)) - 1,
          ev = event.split('.')[0],
          ns = event.split('.')[1] || '*';
      SVG.listeners[index] = SVG.listeners[index] || {};
      SVG.listeners[index][ev] = SVG.listeners[index][ev] || {};
      SVG.listeners[index][ev][ns] = SVG.listeners[index][ev][ns] || {};
      if (!listener._svgjsListenerId)
        listener._svgjsListenerId = ++SVG.listenerId;
      SVG.listeners[index][ev][ns][listener._svgjsListenerId] = l;
      node.addEventListener(ev, l, false);
    };
    SVG.off = function(node, event, listener) {
      var index = SVG.handlerMap.indexOf(node),
          ev = event && event.split('.')[0],
          ns = event && event.split('.')[1];
      if (index == -1)
        return;
      if (listener) {
        if (typeof listener == 'function')
          listener = listener._svgjsListenerId;
        if (!listener)
          return;
        if (SVG.listeners[index][ev] && SVG.listeners[index][ev][ns || '*']) {
          node.removeEventListener(ev, SVG.listeners[index][ev][ns || '*'][listener], false);
          delete SVG.listeners[index][ev][ns || '*'][listener];
        }
      } else if (ns && ev) {
        if (SVG.listeners[index][ev] && SVG.listeners[index][ev][ns]) {
          for (listener in SVG.listeners[index][ev][ns])
            SVG.off(node, [ev, ns].join('.'), listener);
          delete SVG.listeners[index][ev][ns];
        }
      } else if (ns) {
        for (event in SVG.listeners[index]) {
          for (namespace in SVG.listeners[index][event]) {
            if (ns === namespace) {
              SVG.off(node, [event, ns].join('.'));
            }
          }
        }
      } else if (ev) {
        if (SVG.listeners[index][ev]) {
          for (namespace in SVG.listeners[index][ev])
            SVG.off(node, [ev, namespace].join('.'));
          delete SVG.listeners[index][ev];
        }
      } else {
        for (event in SVG.listeners[index])
          SVG.off(node, event);
        delete SVG.listeners[index];
      }
    };
    SVG.extend(SVG.Element, {
      on: function(event, listener, binding) {
        SVG.on(this.node, event, listener, binding);
        return this;
      },
      off: function(event, listener) {
        SVG.off(this.node, event, listener);
        return this;
      },
      fire: function(event, data) {
        if (event instanceof Event) {
          this.node.dispatchEvent(event);
        } else {
          this.node.dispatchEvent(new CustomEvent(event, {detail: data}));
        }
        return this;
      }
    });
    SVG.Defs = SVG.invent({
      create: 'defs',
      inherit: SVG.Container
    });
    SVG.G = SVG.invent({
      create: 'g',
      inherit: SVG.Container,
      extend: {
        x: function(x) {
          return x == null ? this.transform('x') : this.transform({x: x - this.x()}, true);
        },
        y: function(y) {
          return y == null ? this.transform('y') : this.transform({y: y - this.y()}, true);
        },
        cx: function(x) {
          return x == null ? this.gbox().cx : this.x(x - this.gbox().width / 2);
        },
        cy: function(y) {
          return y == null ? this.gbox().cy : this.y(y - this.gbox().height / 2);
        },
        gbox: function() {
          var bbox = this.bbox(),
              trans = this.transform();
          bbox.x += trans.x;
          bbox.x2 += trans.x;
          bbox.cx += trans.x;
          bbox.y += trans.y;
          bbox.y2 += trans.y;
          bbox.cy += trans.y;
          return bbox;
        }
      },
      construct: {group: function() {
          return this.put(new SVG.G);
        }}
    });
    SVG.extend(SVG.Element, {
      siblings: function() {
        return this.parent().children();
      },
      position: function() {
        return this.parent().index(this);
      },
      next: function() {
        return this.siblings()[this.position() + 1];
      },
      previous: function() {
        return this.siblings()[this.position() - 1];
      },
      forward: function() {
        var i = this.position() + 1,
            p = this.parent();
        p.removeElement(this).add(this, i);
        if (p instanceof SVG.Doc)
          p.node.appendChild(p.defs().node);
        return this;
      },
      backward: function() {
        var i = this.position();
        if (i > 0)
          this.parent().removeElement(this).add(this, i - 1);
        return this;
      },
      front: function() {
        var p = this.parent();
        p.node.appendChild(this.node);
        if (p instanceof SVG.Doc)
          p.node.appendChild(p.defs().node);
        return this;
      },
      back: function() {
        if (this.position() > 0)
          this.parent().removeElement(this).add(this, 0);
        return this;
      },
      before: function(element) {
        element.remove();
        var i = this.position();
        this.parent().add(element, i);
        return this;
      },
      after: function(element) {
        element.remove();
        var i = this.position();
        this.parent().add(element, i + 1);
        return this;
      }
    });
    SVG.Mask = SVG.invent({
      create: function() {
        this.constructor.call(this, SVG.create('mask'));
        this.targets = [];
      },
      inherit: SVG.Container,
      extend: {remove: function() {
          for (var i = this.targets.length - 1; i >= 0; i--)
            if (this.targets[i])
              this.targets[i].unmask();
          this.targets = [];
          this.parent().removeElement(this);
          return this;
        }},
      construct: {mask: function() {
          return this.defs().put(new SVG.Mask);
        }}
    });
    SVG.extend(SVG.Element, {
      maskWith: function(element) {
        this.masker = element instanceof SVG.Mask ? element : this.parent().mask().add(element);
        this.masker.targets.push(this);
        return this.attr('mask', 'url("#' + this.masker.attr('id') + '")');
      },
      unmask: function() {
        delete this.masker;
        return this.attr('mask', null);
      }
    });
    SVG.ClipPath = SVG.invent({
      create: function() {
        this.constructor.call(this, SVG.create('clipPath'));
        this.targets = [];
      },
      inherit: SVG.Container,
      extend: {remove: function() {
          for (var i = this.targets.length - 1; i >= 0; i--)
            if (this.targets[i])
              this.targets[i].unclip();
          this.targets = [];
          this.parent().removeElement(this);
          return this;
        }},
      construct: {clip: function() {
          return this.defs().put(new SVG.ClipPath);
        }}
    });
    SVG.extend(SVG.Element, {
      clipWith: function(element) {
        this.clipper = element instanceof SVG.ClipPath ? element : this.parent().clip().add(element);
        this.clipper.targets.push(this);
        return this.attr('clip-path', 'url("#' + this.clipper.attr('id') + '")');
      },
      unclip: function() {
        delete this.clipper;
        return this.attr('clip-path', null);
      }
    });
    SVG.Gradient = SVG.invent({
      create: function(type) {
        this.constructor.call(this, SVG.create(type + 'Gradient'));
        this.type = type;
      },
      inherit: SVG.Container,
      extend: {
        at: function(offset, color, opacity) {
          return this.put(new SVG.Stop).update(offset, color, opacity);
        },
        update: function(block) {
          this.clear();
          if (typeof block == 'function')
            block.call(this, this);
          return this;
        },
        fill: function() {
          return 'url(#' + this.id() + ')';
        },
        toString: function() {
          return this.fill();
        },
        attr: function(a, b, c) {
          if (a == 'transform')
            a = 'gradientTransform';
          return SVG.Container.prototype.attr.call(this, a, b, c);
        }
      },
      construct: {gradient: function(type, block) {
          return this.defs().gradient(type, block);
        }}
    });
    SVG.extend(SVG.Gradient, SVG.FX, {
      from: function(x, y) {
        return (this._target || this).type == 'radial' ? this.attr({
          fx: new SVG.Number(x),
          fy: new SVG.Number(y)
        }) : this.attr({
          x1: new SVG.Number(x),
          y1: new SVG.Number(y)
        });
      },
      to: function(x, y) {
        return (this._target || this).type == 'radial' ? this.attr({
          cx: new SVG.Number(x),
          cy: new SVG.Number(y)
        }) : this.attr({
          x2: new SVG.Number(x),
          y2: new SVG.Number(y)
        });
      }
    });
    SVG.extend(SVG.Defs, {gradient: function(type, block) {
        return this.put(new SVG.Gradient(type)).update(block);
      }});
    SVG.Stop = SVG.invent({
      create: 'stop',
      inherit: SVG.Element,
      extend: {update: function(o) {
          if (typeof o == 'number' || o instanceof SVG.Number) {
            o = {
              offset: arguments[0],
              color: arguments[1],
              opacity: arguments[2]
            };
          }
          if (o.opacity != null)
            this.attr('stop-opacity', o.opacity);
          if (o.color != null)
            this.attr('stop-color', o.color);
          if (o.offset != null)
            this.attr('offset', new SVG.Number(o.offset));
          return this;
        }}
    });
    SVG.Pattern = SVG.invent({
      create: 'pattern',
      inherit: SVG.Container,
      extend: {
        fill: function() {
          return 'url(#' + this.id() + ')';
        },
        update: function(block) {
          this.clear();
          if (typeof block == 'function')
            block.call(this, this);
          return this;
        },
        toString: function() {
          return this.fill();
        },
        attr: function(a, b, c) {
          if (a == 'transform')
            a = 'patternTransform';
          return SVG.Container.prototype.attr.call(this, a, b, c);
        }
      },
      construct: {pattern: function(width, height, block) {
          return this.defs().pattern(width, height, block);
        }}
    });
    SVG.extend(SVG.Defs, {pattern: function(width, height, block) {
        return this.put(new SVG.Pattern).update(block).attr({
          x: 0,
          y: 0,
          width: width,
          height: height,
          patternUnits: 'userSpaceOnUse'
        });
      }});
    SVG.Doc = SVG.invent({
      create: function(element) {
        if (element) {
          element = typeof element == 'string' ? document.getElementById(element) : element;
          if (element.nodeName == 'svg') {
            this.constructor.call(this, element);
          } else {
            this.constructor.call(this, SVG.create('svg'));
            element.appendChild(this.node);
            this.size('100%', '100%');
          }
          this.namespace().defs();
        }
      },
      inherit: SVG.Container,
      extend: {
        namespace: function() {
          return this.attr({
            xmlns: SVG.ns,
            version: '1.1'
          }).attr('xmlns:xlink', SVG.xlink, SVG.xmlns).attr('xmlns:svgjs', SVG.svgjs, SVG.xmlns);
        },
        defs: function() {
          if (!this._defs) {
            var defs;
            if (defs = this.node.getElementsByTagName('defs')[0])
              this._defs = SVG.adopt(defs);
            else
              this._defs = new SVG.Defs;
            this.node.appendChild(this._defs.node);
          }
          return this._defs;
        },
        parent: function() {
          return this.node.parentNode.nodeName == '#document' ? null : this.node.parentNode;
        },
        spof: function(spof) {
          var pos = this.node.getScreenCTM();
          if (pos)
            this.style('left', (-pos.e % 1) + 'px').style('top', (-pos.f % 1) + 'px');
          return this;
        },
        remove: function() {
          if (this.parent()) {
            this.parent().removeChild(this.node);
          }
          return this;
        }
      }
    });
    SVG.Shape = SVG.invent({
      create: function(element) {
        this.constructor.call(this, element);
      },
      inherit: SVG.Element
    });
    SVG.Bare = SVG.invent({
      create: function(element, inherit) {
        this.constructor.call(this, SVG.create(element));
        if (inherit)
          for (var method in inherit.prototype)
            if (typeof inherit.prototype[method] === 'function')
              this[method] = inherit.prototype[method];
      },
      inherit: SVG.Element,
      extend: {words: function(text) {
          while (this.node.hasChildNodes())
            this.node.removeChild(this.node.lastChild);
          this.node.appendChild(document.createTextNode(text));
          return this;
        }}
    });
    SVG.extend(SVG.Parent, {
      element: function(element, inherit) {
        return this.put(new SVG.Bare(element, inherit));
      },
      symbol: function() {
        return this.defs().element('symbol', SVG.Container);
      }
    });
    SVG.Use = SVG.invent({
      create: 'use',
      inherit: SVG.Shape,
      extend: {element: function(element, file) {
          return this.attr('href', (file || '') + '#' + element, SVG.xlink);
        }},
      construct: {use: function(element, file) {
          return this.put(new SVG.Use).element(element, file);
        }}
    });
    SVG.Rect = SVG.invent({
      create: 'rect',
      inherit: SVG.Shape,
      construct: {rect: function(width, height) {
          return this.put(new SVG.Rect()).size(width, height);
        }}
    });
    SVG.Circle = SVG.invent({
      create: 'circle',
      inherit: SVG.Shape,
      construct: {circle: function(size) {
          return this.put(new SVG.Circle).rx(new SVG.Number(size).divide(2)).move(0, 0);
        }}
    });
    SVG.extend(SVG.Circle, SVG.FX, {
      rx: function(rx) {
        return this.attr('r', rx);
      },
      ry: function(ry) {
        return this.rx(ry);
      }
    });
    SVG.Ellipse = SVG.invent({
      create: 'ellipse',
      inherit: SVG.Shape,
      construct: {ellipse: function(width, height) {
          return this.put(new SVG.Ellipse).size(width, height).move(0, 0);
        }}
    });
    SVG.extend(SVG.Ellipse, SVG.Rect, SVG.FX, {
      rx: function(rx) {
        return this.attr('rx', rx);
      },
      ry: function(ry) {
        return this.attr('ry', ry);
      }
    });
    SVG.extend(SVG.Circle, SVG.Ellipse, {
      x: function(x) {
        return x == null ? this.cx() - this.rx() : this.cx(x + this.rx());
      },
      y: function(y) {
        return y == null ? this.cy() - this.ry() : this.cy(y + this.ry());
      },
      cx: function(x) {
        return x == null ? this.attr('cx') : this.attr('cx', x);
      },
      cy: function(y) {
        return y == null ? this.attr('cy') : this.attr('cy', y);
      },
      width: function(width) {
        return width == null ? this.rx() * 2 : this.rx(new SVG.Number(width).divide(2));
      },
      height: function(height) {
        return height == null ? this.ry() * 2 : this.ry(new SVG.Number(height).divide(2));
      },
      size: function(width, height) {
        var p = proportionalSize(this.bbox(), width, height);
        return this.rx(new SVG.Number(p.width).divide(2)).ry(new SVG.Number(p.height).divide(2));
      }
    });
    SVG.Line = SVG.invent({
      create: 'line',
      inherit: SVG.Shape,
      extend: {
        array: function() {
          return new SVG.PointArray([[this.attr('x1'), this.attr('y1')], [this.attr('x2'), this.attr('y2')]]);
        },
        plot: function(x1, y1, x2, y2) {
          if (typeof y1 !== 'undefined')
            x1 = {
              x1: x1,
              y1: y1,
              x2: x2,
              y2: y2
            };
          else
            x1 = new SVG.PointArray(x1).toLine();
          return this.attr(x1);
        },
        move: function(x, y) {
          return this.attr(this.array().move(x, y).toLine());
        },
        size: function(width, height) {
          var p = proportionalSize(this.bbox(), width, height);
          return this.attr(this.array().size(p.width, p.height).toLine());
        }
      },
      construct: {line: function(x1, y1, x2, y2) {
          return this.put(new SVG.Line).plot(x1, y1, x2, y2);
        }}
    });
    SVG.Polyline = SVG.invent({
      create: 'polyline',
      inherit: SVG.Shape,
      construct: {polyline: function(p) {
          return this.put(new SVG.Polyline).plot(p);
        }}
    });
    SVG.Polygon = SVG.invent({
      create: 'polygon',
      inherit: SVG.Shape,
      construct: {polygon: function(p) {
          return this.put(new SVG.Polygon).plot(p);
        }}
    });
    SVG.extend(SVG.Polyline, SVG.Polygon, {
      array: function() {
        return this._array || (this._array = new SVG.PointArray(this.attr('points')));
      },
      plot: function(p) {
        return this.attr('points', (this._array = new SVG.PointArray(p)));
      },
      move: function(x, y) {
        return this.attr('points', this.array().move(x, y));
      },
      size: function(width, height) {
        var p = proportionalSize(this.bbox(), width, height);
        return this.attr('points', this.array().size(p.width, p.height));
      }
    });
    SVG.extend(SVG.Line, SVG.Polyline, SVG.Polygon, {
      morphArray: SVG.PointArray,
      x: function(x) {
        return x == null ? this.bbox().x : this.move(x, this.bbox().y);
      },
      y: function(y) {
        return y == null ? this.bbox().y : this.move(this.bbox().x, y);
      },
      width: function(width) {
        var b = this.bbox();
        return width == null ? b.width : this.size(width, b.height);
      },
      height: function(height) {
        var b = this.bbox();
        return height == null ? b.height : this.size(b.width, height);
      }
    });
    SVG.Path = SVG.invent({
      create: 'path',
      inherit: SVG.Shape,
      extend: {
        morphArray: SVG.PathArray,
        array: function() {
          return this._array || (this._array = new SVG.PathArray(this.attr('d')));
        },
        plot: function(p) {
          return this.attr('d', (this._array = new SVG.PathArray(p)));
        },
        move: function(x, y) {
          return this.attr('d', this.array().move(x, y));
        },
        x: function(x) {
          return x == null ? this.bbox().x : this.move(x, this.bbox().y);
        },
        y: function(y) {
          return y == null ? this.bbox().y : this.move(this.bbox().x, y);
        },
        size: function(width, height) {
          var p = proportionalSize(this.bbox(), width, height);
          return this.attr('d', this.array().size(p.width, p.height));
        },
        width: function(width) {
          return width == null ? this.bbox().width : this.size(width, this.bbox().height);
        },
        height: function(height) {
          return height == null ? this.bbox().height : this.size(this.bbox().width, height);
        }
      },
      construct: {path: function(d) {
          return this.put(new SVG.Path).plot(d);
        }}
    });
    SVG.Image = SVG.invent({
      create: 'image',
      inherit: SVG.Shape,
      extend: {
        load: function(url) {
          if (!url)
            return this;
          var self = this,
              img = document.createElement('img');
          img.onload = function() {
            var p = self.parent(SVG.Pattern);
            if (p === null)
              return;
            if (self.width() == 0 && self.height() == 0)
              self.size(img.width, img.height);
            if (p && p.width() == 0 && p.height() == 0)
              p.size(self.width(), self.height());
            if (typeof self._loaded === 'function')
              self._loaded.call(self, {
                width: img.width,
                height: img.height,
                ratio: img.width / img.height,
                url: url
              });
          };
          return this.attr('href', (img.src = this.src = url), SVG.xlink);
        },
        loaded: function(loaded) {
          this._loaded = loaded;
          return this;
        }
      },
      construct: {image: function(source, width, height) {
          return this.put(new SVG.Image).load(source).size(width || 0, height || width || 0);
        }}
    });
    SVG.Text = SVG.invent({
      create: function() {
        this.constructor.call(this, SVG.create('text'));
        this.dom.leading = new SVG.Number(1.3);
        this._rebuild = true;
        this._build = false;
        this.attr('font-family', SVG.defaults.attrs['font-family']);
      },
      inherit: SVG.Shape,
      extend: {
        clone: function() {
          var clone = assignNewId(this.node.cloneNode(true));
          this.after(clone);
          return clone;
        },
        x: function(x) {
          if (x == null)
            return this.attr('x');
          if (!this.textPath)
            this.lines().each(function() {
              if (this.dom.newLined)
                this.x(x);
            });
          return this.attr('x', x);
        },
        y: function(y) {
          var oy = this.attr('y'),
              o = typeof oy === 'number' ? oy - this.bbox().y : 0;
          if (y == null)
            return typeof oy === 'number' ? oy - o : oy;
          return this.attr('y', typeof y === 'number' ? y + o : y);
        },
        cx: function(x) {
          return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2);
        },
        cy: function(y) {
          return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2);
        },
        text: function(text) {
          if (typeof text === 'undefined') {
            var text = '';
            var children = this.node.childNodes;
            for (var i = 0,
                len = children.length; i < len; ++i) {
              if (i != 0 && children[i].nodeType != 3 && SVG.adopt(children[i]).dom.newLined == true) {
                text += '\n';
              }
              text += children[i].textContent;
            }
            return text;
          }
          this.clear().build(true);
          if (typeof text === 'function') {
            text.call(this, this);
          } else {
            text = text.split('\n');
            for (var i = 0,
                il = text.length; i < il; i++)
              this.tspan(text[i]).newLine();
          }
          return this.build(false).rebuild();
        },
        size: function(size) {
          return this.attr('font-size', size).rebuild();
        },
        leading: function(value) {
          if (value == null)
            return this.dom.leading;
          this.dom.leading = new SVG.Number(value);
          return this.rebuild();
        },
        lines: function() {
          var node = (this.textPath && this.textPath() || this).node;
          var lines = SVG.utils.map(SVG.utils.filterSVGElements(node.childNodes), function(el) {
            return SVG.adopt(el);
          });
          return new SVG.Set(lines);
        },
        rebuild: function(rebuild) {
          if (typeof rebuild == 'boolean')
            this._rebuild = rebuild;
          if (this._rebuild) {
            var self = this,
                blankLineOffset = 0,
                dy = this.dom.leading * new SVG.Number(this.attr('font-size'));
            this.lines().each(function() {
              if (this.dom.newLined) {
                if (!this.textPath)
                  this.attr('x', self.attr('x'));
                if (this.text() == '\n') {
                  blankLineOffset += dy;
                } else {
                  this.attr('dy', dy + blankLineOffset);
                  blankLineOffset = 0;
                }
              }
            });
            this.fire('rebuild');
          }
          return this;
        },
        build: function(build) {
          this._build = !!build;
          return this;
        },
        setData: function(o) {
          this.dom = o;
          this.dom.leading = new SVG.Number(o.leading || 1.3);
          return this;
        }
      },
      construct: {
        text: function(text) {
          return this.put(new SVG.Text).text(text);
        },
        plain: function(text) {
          return this.put(new SVG.Text).plain(text);
        }
      }
    });
    SVG.Tspan = SVG.invent({
      create: 'tspan',
      inherit: SVG.Shape,
      extend: {
        text: function(text) {
          if (text == null)
            return this.node.textContent + (this.dom.newLined ? '\n' : '');
          typeof text === 'function' ? text.call(this, this) : this.plain(text);
          return this;
        },
        dx: function(dx) {
          return this.attr('dx', dx);
        },
        dy: function(dy) {
          return this.attr('dy', dy);
        },
        newLine: function() {
          var t = this.parent(SVG.Text);
          this.dom.newLined = true;
          return this.dy(t.dom.leading * t.attr('font-size')).attr('x', t.x());
        }
      }
    });
    SVG.extend(SVG.Text, SVG.Tspan, {
      plain: function(text) {
        if (this._build === false)
          this.clear();
        this.node.appendChild(document.createTextNode(text));
        return this;
      },
      tspan: function(text) {
        var node = (this.textPath && this.textPath() || this).node,
            tspan = new SVG.Tspan;
        if (this._build === false)
          this.clear();
        node.appendChild(tspan.node);
        return tspan.text(text);
      },
      clear: function() {
        var node = (this.textPath && this.textPath() || this).node;
        while (node.hasChildNodes())
          node.removeChild(node.lastChild);
        return this;
      },
      length: function() {
        return this.node.getComputedTextLength();
      }
    });
    SVG.TextPath = SVG.invent({
      create: 'textPath',
      inherit: SVG.Parent,
      parent: SVG.Text,
      construct: {
        path: function(d) {
          var path = new SVG.TextPath,
              track = this.doc().defs().path(d);
          while (this.node.hasChildNodes())
            path.node.appendChild(this.node.firstChild);
          this.node.appendChild(path.node);
          path.attr('href', '#' + track, SVG.xlink);
          return this;
        },
        plot: function(d) {
          var track = this.track();
          if (track)
            track.plot(d);
          return this;
        },
        track: function() {
          var path = this.textPath();
          if (path)
            return path.reference('href');
        },
        textPath: function() {
          if (this.node.firstChild && this.node.firstChild.nodeName == 'textPath')
            return SVG.adopt(this.node.firstChild);
        }
      }
    });
    SVG.Nested = SVG.invent({
      create: function() {
        this.constructor.call(this, SVG.create('svg'));
        this.style('overflow', 'visible');
      },
      inherit: SVG.Container,
      construct: {nested: function() {
          return this.put(new SVG.Nested);
        }}
    });
    SVG.A = SVG.invent({
      create: 'a',
      inherit: SVG.Container,
      extend: {
        to: function(url) {
          return this.attr('href', url, SVG.xlink);
        },
        show: function(target) {
          return this.attr('show', target, SVG.xlink);
        },
        target: function(target) {
          return this.attr('target', target);
        }
      },
      construct: {link: function(url) {
          return this.put(new SVG.A).to(url);
        }}
    });
    SVG.extend(SVG.Element, {linkTo: function(url) {
        var link = new SVG.A;
        if (typeof url == 'function')
          url.call(link, link);
        else
          link.to(url);
        return this.parent().put(link).put(this);
      }});
    SVG.Marker = SVG.invent({
      create: 'marker',
      inherit: SVG.Container,
      extend: {
        width: function(width) {
          return this.attr('markerWidth', width);
        },
        height: function(height) {
          return this.attr('markerHeight', height);
        },
        ref: function(x, y) {
          return this.attr('refX', x).attr('refY', y);
        },
        update: function(block) {
          this.clear();
          if (typeof block == 'function')
            block.call(this, this);
          return this;
        },
        toString: function() {
          return 'url(#' + this.id() + ')';
        }
      },
      construct: {marker: function(width, height, block) {
          return this.defs().marker(width, height, block);
        }}
    });
    SVG.extend(SVG.Defs, {marker: function(width, height, block) {
        return this.put(new SVG.Marker).size(width, height).ref(width / 2, height / 2).viewbox(0, 0, width, height).attr('orient', 'auto').update(block);
      }});
    SVG.extend(SVG.Line, SVG.Polyline, SVG.Polygon, SVG.Path, {marker: function(marker, width, height, block) {
        var attr = ['marker'];
        if (marker != 'all')
          attr.push(marker);
        attr = attr.join('-');
        marker = arguments[1] instanceof SVG.Marker ? arguments[1] : this.doc().marker(width, height, block);
        return this.attr(attr, marker);
      }});
    var sugar = {
      stroke: ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset'],
      fill: ['color', 'opacity', 'rule'],
      prefix: function(t, a) {
        return a == 'color' ? t : t + '-' + a;
      }
    };
    ;
    ['fill', 'stroke'].forEach(function(m) {
      var i,
          extension = {};
      extension[m] = function(o) {
        if (typeof o == 'string' || SVG.Color.isRgb(o) || (o && typeof o.fill === 'function'))
          this.attr(m, o);
        else
          for (i = sugar[m].length - 1; i >= 0; i--)
            if (o[sugar[m][i]] != null)
              this.attr(sugar.prefix(m, sugar[m][i]), o[sugar[m][i]]);
        return this;
      };
      SVG.extend(SVG.Element, SVG.FX, extension);
    });
    SVG.extend(SVG.Element, SVG.FX, {
      rotate: function(d, cx, cy) {
        return this.transform({
          rotation: d,
          cx: cx,
          cy: cy
        });
      },
      skew: function(x, y, cx, cy) {
        return this.transform({
          skewX: x,
          skewY: y,
          cx: cx,
          cy: cy
        });
      },
      scale: function(x, y, cx, cy) {
        return arguments.length == 1 || arguments.length == 3 ? this.transform({
          scale: x,
          cx: y,
          cy: cx
        }) : this.transform({
          scaleX: x,
          scaleY: y,
          cx: cx,
          cy: cy
        });
      },
      translate: function(x, y) {
        return this.transform({
          x: x,
          y: y
        });
      },
      flip: function(a, o) {
        return this.transform({
          flip: a,
          offset: o
        });
      },
      matrix: function(m) {
        return this.attr('transform', new SVG.Matrix(m));
      },
      opacity: function(value) {
        return this.attr('opacity', value);
      },
      dx: function(x) {
        return this.x((this instanceof SVG.FX ? 0 : this.x()) + x, true);
      },
      dy: function(y) {
        return this.y((this instanceof SVG.FX ? 0 : this.y()) + y, true);
      },
      dmove: function(x, y) {
        return this.dx(x).dy(y);
      }
    });
    SVG.extend(SVG.Rect, SVG.Ellipse, SVG.Circle, SVG.Gradient, SVG.FX, {radius: function(x, y) {
        var type = (this._target || this).type;
        return type == 'radial' || type == 'circle' ? this.attr('r', new SVG.Number(x)) : this.rx(x).ry(y == null ? x : y);
      }});
    SVG.extend(SVG.Path, {
      length: function() {
        return this.node.getTotalLength();
      },
      pointAt: function(length) {
        return this.node.getPointAtLength(length);
      }
    });
    SVG.extend(SVG.Parent, SVG.Text, SVG.FX, {font: function(o) {
        for (var k in o)
          k == 'leading' ? this.leading(o[k]) : k == 'anchor' ? this.attr('text-anchor', o[k]) : k == 'size' || k == 'family' || k == 'weight' || k == 'stretch' || k == 'variant' || k == 'style' ? this.attr('font-' + k, o[k]) : this.attr(k, o[k]);
        return this;
      }});
    SVG.Set = SVG.invent({
      create: function(members) {
        Array.isArray(members) ? this.members = members : this.clear();
      },
      extend: {
        add: function() {
          var i,
              il,
              elements = [].slice.call(arguments);
          for (i = 0, il = elements.length; i < il; i++)
            this.members.push(elements[i]);
          return this;
        },
        remove: function(element) {
          var i = this.index(element);
          if (i > -1)
            this.members.splice(i, 1);
          return this;
        },
        each: function(block) {
          for (var i = 0,
              il = this.members.length; i < il; i++)
            block.apply(this.members[i], [i, this.members]);
          return this;
        },
        clear: function() {
          this.members = [];
          return this;
        },
        length: function() {
          return this.members.length;
        },
        has: function(element) {
          return this.index(element) >= 0;
        },
        index: function(element) {
          return this.members.indexOf(element);
        },
        get: function(i) {
          return this.members[i];
        },
        first: function() {
          return this.get(0);
        },
        last: function() {
          return this.get(this.members.length - 1);
        },
        valueOf: function() {
          return this.members;
        },
        bbox: function() {
          var box = new SVG.BBox();
          if (this.members.length == 0)
            return box;
          var rbox = this.members[0].rbox();
          box.x = rbox.x;
          box.y = rbox.y;
          box.width = rbox.width;
          box.height = rbox.height;
          this.each(function() {
            box = box.merge(this.rbox());
          });
          return box;
        }
      },
      construct: {set: function(members) {
          return new SVG.Set(members);
        }}
    });
    SVG.FX.Set = SVG.invent({create: function(set) {
        this.set = set;
      }});
    SVG.Set.inherit = function() {
      var m,
          methods = [];
      for (var m in SVG.Shape.prototype)
        if (typeof SVG.Shape.prototype[m] == 'function' && typeof SVG.Set.prototype[m] != 'function')
          methods.push(m);
      methods.forEach(function(method) {
        SVG.Set.prototype[method] = function() {
          for (var i = 0,
              il = this.members.length; i < il; i++)
            if (this.members[i] && typeof this.members[i][method] == 'function')
              this.members[i][method].apply(this.members[i], arguments);
          return method == 'animate' ? (this.fx || (this.fx = new SVG.FX.Set(this))) : this;
        };
      });
      methods = [];
      for (var m in SVG.FX.prototype)
        if (typeof SVG.FX.prototype[m] == 'function' && typeof SVG.FX.Set.prototype[m] != 'function')
          methods.push(m);
      methods.forEach(function(method) {
        SVG.FX.Set.prototype[method] = function() {
          for (var i = 0,
              il = this.set.members.length; i < il; i++)
            this.set.members[i].fx[method].apply(this.set.members[i].fx, arguments);
          return this;
        };
      });
    };
    SVG.extend(SVG.Element, {data: function(a, v, r) {
        if (typeof a == 'object') {
          for (v in a)
            this.data(v, a[v]);
        } else if (arguments.length < 2) {
          try {
            return JSON.parse(this.attr('data-' + a));
          } catch (e) {
            return this.attr('data-' + a);
          }
        } else {
          this.attr('data-' + a, v === null ? null : r === true || typeof v === 'string' || typeof v === 'number' ? v : JSON.stringify(v));
        }
        return this;
      }});
    SVG.extend(SVG.Element, {
      remember: function(k, v) {
        if (typeof arguments[0] == 'object')
          for (var v in k)
            this.remember(v, k[v]);
        else if (arguments.length == 1)
          return this.memory()[k];
        else
          this.memory()[k] = v;
        return this;
      },
      forget: function() {
        if (arguments.length == 0)
          this._memory = {};
        else
          for (var i = arguments.length - 1; i >= 0; i--)
            delete this.memory()[arguments[i]];
        return this;
      },
      memory: function() {
        return this._memory || (this._memory = {});
      }
    });
    SVG.get = function(id) {
      var node = document.getElementById(idFromReference(id) || id);
      return SVG.adopt(node);
    };
    SVG.select = function(query, parent) {
      return new SVG.Set(SVG.utils.map((parent || document).querySelectorAll(query), function(node) {
        return SVG.adopt(node);
      }));
    };
    SVG.extend(SVG.Parent, {select: function(query) {
        return SVG.select(query, this.node);
      }});
    function is(el, obj) {
      return el instanceof obj;
    }
    function matches(el, selector) {
      return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
    }
    function camelCase(s) {
      return s.toLowerCase().replace(/-(.)/g, function(m, g) {
        return g.toUpperCase();
      });
    }
    function capitalize(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
    function fullHex(hex) {
      return hex.length == 4 ? ['#', hex.substring(1, 2), hex.substring(1, 2), hex.substring(2, 3), hex.substring(2, 3), hex.substring(3, 4), hex.substring(3, 4)].join('') : hex;
    }
    function compToHex(comp) {
      var hex = comp.toString(16);
      return hex.length == 1 ? '0' + hex : hex;
    }
    function proportionalSize(box, width, height) {
      if (height == null)
        height = box.height / box.width * width;
      else if (width == null)
        width = box.width / box.height * height;
      return {
        width: width,
        height: height
      };
    }
    function deltaTransformPoint(matrix, x, y) {
      return {
        x: x * matrix.a + y * matrix.c + 0,
        y: x * matrix.b + y * matrix.d + 0
      };
    }
    function arrayToMatrix(a) {
      return {
        a: a[0],
        b: a[1],
        c: a[2],
        d: a[3],
        e: a[4],
        f: a[5]
      };
    }
    function parseMatrix(matrix) {
      if (!(matrix instanceof SVG.Matrix))
        matrix = new SVG.Matrix(matrix);
      return matrix;
    }
    function ensureCentre(o, target) {
      o.cx = o.cx == null ? target.bbox().cx : o.cx;
      o.cy = o.cy == null ? target.bbox().cy : o.cy;
    }
    function stringToMatrix(source) {
      source = source.replace(SVG.regex.whitespace, '').replace(SVG.regex.matrix, '').split(SVG.regex.matrixElements);
      return arrayToMatrix(SVG.utils.map(source, function(n) {
        return parseFloat(n);
      }));
    }
    function at(o, pos) {
      return typeof o.from == 'number' ? o.from + (o.to - o.from) * pos : o instanceof SVG.Color || o instanceof SVG.Number || o instanceof SVG.Matrix ? o.at(pos) : pos < 1 ? o.from : o.to;
    }
    function arrayToString(a) {
      for (var i = 0,
          il = a.length,
          s = ''; i < il; i++) {
        s += a[i][0];
        if (a[i][1] != null) {
          s += a[i][1];
          if (a[i][2] != null) {
            s += ' ';
            s += a[i][2];
            if (a[i][3] != null) {
              s += ' ';
              s += a[i][3];
              s += ' ';
              s += a[i][4];
              if (a[i][5] != null) {
                s += ' ';
                s += a[i][5];
                s += ' ';
                s += a[i][6];
                if (a[i][7] != null) {
                  s += ' ';
                  s += a[i][7];
                }
              }
            }
          }
        }
      }
      return s + ' ';
    }
    function assignNewId(node) {
      for (var i = node.childNodes.length - 1; i >= 0; i--)
        if (node.childNodes[i] instanceof SVGElement)
          assignNewId(node.childNodes[i]);
      return SVG.adopt(node).id(SVG.eid(node.nodeName));
    }
    function fullBox(b) {
      if (b.x == null) {
        b.x = 0;
        b.y = 0;
        b.width = 0;
        b.height = 0;
      }
      b.w = b.width;
      b.h = b.height;
      b.x2 = b.x + b.width;
      b.y2 = b.y + b.height;
      b.cx = b.x + b.width / 2;
      b.cy = b.y + b.height / 2;
      return b;
    }
    function idFromReference(url) {
      var m = url.toString().match(SVG.regex.reference);
      if (m)
        return m[1];
    }
    var abcdef = 'abcdef'.split('');
    if (typeof CustomEvent !== 'function') {
      var CustomEvent = function(event, options) {
        options = options || {
          bubbles: false,
          cancelable: false,
          detail: undefined
        };
        var e = document.createEvent('CustomEvent');
        e.initCustomEvent(event, options.bubbles, options.cancelable, options.detail);
        return e;
      };
      CustomEvent.prototype = window.Event.prototype;
      window.CustomEvent = CustomEvent;
    }
    (function(w) {
      var lastTime = 0;
      var vendors = ['moz', 'webkit'];
      for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        w.requestAnimationFrame = w[vendors[x] + 'RequestAnimationFrame'];
        w.cancelAnimationFrame = w[vendors[x] + 'CancelAnimationFrame'] || w[vendors[x] + 'CancelRequestAnimationFrame'];
      }
      w.requestAnimationFrame = w.requestAnimationFrame || function(callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = w.setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
      w.cancelAnimationFrame = w.cancelAnimationFrame || w.clearTimeout;
    }(window));
    return SVG;
  }));
})(require('process'));
