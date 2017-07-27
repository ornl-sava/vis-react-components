'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// TODO: Create other various input types to be used

// Helper to create dropdown options menu
var Dropdown = function (_React$PureComponent) {
  _inherits(Dropdown, _React$PureComponent);

  function Dropdown(props) {
    _classCallCheck(this, Dropdown);

    var _this = _possibleConstructorReturn(this, (Dropdown.__proto__ || Object.getPrototypeOf(Dropdown)).call(this, props));

    _this.onChange = _this.onChange.bind(_this);
    _this.defaultValue = props.defaultSelected(props.chart);
    return _this;
  }

  _createClass(Dropdown, [{
    key: 'onChange',
    value: function onChange(event) {
      var value = event.target.value;
      this.defaultValue = value;
      this.forceUpdate();
      this.props.onChange(value, this.props.chart);
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.props;
      return _react2.default.createElement(
        'div',
        { className: 'settings-option' },
        _react2.default.createElement(
          'label',
          null,
          props.label
        ),
        _react2.default.createElement(
          'select',
          { onChange: this.onChange, value: this.defaultValue },
          props.options.map(function (d, i) {
            return _react2.default.createElement(
              'option',
              { key: i, value: d },
              d
            );
          })
        )
      );
    }
  }]);

  return Dropdown;
}(_react2.default.PureComponent);

Dropdown.propTypes = {
  defaultSelected: _propTypes2.default.any,
  onChange: _propTypes2.default.any,
  chart: _propTypes2.default.object
};

var Input = function (_React$PureComponent2) {
  _inherits(Input, _React$PureComponent2);

  function Input(props) {
    _classCallCheck(this, Input);

    var _this2 = _possibleConstructorReturn(this, (Input.__proto__ || Object.getPrototypeOf(Input)).call(this, props));

    _this2.onKeyPress = _this2.onKeyPress.bind(_this2);
    return _this2;
  }

  _createClass(Input, [{
    key: 'onKeyPress',
    value: function onKeyPress(event) {
      if (event.key === 'Enter') {
        this.props.onChange(event.target.value);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.props;
      return _react2.default.createElement(
        'div',
        { className: 'settings-option' },
        _react2.default.createElement(
          'label',
          null,
          props.label
        ),
        _react2.default.createElement('input', { onKeyPress: this.onKeyPress })
      );
    }
  }]);

  return Input;
}(_react2.default.PureComponent);

Input.propTypes = {
  onChange: _propTypes2.default.any
};

var Settings = function (_React$Component) {
  _inherits(Settings, _React$Component);

  function Settings(props) {
    _classCallCheck(this, Settings);

    var _this3 = _possibleConstructorReturn(this, (Settings.__proto__ || Object.getPrototypeOf(Settings)).call(this, props));

    _this3.state = {
      menuDisplay: 'none'
    };

    _this3.openMenu = _this3.openMenu.bind(_this3);
    return _this3;
  }

  _createClass(Settings, [{
    key: 'openMenu',
    value: function openMenu() {
      var display = this.state.menuDisplay === 'none' ? 'block' : 'none';
      this.setState({
        menuDisplay: display
      });
    }
  }, {
    key: 'render',
    value: function render() {
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
      var iconJSX = this.props.iconFunction ? this.props.iconFunction() : _react2.default.createElement('span', null);

      var iconProps = {
        className: this.props.icon ? this.props.icon + ' settings-icon' : 'settings-icon',
        style: {
          zIndex: 103,
          top: 0
        },
        onClick: this.openMenu
      };
      iconJSX = (0, _react.cloneElement)(_react.Children.only(iconJSX), _extends({}, iconProps));

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

      return _react2.default.createElement(
        'div',
        containerProps,
        iconJSX,
        _react2.default.createElement(
          'div',
          menuProps,
          _react2.default.createElement(
            'div',
            { className: 'settings-title' },
            settings.title
          ),
          settings.options.map(function (d, i) {
            if (d.type === 'dropdown') {
              return _react2.default.createElement(Dropdown, _extends({ key: i, chart: chart }, d));
            }
            if (d.type === 'input') {
              return _react2.default.createElement(Input, _extends({ key: i, chart: chart }, d));
            } // Check for render other types of input here
          })
        )
      );
    }
  }]);

  return Settings;
}(_react2.default.Component);

Settings.defaultProps = {
  settings: {},
  chart: null,
  width: 200
};

Settings.propTypes = {
  settings: _propTypes2.default.object,
  chart: _propTypes2.default.object,
  width: _propTypes2.default.number.isRequired,
  icon: _propTypes2.default.string,
  iconFunction: _propTypes2.default.func
};

exports.default = Settings;