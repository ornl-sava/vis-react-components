'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bar = function (_React$Component) {
  _inherits(Bar, _React$Component);

  _createClass(Bar, [{
    key: '_onMouseEnter',
    value: function _onMouseEnter() {
      if (this.props.tooltipData) {
        var thisNode = _reactDom2.default.findDOMNode(this);
        this.props.onEnter(this.props.tooltipData, thisNode);
      }
    }
  }, {
    key: '_onMouseLeave',
    value: function _onMouseLeave() {
      if (this.props.tooltipData) {
        var thisNode = _reactDom2.default.findDOMNode(this);
        this.props.onLeave(this.props.tooltipData, thisNode);
      }
    }
  }]);

  function Bar(props) {
    _classCallCheck(this, Bar);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Bar).call(this, props));

    _this.onClick = props.onClick.bind(_this);
    _this.onMouseEnter = _this._onMouseEnter.bind(_this);
    _this.onMouseLeave = _this._onMouseLeave.bind(_this);
    return _this;
  }

  _createClass(Bar, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._onMouseLeave();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var className = _props.className;
      var data = _props.data;

      var other = _objectWithoutProperties(_props, ['className', 'data']);

      className = 'bar ' + className;
      return _react2.default.createElement('rect', _extends({
        className: className,
        'data-x': data.x,
        'data-y': data.y
      }, other, {
        onClick: this.onClick,
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave
      }));
    }
  }]);

  return Bar;
}(_react2.default.Component);

Bar.defaultProps = {
  height: 0,
  width: 0,
  className: 'bar',
  onClick: function onClick() {
    return null;
  },
  tooltipData: null,
  y: 0
};

Bar.propTypes = {
  className: _react.PropTypes.string.isRequired,
  data: _react.PropTypes.object,
  height: _react.PropTypes.number.isRequired,
  width: _react.PropTypes.number.isRequired,
  onClick: _react.PropTypes.func,
  onEnter: _react.PropTypes.func,
  onLeave: _react.PropTypes.func,
  tooltipData: _react.PropTypes.object,
  y: _react.PropTypes.number.isRequired
};

// Only required for REST calls
Bar.contextTypes = {
  filterField: _react.PropTypes.string,
  filterType: _react.PropTypes.string,
  params: _react.PropTypes.object,
  updateFilter: _react.PropTypes.func
};

exports.default = Bar;