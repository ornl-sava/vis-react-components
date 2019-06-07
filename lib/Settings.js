"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// TODO: Create other various input types to be used
// Helper to create dropdown options menu
var Dropdown =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(Dropdown, _React$PureComponent);

  function Dropdown(props) {
    var _this;

    _classCallCheck(this, Dropdown);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Dropdown).call(this, props));
    _this.onChange = _this._onChange.bind(_assertThisInitialized(_this));
    _this.defaultValue = props.defaultSelected(props.chart);
    return _this;
  }

  _createClass(Dropdown, [{
    key: "_onChange",
    value: function _onChange(event) {
      var value = event.target.value;
      this.defaultValue = value;
      this.props.onChange(value, this.props.chart);
    }
  }, {
    key: "render",
    value: function render() {
      var props = this.props;
      return _react["default"].createElement("div", {
        className: "settings-option"
      }, _react["default"].createElement("label", null, props.label), _react["default"].createElement("select", {
        onChange: this.onChange,
        value: this.defaultValue
      }, props.options.map(function (d, i) {
        return _react["default"].createElement("option", {
          key: i,
          value: d
        }, d);
      })));
    }
  }]);

  return Dropdown;
}(_react["default"].PureComponent);

Dropdown.propTypes = {
  defaultSelected: _propTypes["default"].any,
  onChange: _propTypes["default"].any,
  chart: _propTypes["default"].object
};

var Input =
/*#__PURE__*/
function (_React$PureComponent2) {
  _inherits(Input, _React$PureComponent2);

  function Input(props) {
    var _this2;

    _classCallCheck(this, Input);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Input).call(this, props));
    _this2.onKeyPress = _this2.onKeyPress.bind(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(Input, [{
    key: "onKeyPress",
    value: function onKeyPress(event) {
      if (event.key === 'Enter') {
        this.props.onChange(event.target.value);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var props = this.props;
      return _react["default"].createElement("div", {
        className: "settings-option"
      }, _react["default"].createElement("label", null, props.label), _react["default"].createElement("input", {
        onKeyPress: this.onKeyPress
      }));
    }
  }]);

  return Input;
}(_react["default"].PureComponent);

Input.propTypes = {
  onChange: _propTypes["default"].any
};

var Settings =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Settings, _React$Component);

  function Settings(props) {
    var _this3;

    _classCallCheck(this, Settings);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Settings).call(this, props));
    _this3.state = {
      menuDisplay: 'none'
    };
    _this3.onChange = _this3._onChange.bind(_assertThisInitialized(_this3));
    _this3.openMenu = _this3.openMenu.bind(_assertThisInitialized(_this3));
    return _this3;
  }

  _createClass(Settings, [{
    key: "openMenu",
    value: function openMenu() {
      var display = this.state.menuDisplay === 'none' ? 'block' : 'none';
      this.setState({
        menuDisplay: display
      });
    }
  }, {
    key: "_onChange",
    value: function _onChange(value, callingFx, chart) {
      console.log('settings::onUpdate');
      this.setState({
        menuDisplay: 'none'
      }, function () {
        callingFx(value, chart);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var settings = this.props.settings;
      var chart = this.props.chart;
      var containerProps = {
        className: 'settings-container',
        style: {
          position: 'relative',
          top: 0,
          left: 0,
          zIndex: 100
        }
      };
      var iconJSX = this.props.iconFunction ? this.props.iconFunction() : _react["default"].createElement("span", null);
      var iconProps = {
        className: this.props.icon ? this.props.icon + ' settings-icon' : 'settings-icon',
        style: {
          zIndex: 103,
          top: 0
        },
        onClick: this.openMenu
      };
      iconJSX = (0, _react.cloneElement)(_react.Children.only(iconJSX), _objectSpread({}, iconProps));
      var menuProps = {
        className: 'settings-menu',
        style: {
          position: 'absolute',
          display: this.state.menuDisplay,
          zIndex: -100,
          width: this.props.width,
          top: 0,
          transform: 'translate(' + -this.props.width + 'px,0px)'
        }
      };
      return _react["default"].createElement("div", containerProps, iconJSX, _react["default"].createElement("div", menuProps, _react["default"].createElement("div", {
        className: "settings-title"
      }, settings.title), settings.options.map(function (d, i) {
        var _onChange2 = d.onChange,
            rest = _objectWithoutProperties(d, ["onChange"]);

        if (d.type === 'dropdown') {
          return _react["default"].createElement(Dropdown, _extends({
            key: i,
            chart: chart
          }, rest, {
            onChange: function onChange(val, chart) {
              return _this4.onChange(val, _onChange2, chart);
            }
          }));
        }

        if (d.type === 'input') {
          return _react["default"].createElement(Input, _extends({
            key: i,
            chart: chart
          }, rest, {
            onChange: function onChange(val) {
              return _this4.onChange(val, _onChange2);
            }
          }));
        } // Check for render other types of input here

      })));
    }
  }]);

  return Settings;
}(_react["default"].Component);

Settings.defaultProps = {
  settings: {},
  chart: null,
  width: 200
};
Settings.propTypes = {
  settings: _propTypes["default"].object,
  chart: _propTypes["default"].object,
  width: _propTypes["default"].number.isRequired,
  icon: _propTypes["default"].string,
  iconFunction: _propTypes["default"].func
};
var _default = Settings;
exports["default"] = _default;