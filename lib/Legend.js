'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('d3');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Copy pasted from:
// http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
// Using to easily access nested object of passed in component
Object.byString = function (o, s) {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, ''); // strip a leading dot
  var a = s.split('.');
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
};

var Legend = function (_React$Component) {
  _inherits(Legend, _React$Component);

  function Legend() {
    _classCallCheck(this, Legend);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Legend).apply(this, arguments));
  }

  _createClass(Legend, [{
    key: 'render',
    value: function render() {
      if (this.props.component === null || this.props.width === 0) {
        return _react2.default.createElement('g', null);
      }

      var _props = this.props;
      var component = _props.component;
      var scaleAccessor = _props.scaleAccessor;
      var height = _props.height;
      var width = _props.width;
      var margin = _props.margin;

      var colorScale = Object.byString(component, scaleAccessor);

      var xPos = 0;
      var yPos = height + margin.bottom / 2;
      var legendBlockWidth = width / colorScale.range().length;
      var legendHeight = 4;

      return _react2.default.createElement(
        'g',
        { className: 'legend', transform: 'translate(' + xPos + ',' + yPos + ')' },
        colorScale.range().map(function (d, i) {
          var rectProps = {
            'x': i * legendBlockWidth,
            'y': 0,
            'width': legendBlockWidth,
            'height': legendHeight,
            'fill': d
          };
          return _react2.default.createElement('rect', _extends({ key: i }, rectProps));
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
  component: null,
  scaleAccessor: 'colorScale',
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  height: 0,
  width: 0
};

Legend.propTypes = {
  component: _react.PropTypes.any,
  scaleAccessor: _react.PropTypes.string,
  margin: _react.PropTypes.object,
  height: _react.PropTypes.number,
  width: _react.PropTypes.number
};

exports.default = Legend;