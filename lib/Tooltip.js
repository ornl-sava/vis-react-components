'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var functor = function functor(f) {
  return typeof f === 'function' ? f() : f;
};

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
    this._offset = [0, 0];
    this._direction = 'n';
  }

  _createClass(Tooltip, [{
    key: 'destroy',
    value: function destroy() {
      document.body.removeChild(this.tooltip);
    }
  }, {
    key: 'show',
    value: function show(node, data) {
      this.tooltip.classList.add(this._direction);
      this.tooltip.innerHTML = this._html(data);
      this.tooltip.style.display = 'block';
      var bbox = this.getScreenBBox(node);
      var coords = {
        top: bbox[this._direction].y,
        left: bbox[this._direction].x
      };
      this.tooltip.style.top = coords.top + this._offset[0] + document.body.scrollTop + 'px';
      this.tooltip.style.left = coords.left + this._offset[1] + document.body.scrollLeft + 'px';
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
      this._direction = functor(d);

      return this;
    }
  }, {
    key: 'offset',
    value: function offset(o) {
      if (!arguments.length) return this._offset;
      this._offset = functor(o);

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
        this.tooltip[attr] = functor(value);
      }
      return this;
    })
  }, {
    key: 'style',
    value: function style(styl, value) {
      if (arguments.length < 2 && typeof attr === 'string') {
        return this.tooltip.getAttribute('string');
      } else {
        this.tooltip[styl] = functor(value);
      }

      return this;
    }
  }, {
    key: 'getScreenBBox',
    value: function getScreenBBox() {
      var target = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (target === null) {
        return null;
      }

      var bbox = {};
      var point = target.ownerSVGElement.createSVGPoint();
      var matrix = target.getScreenCTM();
      var tbbox = target.getBBox();
      var width = tbbox.width;
      var height = tbbox.height;
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