'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactTransitionGroup = require('react-transition-group');

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _d2 = require('./util/d3');

var _SVGComponent = require('./SVGComponent');

var _SVGComponent2 = _interopRequireDefault(_SVGComponent);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HorizonGraph = function (_React$Component) {
  _inherits(HorizonGraph, _React$Component);

  function HorizonGraph(props) {
    _classCallCheck(this, HorizonGraph);

    var _this = _possibleConstructorReturn(this, (HorizonGraph.__proto__ || Object.getPrototypeOf(HorizonGraph)).call(this, props));

    _this.onMouseMove = _this.onMouseMove.bind(_this);
    _this.binarySearch = _this.binarySearch.bind(_this);

    _this.xScale = null;
    return _this;
  }

  _createClass(HorizonGraph, [{
    key: 'onMouseMove',
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
    key: 'binarySearch',
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
    key: 'render',
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

      var pathTransition = { func: function func(transition, props) {
          transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attr('d', props.d).attr('fill', props.fill);
          return transition;
        } };

      var boxTransition = { func: function func(transition, props) {
          transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attr('x', props.x).attr('y', props.y).attr('width', props.width).attr('height', props.height).attr('fill', props.fill);
          return transition;
        } };

      var lineTransition = { func: function func(transition, props) {
          transition.delay(0).duration(0).ease((0, _d2.setEase)('linear')).attr('x1', props.x1).attr('y1', props.y1).attr('x2', props.x2).attr('y2', props.y2);
          return transition;
        } };

      var textTransition = { func: function func(transition, props) {
          transition.delay(0).duration(0).ease((0, _d2.setEase)('linear')).attr('x', props.x).attr('y', props.y);
          return transition;
        } };

      return _react2.default.createElement(
        _reactTransitionGroup.TransitionGroup,
        { component: 'g' },
        _react2.default.createElement(
          _SVGComponent2.default,
          { Component: 'svg',
            x: '0px',
            y: '0px',
            width: w + 'px',
            height: h + 'px',
            key: 'horizonSvg',
            onUpdate: boxTransition,
            onMouseMove: this.onMouseMove
          },
          _react2.default.createElement(_SVGComponent2.default, { Component: 'rect',
            x: '0px',
            y: '0px',
            width: w + 'px',
            height: h + 'px',
            fill: this.props.bgColor,
            key: 'horizonBackground',
            onUpdate: boxTransition
          }),
          levels.map(function (d) {
            return _react2.default.createElement(_SVGComponent2.default, { Component: 'path',
              key: '' + d,
              d: points,
              transform: horizonTransform(d),
              fill: color(d),
              onUpdate: pathTransition
            });
          }),
          selectionX !== null && _react2.default.createElement(
            _SVGComponent2.default,
            { Component: 'g' },
            _react2.default.createElement(_SVGComponent2.default, { Component: 'line',
              key: 'selectionLine',
              x1: selectionX,
              y1: 0,
              x2: selectionX,
              y2: h,
              stroke: 'black',
              pointerEvents: 'none',
              onUpdate: lineTransition
            }),
            _react2.default.createElement(
              _SVGComponent2.default,
              { Component: 'text',
                key: 'selectionLabel',
                x: labelX,
                y: 20,
                pointerEvents: 'none',
                onUpdate: textTransition
              },
              labelText
            )
          )
        )
      );
    }
  }]);

  return HorizonGraph;
}(_react2.default.Component);

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
  }
};

HorizonGraph.propTypes = {
  width: _propTypes2.default.number,
  height: _propTypes2.default.number,
  chartWidth: _propTypes2.default.number,
  chartHeight: _propTypes2.default.number,
  numBands: _propTypes2.default.number,
  mode: _propTypes2.default.string,
  data: _propTypes2.default.array,
  colors: _propTypes2.default.array,
  bgColor: _propTypes2.default.string,
  xAccessor: _propTypes2.default.func,
  yAccessor: _propTypes2.default.func,
  mid: _propTypes2.default.number,
  domainHeight: _propTypes2.default.number,
  selectedIndex: _propTypes2.default.number,
  handleSelection: _propTypes2.default.func,
  labelFormat: _propTypes2.default.func
};

exports.default = HorizonGraph;