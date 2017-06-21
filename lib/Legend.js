'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d2 = require('d3');

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
          margin = _props.margin,
          numBoxes = _props.numBoxes,
          positionFunction = _props.positionFunction,
          orient = _props.orient;

      if (colorScale === null || colorScale.range().length === 0) {
        return _react2.default.createElement('g', null);
      }

      var _positionFunction = positionFunction(margin, chartHeight, chartWidth),
          _positionFunction2 = _slicedToArray(_positionFunction, 2),
          x = _positionFunction2[0],
          y = _positionFunction2[1];

      // might need another approach if we ever want to use logarithmic scales


      var displayColors = [];
      if (numBoxes > 1) {
        var min = colorScale.domain()[0];
        var max = colorScale.domain()[colorScale.domain().length - 1];
        var increment = (max - min) / (numBoxes - 1);
        for (var i = 0; i < numBoxes; i++) {
          displayColors.push(colorScale(min + i * increment));
        }
      } else {
        displayColors = colorScale.range();
      }

      var legendBlockWidth = (orient === 'vertical' ? chartHeight : chartWidth) / displayColors.length;
      var legendHeight = 4;

      if (orient === 'vertical') {
        return _react2.default.createElement(
          'g',
          { className: 'legend', transform: 'translate(' + x + ',' + y + ')' },
          displayColors.map(function (d, i) {
            return _react2.default.createElement('rect', { key: i,
              x: 0,
              y: i * legendBlockWidth,
              width: legendHeight,
              height: legendBlockWidth,
              fill: d });
          }),
          _react2.default.createElement(
            'text',
            { x: 5, y: 15 },
            (0, _d2.format)(',')(Math.round(colorScale.domain()[0]))
          ),
          _react2.default.createElement(
            'text',
            { x: 5, y: displayColors.length * legendBlockWidth },
            (0, _d2.format)(',')(Math.round(colorScale.domain()[colorScale.domain().length - 1]))
          )
        );
      } else {
        return _react2.default.createElement(
          'g',
          { className: 'legend', transform: 'translate(' + x + ',' + y + ')' },
          displayColors.map(function (d, i) {
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
            (0, _d2.format)(',')(Math.round(colorScale.domain()[0]))
          ),
          _react2.default.createElement(
            'text',
            { x: displayColors.length * legendBlockWidth, y: 15, textAnchor: 'end' },
            (0, _d2.format)(',')(Math.round(colorScale.domain()[colorScale.domain().length - 1]))
          )
        );
      }
    }
  }]);

  return Legend;
}(_react2.default.Component);

Legend.defaultProps = {
  colorScale: null,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  chartHeight: 0,
  chartWidth: 0,
  positionFunction: function positionFunction(margin, chartHeight, chartWidth) {
    // legend in bottom margin of Chart
    var x = 0;
    var y = chartHeight + margin.top + margin.bottom / 2;
    return [x, y];
  },
  orient: 'horizontal'
};

Legend.propTypes = {
  colorScale: _propTypes2.default.any,
  margin: _propTypes2.default.object,
  chartHeight: _propTypes2.default.number,
  chartWidth: _propTypes2.default.number,
  numBoxes: _propTypes2.default.number,
  positionFunction: _propTypes2.default.func,
  orient: _propTypes2.default.string
};

exports.default = Legend;