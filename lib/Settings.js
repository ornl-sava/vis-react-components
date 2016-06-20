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

// TODO: Create other various input fields to be used

// Helper to create dropdown options menu

var Dropdown = function (_React$Component) {
  _inherits(Dropdown, _React$Component);

  function Dropdown(props) {
    _classCallCheck(this, Dropdown);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Dropdown).call(this, props));

    _this.onChange = _this.onChange.bind(_this);
    return _this;
  }

  _createClass(Dropdown, [{
    key: 'onChange',
    value: function onChange(event) {
      var props = this.props;
      props.onChange(event.target.value, props.chart);
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.props;
      var chart = props.chart;
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'label',
          null,
          props.label
        ),
        _react2.default.createElement(
          'select',
          { onChange: this.onChange, value: props.defaultSelected(chart) },
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
}(_react2.default.Component);

var Settings = function (_React$Component2) {
  _inherits(Settings, _React$Component2);

  function Settings(props) {
    _classCallCheck(this, Settings);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Settings).call(this, props));

    _this2.state = {
      menuDisplay: 'none',
      menuZIndex: -9998
    };

    _this2.openMenu = _this2.openMenu.bind(_this2);
    return _this2;
  }

  _createClass(Settings, [{
    key: 'openMenu',
    value: function openMenu() {
      var display = this.state.menuDisplay === 'none' ? 'block' : 'none';
      this.setState({
        menuDisplay: display,
        menuZIndex: 9998
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.props;
      var settings = props.settings;
      var chart = props.chart;
      var margin = chart.props.margin;
      var width = chart.state.chartWidth;
      var height = chart.state.chartHeight;

      var containerProps = {
        className: 'settings-container',
        style: {
          position: 'absolute',
          top: 0,
          left: 0
        }
      };

      var iconProps = {
        className: props.icon + ' settings-icon',
        style: {
          zIndex: 9999,
          position: 'absolute',
          top: 0,
          left: width + margin.left
        },
        onClick: this.openMenu
      };

      var menuProps = {
        className: 'settings-menu',
        style: {
          position: 'absolute',
          display: this.state.menuDisplay,
          zIndex: this.state.menuZIndex,
          width: (width + margin.left) / 2,
          height: height,
          top: 0,
          left: (width + margin.left) / 2
        }
      };

      return _react2.default.createElement(
        'div',
        containerProps,
        _react2.default.createElement('span', iconProps),
        _react2.default.createElement(
          'div',
          menuProps,
          _react2.default.createElement(
            'span',
            { className: 'settings-title' },
            settings.title
          ),
          settings.options.map(function (d, i) {
            if (d.type === 'dropdown') {
              return _react2.default.createElement(Dropdown, _extends({ key: i, chart: chart }, d));
            }
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
  icon: 'icono-gear'
};

Settings.propTypes = {
  settings: _react.PropTypes.object,
  chart: _react.PropTypes.object,
  icon: _react.PropTypes.string
};

exports.default = Settings;