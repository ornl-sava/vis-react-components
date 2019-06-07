"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// import ReactDom from 'react-dom'
// import Bar from './Bar'
var TextBar =
/*#__PURE__*/
function (_React$Component) {
  _inherits(TextBar, _React$Component);

  _createClass(TextBar, [{
    key: "_onMouseEnter",
    value: function _onMouseEnter(event) {
      this.props.onEnter(event, this.props.data);
    }
  }, {
    key: "_onMouseLeave",
    value: function _onMouseLeave(event) {
      this.props.onLeave(event, this.props.data);
    }
  }, {
    key: "_onClick",
    value: function _onClick(event) {
      // console.log('toolTip', this.props.tooltipData)
      this.props.onClick(event, this.props.data);
    }
  }, {
    key: "_onDoubleClick",
    value: function _onDoubleClick() {
      // not used
      this.props.onDoubleClick(this.props.tooltipData);
    }
  }]);

  function TextBar(props) {
    var _this;

    _classCallCheck(this, TextBar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TextBar).call(this, props));
    _this.onClick = _this._onClick.bind(_assertThisInitialized(_this));
    _this.onDoubleClick = _this._onDoubleClick.bind(_assertThisInitialized(_this));
    _this.onEnter = _this._onMouseEnter.bind(_assertThisInitialized(_this));
    _this.onLeave = _this._onMouseLeave.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(TextBar, [{
    key: "setElem",
    value: function setElem() {// let {chartWidth, chartHeight, ...props} = this.props
    }
  }, {
    key: "getTxtAlign",
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
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      // if I put the styleChange check back in, things bog down....
      var styleChange = nextProps.barStyle !== this.props.barStyle; // console.log('TB', styleChange)

      var selected = nextProps.sel;
      /* if (this.props.text.indexOf('IC') >= 0) {
        console.log('next', nextProps.barStyle)
        console.log('this', this.props.barStyle)
        console.log('stylC', styleChange)
      } */
      // if (selected) { console.log('updated') }

      return styleChange || selected; // return selected
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._onMouseLeave();
    }
  }, {
    key: "makeRect",
    value: function makeRect() {
      var _this$props = this.props,
          className = _this$props.className,
          text = _this$props.text,
          width = _this$props.width,
          height = _this$props.height,
          x = _this$props.x,
          y = _this$props.y,
          barStyle = _this$props.barStyle,
          rx = _this$props.rx,
          ry = _this$props.ry;
      var rectData = {
        className: className + ' barTopic',
        'data-name': text,
        width: width,
        height: height,
        x: x,
        y: y,
        style: barStyle,
        rx: rx,
        ry: ry
      };
      return rectData;
    } // <Bar className={className + ' barTopic'} {...props} onClick={this.onClick} onDoubleClick={this.onDoubleClick} onEnter={this.onEnter} onLeave={this.onLeave} style={this.props.barStyle} />

  }, {
    key: "render",
    value: function render() {
      var _this$makeRect = this.makeRect(),
          style = _this$makeRect.style,
          rProps = _objectWithoutProperties(_this$makeRect, ["style"]); // console.log('txtBar')
      // console.log('txtBar', this.props.text, this.props.barStyle)


      var _this$props2 = this.props,
          className = _this$props2.className,
          props = _objectWithoutProperties(_this$props2, ["className"]);

      return _react["default"].createElement("g", null, _react["default"].createElement("text", {
        className: className + ' text',
        x: this.props.x + this.getTxtAlign(),
        y: this.props.y + this.props.height / 2,
        style: this.props.textStyle
      }, " ", props.text, " "), _react["default"].createElement("rect", _extends({}, rProps, {
        style: style
      })), _react["default"].createElement("rect", _extends({}, rProps, {
        style: {
          fill: 'black',
          fillOpacity: 0
        },
        onClick: this.onClick,
        onMouseEnter: this.onEnter,
        onMouseLeave: this.onLeave
      })));
    }
  }]);

  return TextBar;
}(_react["default"].Component);

TextBar.defaultProps = {
  height: 0,
  width: 0,
  className: 'txtBar',
  onClick: function onClick() {
    return null;
  },
  onDoubleClick: function onDoubleClick() {
    return null;
  },
  onEnter: function onEnter() {
    return null;
  },
  onLeave: function onLeave() {
    return null;
  },
  tooltipData: {},
  x: 0,
  y: 0,
  rx: 0,
  ry: 0,
  font: 12,
  textAlign: 'left',
  textStyle: {
    textAnchor: 'start',
    fontSize: '12px'
  },
  text: '',
  sel: false
};
TextBar.propTypes = {
  className: _propTypes["default"].string.isRequired,
  height: _propTypes["default"].number.isRequired,
  width: _propTypes["default"].number.isRequired,
  onClick: _propTypes["default"].func,
  onDoubleClick: _propTypes["default"].func,
  onEnter: _propTypes["default"].func,
  onLeave: _propTypes["default"].func,
  tooltipData: _propTypes["default"].object,
  x: _propTypes["default"].number.isRequired,
  y: _propTypes["default"].number.isRequired,
  rx: _propTypes["default"].number,
  ry: _propTypes["default"].number,
  font: _propTypes["default"].number.isRequired,
  barStyle: _propTypes["default"].object,
  textStyle: _propTypes["default"].object,
  textAlign: _propTypes["default"].string.isRequired,
  text: _propTypes["default"].string.isRequired,
  sel: _propTypes["default"].bool.isRequired,
  data: _propTypes["default"].any // Only required for REST calls

};
TextBar.contextTypes = {
  filterField: _propTypes["default"].string,
  filterString: _propTypes["default"].string,
  updateFilter: _propTypes["default"].func
};
var _default = TextBar;
exports["default"] = _default;