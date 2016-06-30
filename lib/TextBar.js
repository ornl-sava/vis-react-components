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

var _Bar = require('./Bar');

var _Bar2 = _interopRequireDefault(_Bar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextBar = function (_React$Component) {
  _inherits(TextBar, _React$Component);

  _createClass(TextBar, [{
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
  }, {
    key: '_onClick',
    value: function _onClick() {
      // console.log('toolTip', this.props.tooltipData)
      this.props.onClick(this.props.tooltipData);
    }
  }]);

  function TextBar(props) {
    _classCallCheck(this, TextBar);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TextBar).call(this, props));

    _this.onClick = _this._onClick.bind(_this);
    _this.onEnter = _this._onMouseEnter.bind(_this);
    _this.onLeave = _this._onMouseLeave.bind(_this);
    return _this;
  }

  _createClass(TextBar, [{
    key: 'setElem',
    value: function setElem() {
      // let {chartWidth, chartHeight, ...props} = this.props
    }
  }, {
    key: 'getTxtAlign',
    value: function getTxtAlign() {
      var xPos = 0;
      var align = this.props.textStyle.textAnchor;
      if (align === 'middle') {
        xPos = this.props.width / 2;
      } else if (align === 'end') {
        xPos = this.props.width - 10;
      } else {
        xPos = 10;
      }
      return xPos;
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      // if I put the styleChange check back in, things bog down....
      var styleChange = nextProps.barStyle !== this.props.barStyle;
      var selected = nextProps.sel;
      /* if (this.props.text.indexOf('IC') >= 0) {
        console.log('next', nextProps.barStyle)
        console.log('this', this.props.barStyle)
        console.log('stylC', styleChange)
      }*/
      // if (selected) { console.log('updated') }
      return styleChange || selected;
      // return selected
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._onMouseLeave();
    }
  }, {
    key: 'render',
    value: function render() {
      // console.log('txtBar')
      // console.log('txtBar', this.props.text, this.props.barStyle)
      var _props = this.props;
      var className = _props.className;

      var props = _objectWithoutProperties(_props, ['className']);

      return _react2.default.createElement(
        'g',
        null,
        _react2.default.createElement(
          'text',
          { className: this.props.className + ' text', x: this.props.x + this.getTxtAlign(), y: this.props.y + this.props.height / 2, style: this.props.textStyle, onClick: this.onClick, onMouseEnter: this.onEnter },
          ' ',
          props.text,
          ' '
        ),
        _react2.default.createElement(_Bar2.default, _extends({ className: className + ' barTopic' }, props, { onClick: this.onClick, onEnter: this.onEnter, onLeave: this.onLeave, style: this.props.barStyle }))
      );
    }
  }]);

  return TextBar;
}(_react2.default.Component);

TextBar.defaultProps = {
  height: 0,
  width: 0,
  className: 'txtBar',
  onClick: function onClick() {
    return null;
  },
  tooltipData: {},
  x: 0,
  y: 0,
  font: 12,
  textAlign: 'left',
  textStyle: { textAnchor: 'start', fontSize: '12px' },
  text: '',
  sel: false
};

TextBar.propTypes = {
  className: _react.PropTypes.string.isRequired,
  height: _react.PropTypes.number.isRequired,
  width: _react.PropTypes.number.isRequired,
  onClick: _react.PropTypes.func,
  onEnter: _react.PropTypes.func,
  onLeave: _react.PropTypes.func,
  tooltipData: _react.PropTypes.object,
  x: _react.PropTypes.number.isRequired,
  y: _react.PropTypes.number.isRequired,
  font: _react.PropTypes.number.isRequired,
  barStyle: _react.PropTypes.object,
  textStyle: _react.PropTypes.object,
  textAlign: _react.PropTypes.string.isRequired,
  text: _react.PropTypes.string.isRequired,
  sel: _react.PropTypes.bool.isRequired
};

// Only required for REST calls
TextBar.contextTypes = {
  filterField: _react.PropTypes.string,
  filterType: _react.PropTypes.string,
  params: _react.PropTypes.object,
  updateFilter: _react.PropTypes.func
};

exports.default = TextBar;