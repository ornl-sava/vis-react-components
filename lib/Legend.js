'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d = require('d3');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Legend = function (_React$Component) {
  _inherits(Legend, _React$Component);

  function Legend() {
    _classCallCheck(this, Legend);

    return _possibleConstructorReturn(this, (Legend.__proto__ || Object.getPrototypeOf(Legend)).apply(this, arguments));
  }

  _createClass(Legend, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          colorScale = _props.colorScale,
          chartWidth = _props.chartWidth,
          chartHeight = _props.chartHeight,
          margin = _props.margin;

      if (colorScale === null || colorScale.range().length === 0) {
        return _react2.default.createElement('g', null);
      }

      var x = 0;
      var y = chartHeight + margin.top + margin.bottom / 2;
      var legendBlockWidth = chartWidth / colorScale.range().length;
      var legendHeight = 4;

      return _react2.default.createElement(
        'g',
        { className: 'legend', transform: 'translate(' + x + ',' + y + ')' },
        colorScale.range().map(function (d, i) {
          return _react2.default.createElement('rect', { key: i,
            x: i * legendBlockWidth,
            y: 0,
            width: legendBlockWidth,
            height: legendHeight,
            fill: d });
        }),
        _react2.default.createElement(
          'text',
          { x: 0, y: 14 },
          (0, _d.format)(',')(Math.round(colorScale.domain()[0]))
        ),
        _react2.default.createElement(
          'text',
          { x: colorScale.range().length * legendBlockWidth, y: 15, textAnchor: 'end' },
          (0, _d.format)(',')(Math.round(colorScale.domain()[colorScale.domain().length - 1]))
        )
      );
    }
  }]);

  return Legend;
}(_react2.default.Component);

Legend.defaultProps = {
  colorScale: null,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  chartHeight: 0,
  chartWidth: 0
};

Legend.propTypes = {
  colorScale: _propTypes2.default.any,
  margin: _propTypes2.default.object,
  chartHeight: _propTypes2.default.number,
  chartWidth: _propTypes2.default.number
};

exports.default = Legend;