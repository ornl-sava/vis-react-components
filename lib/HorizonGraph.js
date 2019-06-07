"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactTransitionGroup = require("react-transition-group");

var d3 = _interopRequireWildcard(require("d3"));

var _d2 = require("./util/d3");

var _SVGComponent = _interopRequireDefault(require("./SVGComponent"));

var _BrushX = _interopRequireDefault(require("./BrushX"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var HorizonGraph =
/*#__PURE__*/
function (_React$Component) {
  _inherits(HorizonGraph, _React$Component);

  function HorizonGraph(props) {
    var _this;

    _classCallCheck(this, HorizonGraph);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HorizonGraph).call(this, props));
    _this.onMouseMove = _this.onMouseMove.bind(_assertThisInitialized(_this));
    _this.binarySearch = _this.binarySearch.bind(_assertThisInitialized(_this));
    _this.xScale = null;
    return _this;
  }

  _createClass(HorizonGraph, [{
    key: "onMouseMove",
    value: function onMouseMove(event) {
      var bounds = event.target.getBoundingClientRect();
      var x = event.clientX - bounds.left;
      var target = this.xScale.invert(x);
      var index = this.binarySearch(target, 0, this.props.data.length - 1);

      if (index !== this.props.selectedIndex) {
        this.props.handleSelection(index);
      }
    }
  }, {
    key: "binarySearch",
    value: function binarySearch(target, left, right) {
      var xAccess = this.props.xAccessor;
      var data = this.props.data;
      var mid = Math.floor((left + right) / 2);
      var min = xAccess(data[left], left);
      var max = xAccess(data[right], right);
      var lowDist = target - min;
      var highDist = max - target;
      var goLeft = lowDist <= highDist;

      if (left === mid) {
        return goLeft ? left : right;
      } else {
        return goLeft ? this.binarySearch(target, left, mid) : this.binarySearch(target, mid, right);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var data = this.props.data;
      var numBands = this.props.numBands;
      var xAccess = this.props.xAccessor;
      var yAccess = this.props.yAccessor;
      var w = this.props.chartWidth ? this.props.chartWidth : this.props.width;
      var h = this.props.chartHeight ? this.props.chartHeight : this.props.height;
      var xmin = Infinity;
      var xmax = -Infinity;
      var ymax = -Infinity;
      var mid = this.props.mid ? this.props.mid : 0;
      data.map(function (d, i) {
        var x = xAccess(d, i);
        var y = yAccess(d) - mid;

        if (x < xmin) {
          xmin = x;
        }

        if (x > xmax) {
          xmax = x;
        }

        if (Math.abs(y) > ymax) {
          ymax = Math.abs(y);
        }
      });

      if (this.props.domainHeight) {
        ymax = this.props.domainHeight;
      }

      var xScale = d3.scaleLinear().domain([xmin, xmax]).range([0, w]);
      this.xScale = xScale;
      var yScale = d3.scaleLinear().domain([0, ymax]).range([0, h * numBands]);
      var points = d3.area().curve(d3.curveLinear).x(function (d, i) {
        return xScale(xAccess(d, i));
      }).y0(h * numBands).y1(function (d) {
        return h * numBands - yScale(yAccess(d) - mid);
      })(data);
      var levels = d3.range(-1, -numBands - 1, -1).concat(d3.range(1, numBands + 1));
      var horizonTransform = this.props.mode === 'offset' ? function (d) {
        return 'translate(0,' + (d + (d < 0) - numBands) * h + ')';
      } : function (d) {
        return (d < 0 ? 'scale(1,-1)' : '') + 'translate(0,' + (d - numBands) * h + ')';
      };
      var colors = this.props.colors;
      var color = d3.scaleLinear().domain(numBands > 1 ? [-numBands, -1, 1, numBands] : [-1, 0, 0, 1]).range(numBands > 1 ? colors : [colors[1], colors[0], colors[3], colors[2]]);
      var selectionX = null;
      var labelX = null;
      var labelText = null;
      var si = this.props.selectedIndex;

      if ((si || si === 0) && si < data.length) {
        selectionX = xScale(xAccess(data[si], si));
        labelText = this.props.labelFormat(data[si]);
        var labelWidth = 7 * labelText.length;

        if (w - selectionX < labelWidth + 5) {
          labelX = w - labelWidth - 5;
        } else {
          labelX = selectionX + 5;
        }
      }

      var pathTransition = {
        func: function func(transition, props) {
          transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attr('d', props.d).attr('fill', props.fill);
          return transition;
        }
      };
      var boxTransition = {
        func: function func(transition, props) {
          transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attr('x', props.x).attr('y', props.y).attr('width', props.width).attr('height', props.height).attr('fill', props.fill);
          return transition;
        }
      };
      var lineTransition = {
        func: function func(transition, props) {
          transition.delay(0).duration(0).ease((0, _d2.setEase)('linear')).attr('x1', props.x1).attr('y1', props.y1).attr('x2', props.x2).attr('y2', props.y2);
          return transition;
        }
      };
      var textTransition = {
        func: function func(transition, props) {
          transition.delay(0).duration(0).ease((0, _d2.setEase)('linear')).attr('x', props.x).attr('y', props.y);
          return transition;
        }
      };

      var result = _react["default"].createElement(_reactTransitionGroup.TransitionGroup, {
        component: "g"
      }, _react["default"].createElement(_SVGComponent["default"], {
        Component: "svg",
        x: '0px',
        y: '0px',
        width: w + 'px',
        height: h + 'px',
        key: "horizonSvg",
        onUpdate: boxTransition,
        onMouseMove: this.onMouseMove
      }, _react["default"].createElement(_SVGComponent["default"], {
        Component: "rect",
        x: '0px',
        y: '0px',
        width: w + 'px',
        height: h + 'px',
        fill: this.props.bgColor,
        key: "horizonBackground",
        onUpdate: boxTransition
      }), levels.map(function (d) {
        return _react["default"].createElement(_SVGComponent["default"], {
          Component: "path",
          key: 'level-' + d,
          d: points,
          transform: horizonTransform(d),
          fill: color(d),
          onUpdate: pathTransition
        });
      }), selectionX !== null && _react["default"].createElement(_SVGComponent["default"], {
        Component: "g"
      }, _react["default"].createElement(_SVGComponent["default"], {
        Component: "line",
        key: "selectionLine",
        x1: selectionX,
        y1: 0,
        x2: selectionX,
        y2: h,
        stroke: "black",
        pointerEvents: "none",
        onUpdate: lineTransition
      }), _react["default"].createElement(_SVGComponent["default"], {
        Component: "text",
        key: "selectionLabel",
        x: labelX,
        y: this.props.labelY,
        pointerEvents: "none",
        onUpdate: textTransition,
        stroke: this.props.labelColor,
        fill: this.props.labelColor,
        fontSize: this.props.labelFontSize
      }, labelText))));

      if (this.props.brushID && data.length > 1) {
        var interval = Math.abs(xAccess(data[1]) - xAccess(data[0]));
        return _react["default"].createElement(_BrushX["default"], {
          brushID: this.props.brushID,
          hideBrushSelection: true,
          width: w,
          height: h,
          interval: interval,
          scale: xScale,
          onMouseMove: this.onMouseMove,
          onBrush: this.props.onBrush
        }, result);
      }

      return result;
    }
  }]);

  return HorizonGraph;
}(_react["default"].Component);

HorizonGraph.defaultProps = {
  mode: 'offset',
  numBands: 2,
  data: [],
  colors: ['#bdd7e7', '#08519c', '#006d2c', '#bae4b3'],
  bgColor: 'white',
  xAccessor: function xAccessor(d, i) {
    return i;
  },
  yAccessor: function yAccessor(d) {
    return d;
  },
  labelFormat: function labelFormat(d) {
    return '' + d;
  },
  labelColor: 'black',
  labelFontSize: 12,
  labelY: 16,
  brushID: 'default',
  onBrush: function onBrush() {}
};
HorizonGraph.propTypes = {
  width: _propTypes["default"].number,
  height: _propTypes["default"].number,
  chartWidth: _propTypes["default"].number,
  chartHeight: _propTypes["default"].number,
  numBands: _propTypes["default"].number,
  mode: _propTypes["default"].string,
  data: _propTypes["default"].array,
  colors: _propTypes["default"].array,
  bgColor: _propTypes["default"].string,
  xAccessor: _propTypes["default"].func,
  yAccessor: _propTypes["default"].func,
  mid: _propTypes["default"].number,
  domainHeight: _propTypes["default"].number,
  selectedIndex: _propTypes["default"].number,
  handleSelection: _propTypes["default"].func,
  labelFormat: _propTypes["default"].func,
  labelColor: _propTypes["default"].string,
  labelFontSize: _propTypes["default"].number,
  labelY: _propTypes["default"].number,
  brushID: _propTypes["default"].string,
  onBrush: _propTypes["default"].func
};
var _default = HorizonGraph;
exports["default"] = _default;