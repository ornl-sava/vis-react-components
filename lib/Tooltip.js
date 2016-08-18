'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = require('./util/common');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Based on d3-tip(https://github.com/Caged/d3-tip)

var Tooltip = function () {
  function Tooltip() {
    _classCallCheck(this, Tooltip);

    // Init tooltip
    this.tooltip = document.createElement('div');
    this.tooltip.style.display = 'none';
    this.tooltip.style.position = 'absolute';
    this.tooltip.style['box-sizing'] = 'border-box';
    document.body.appendChild(this.tooltip);

    // Set up defaults
    this._html = '';
    this._baseClass = '';
    this._offset = [0, 0];
    this._direction = 'n';
    this._autoDirection = true;
    this._useMouseCoordinates = false;
  }

  _createClass(Tooltip, [{
    key: 'destroy',
    value: function destroy() {
      document.body.removeChild(this.tooltip);
    }
  }, {
    key: 'show',
    value: function show(event) {
      this.tooltip.className = this._baseClass;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      this.tooltip.innerHTML = this._html.apply(this, args);
      this.tooltip.style.display = 'block';
      var bbox = this.getScreenBBox(event);
      var direction = this._direction;
      var coords = {
        top: bbox[direction].y,
        left: bbox[direction].x
      };
      if (this._autoDirection) {
        direction = this.getAutoDirection(bbox, coords);
      }
      if (this._useMouseCoordinates) {
        // NOTE: Currently uses a direction of 'n'
        coords.top = event.pageY + this._offset[0] - this.tooltip.offsetHeight;
        coords.left = event.pageX + this._offset[1] - this.tooltip.offsetWidth / 2;
      } else {
        coords.top += this._offset[0] + (0, _common.scrollTop)();
        coords.left += this._offset[1] + (0, _common.scrollLeft)();
      }
      this.tooltip.classList.add(direction);
      this.tooltip.style.top = coords.top + 'px';
      this.tooltip.style.left = coords.left + 'px';
      return this;
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.tooltip.style.display = 'none';
      return this;
    }
  }, {
    key: 'html',
    value: function html(tooltipFunction) {
      if (!arguments.length) return this._html;
      this._html = tooltipFunction;

      return this;
    }
  }, {
    key: 'direction',
    value: function direction(d) {
      if (!arguments.length) return this._direction;
      this._direction = (0, _common.functor)(d);

      return this;
    }
  }, {
    key: 'autoDirection',
    value: function autoDirection(v) {
      if (!arguments.length) return this._autoDirection;
      this._autoDirection = v;

      return this;
    }
  }, {
    key: 'useMouseCoordinates',
    value: function useMouseCoordinates(v) {
      if (!arguments.length) return this._useMouseCoordinates;
      this._useMouseCoordinates = v;

      return this;
    }
  }, {
    key: 'offset',
    value: function offset(o) {
      if (!arguments.length) return this._offset;
      this._offset = (0, _common.functor)(o);

      return this;
    }
  }, {
    key: 'attr',
    value: function (_attr) {
      function attr(_x, _x2) {
        return _attr.apply(this, arguments);
      }

      attr.toString = function () {
        return _attr.toString();
      };

      return attr;
    }(function (attr, value) {
      if (arguments.length < 2 && typeof attr === 'string') {
        return this.tooltip.getAttribute('string');
      } else {
        this.tooltip[attr] = (0, _common.functor)(value);
        if (attr === 'className') {
          this._baseClass = this.tooltip[attr];
        }
      }
      return this;
    })
  }, {
    key: 'style',
    value: function style(styl, value) {
      if (arguments.length < 2 && typeof attr === 'string') {
        return this.tooltip.getAttribute('string');
      } else {
        this.tooltip[styl] = (0, _common.functor)(value);
      }

      return this;
    }

    // NOTE: Currently assumes a default direction of 'N'
    // Mutates coords and return corrected direction

  }, {
    key: 'getAutoDirection',
    value: function getAutoDirection(bbox, coords) {
      var dir = 'n';
      if (coords.left < 0) {
        dir += 'e';
        coords.left = bbox[dir].x - bbox.width;
        coords.top = bbox[dir].y;
      } else if (coords.left + this.tooltip.offsetWidth > (0, _common.getWidth)()) {
        dir += 'w';
        coords.left = bbox[dir].x + bbox.width;
        coords.top = bbox[dir].y;
      }

      if (coords.top < 0) {
        dir = dir.replace('n', 's');
        coords.top += this.tooltip.offsetHeight + bbox.height;
      }

      return dir;
    }
  }, {
    key: 'getScreenBBox',
    value: function getScreenBBox() {
      var event = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (event === null) {
        return null;
      }

      var target = event.target;
      var bbox = {};
      var point = target.ownerSVGElement.createSVGPoint();
      var matrix = target.getScreenCTM();
      var tbbox = target.getBBox();
      var width = tbbox.width;
      var height = tbbox.height;
      bbox.width = width;
      bbox.height = height;
      var x = tbbox.x;
      var y = tbbox.y;

      point.x = x;
      point.y = y;

      bbox.nw = point.matrixTransform(matrix);
      bbox.nw.y -= this.tooltip.offsetHeight;
      bbox.nw.x -= this.tooltip.offsetWidth;
      point.x += width;

      bbox.ne = point.matrixTransform(matrix);
      bbox.ne.y -= this.tooltip.offsetHeight;
      point.y += height;

      bbox.se = point.matrixTransform(matrix);
      point.x -= width;

      bbox.sw = point.matrixTransform(matrix);
      bbox.sw.x -= this.tooltip.offsetWidth;
      point.y -= height / 2;

      bbox.w = point.matrixTransform(matrix);
      bbox.w.y -= this.tooltip.offsetHeight / 2;
      bbox.w.x -= this.tooltip.offsetWidth;
      point.x += width;

      bbox.e = point.matrixTransform(matrix);
      bbox.e.y -= this.tooltip.offsetHeight / 2;
      point.x -= width / 2;
      point.y -= height / 2;

      bbox.n = point.matrixTransform(matrix);
      bbox.n.x -= this.tooltip.offsetWidth / 2;
      bbox.n.y -= this.tooltip.offsetHeight;
      point.y += height;

      bbox.s = point.matrixTransform(matrix);
      bbox.s.x -= this.tooltip.offsetWidth / 2;

      return bbox;
    }
  }]);

  return Tooltip;
}();

exports.default = Tooltip;