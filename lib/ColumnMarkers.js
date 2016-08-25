'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('./util/d3');

var _SVGComponent = require('./SVGComponent');

var _SVGComponent2 = _interopRequireDefault(_SVGComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// NOTE: Fills top margin with rect column markers
// Requires a top margin greater than 5px, xScale, and the data
// Expects 2D data like heatmap

var ColumnMarkers = function (_React$Component) {
  _inherits(ColumnMarkers, _React$Component);

  function ColumnMarkers() {
    _classCallCheck(this, ColumnMarkers);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ColumnMarkers).apply(this, arguments));
  }

  _createClass(ColumnMarkers, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var className = _props.className;
      var data = _props.data;
      var onClick = _props.onClick;
      var xScale = _props.xScale;
      var xAccessor = _props.xAccessor;
      var colorScale = _props.colorScale;
      var chartWidth = _props.chartWidth;
      var margin = _props.margin;


      var y = -margin.top;
      var height = margin.top - 2 > 5 ? margin.top - 2 : 5;

      return _react2.default.createElement(
        'g',
        { className: className },
        data[0].bins.map(function (d, i) {
          // Get width of column
          var width = i + 1 < data[0].bins.length ? xScale(data[0].bins[i + 1][xAccessor.key]) : chartWidth;
          width -= xScale(d[xAccessor.key]);

          // Get total value for column
          var total = 0;
          for (var j = 0; j < data.length; j++) {
            total += data[j].bins[i][xAccessor.key];
          }

          return _react2.default.createElement(_SVGComponent2.default, { Component: 'rect', key: i,
            data: d,
            index: i,
            x: xScale(d[xAccessor.key]),
            y: y,
            fill: colorScale(total),
            width: width,
            height: height,
            onClick: onClick,
            onUpdate: {
              func: function func(transition, props) {
                transition.delay(0).duration(500).ease((0, _d.setEase)('linear')).attr('x', props.x).attr('y', props.y).attr('width', props.width).attr('height', props.height).attr('fill', props.fill);
                return transition;
              }
            } });
        })
      );
    }
  }]);

  return ColumnMarkers;
}(_react2.default.Component);

ColumnMarkers.defaultProps = {
  data: [],
  xAccessor: {
    key: 'key',
    value: 'value'
  },
  onClick: function onClick() {},
  className: 'columnMarker',
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  chartHeight: 0,
  chartWidth: 0
};

ColumnMarkers.propTypes = {
  data: _react.PropTypes.array,
  colorScale: _react.PropTypes.any,
  xScale: _react.PropTypes.any,
  xAccessor: _react.PropTypes.any,
  onClick: _react.PropTypes.func,
  className: _react.PropTypes.string,
  margin: _react.PropTypes.object,
  chartHeight: _react.PropTypes.number,
  chartWidth: _react.PropTypes.number
};

exports.default = ColumnMarkers;