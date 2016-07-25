'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Scatterplot = function (_React$Component) {
  _inherits(Scatterplot, _React$Component);

  function Scatterplot(props) {
    _classCallCheck(this, Scatterplot);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Scatterplot).call(this, props));

    _this.onClick = _this.onClick.bind(_this);
    _this.onEnter = _this.onEnter.bind(_this);
    _this.onLeave = _this.onLeave.bind(_this);
    return _this;
  }

  _createClass(Scatterplot, [{
    key: 'onClick',
    value: function onClick(event) {
      var target = event.target;
      this.props.onClick(event, this.getDatum(target));
    }
  }, {
    key: 'onEnter',
    value: function onEnter(event) {
      var target = event.target;
      this.props.onEnter(event, this.getDatum(target));
    }
  }, {
    key: 'onLeave',
    value: function onLeave(event) {
      var target = event.target;
      this.props.onLeave(event, this.getDatum(target));
    }
  }, {
    key: 'getDatum',
    value: function getDatum(target) {
      var i = target.getAttribute('data-i');
      return this.props.data[i];
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var props = this.props;
      return _react2.default.createElement(
        'g',
        { className: props.className },
        this.props.data.map(function (d, i) {
          var circleProps = {
            'data-i': i,
            'r': props.radius,
            'cx': props.xScale(d[props.xAccessor]),
            'cy': props.yScale(d[props.yAccessor]),
            'onMouseEnter': _this2.onEnter,
            'onMouseLeave': _this2.onLeave,
            'onClick': _this2.onClick
          };
          return _react2.default.createElement('circle', _extends({ key: i }, circleProps));
        })
      );
    }
  }]);

  return Scatterplot;
}(_react2.default.Component);

Scatterplot.defaultProps = {
  xAccessor: 'x',
  yAccessor: 'y',
  radius: 5,
  onClick: function onClick() {},
  onEnter: function onEnter() {},
  onLeave: function onLeave() {}
};

Scatterplot.propTypes = {
  chartHeight: _react.PropTypes.number,
  chartWidth: _react.PropTypes.number,
  className: _react.PropTypes.string,
  radius: _react.PropTypes.number,
  xAccessor: _react.PropTypes.string,
  yAccessor: _react.PropTypes.string,
  xScale: _react.PropTypes.any,
  yScale: _react.PropTypes.any,
  data: _react.PropTypes.array,
  onClick: _react.PropTypes.func,
  onEnter: _react.PropTypes.func,
  onLeave: _react.PropTypes.func
};

exports.default = Scatterplot;