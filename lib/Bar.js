"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDom = require("react-dom");

var _d = require("d3");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var mouseEventPollyFill = function mouseEventPollyFill(event) {
  var newEvent = null;

  if (typeof window.Event === 'function') {
    newEvent = new MouseEvent('mousedown', event); // console.log(Object.keys(event))
    // console.log(event)
  } else {
    newEvent = document.createEvent('MouseEvent');
    newEvent.initMouseEvent('mousedown', true, true, window, event.detail, event.screenX, event.screenY, event.clientX, event.clientY, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.button, event.relatedTarget);
  }

  return newEvent;
};

var Bar =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Bar, _React$Component);

  function Bar(props) {
    var _this;

    _classCallCheck(this, Bar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Bar).call(this, props));
    _this.onClick = _this._onClick.bind(_assertThisInitialized(_this));
    _this.onMouseEnter = _this._onMouseEnter.bind(_assertThisInitialized(_this));
    _this.onMouseDown = _this._onMouseDown.bind(_assertThisInitialized(_this));
    _this.onMouseLeave = _this._onMouseLeave.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Bar, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this._onMouseLeave) {
        this._onMouseLeave();
      }
    }
  }, {
    key: "_onClick",
    value: function _onClick(event) {
      if (this.props.brushed) return;

      if (this.props.tooltipData && this.props.data.y !== 0) {
        this.props.onClick(event, this.props.tooltipData);
      }
    }
  }, {
    key: "_onMouseEnter",
    value: function _onMouseEnter(event) {
      if (this.props.tooltipData) {
        this.props.onEnter(event, this.props.tooltipData);
      }
    }
  }, {
    key: "_onMouseLeave",
    value: function _onMouseLeave(event) {
      if (this.props.tooltipData) {
        this.props.onLeave(event, this.props.tooltipData);
      }
    }
  }, {
    key: "_onMouseDown",
    value: function _onMouseDown(event) {
      if (this.props.tooltipData) {
        // console.log('Bar :: mousedown')
        if (this.props.brushed) {
          var newEvent = mouseEventPollyFill(event);
          var brushID = '#brush-' + (0, _reactDom.findDOMNode)(this).getAttribute('data-name');
          var target = (0, _d.select)(brushID).select('.selection');

          if (target.empty()) {
            brushID = '#brush-default';
            target = (0, _d.select)(brushID).select('.selection');
          }

          var leftMargin = (0, _d.select)(brushID).select('.overlay').node().getBoundingClientRect().left;
          var selectionWidth = parseFloat(target.attr('width'));
          var min = parseFloat(target.attr('x')) + leftMargin;
          var max = parseFloat(target.attr('x')) + selectionWidth + leftMargin;

          if (target.style('display') === 'none' || event.pageX < min || event.pageX > max) {
            target = (0, _d.select)(brushID).select('.overlay').node();
          } else {
            target = target.node();
          }

          target.dispatchEvent(newEvent);
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          data = _this$props.data,
          name = _this$props.name,
          width = _this$props.width,
          height = _this$props.height,
          y = _this$props.y,
          x = _this$props.x,
          style = _this$props.style;
      className = className ? 'histogram-bar ' + className : 'histogram-bar';

      if (this.props.brushed) {
        className += ' brushed';
      }

      return _react["default"].createElement("rect", {
        className: className,
        "data-name": name,
        "data-x": data.x,
        "data-y": data.y,
        width: width,
        height: height,
        x: x,
        y: y,
        onClick: this.onClick,
        onMouseDown: this.onMouseDown,
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave,
        style: style
      });
    }
  }]);

  return Bar;
}(_react["default"].Component);

Bar.defaultProps = {
  brushed: false,
  height: 0,
  name: '',
  width: 0,
  onClick: function onClick() {
    return null;
  },
  tooltipData: null,
  y: 0,
  x: 0,
  style: {}
};
Bar.propTypes = {
  brushed: _propTypes["default"].bool.isRequired,
  className: _propTypes["default"].string,
  data: _propTypes["default"].object,
  height: _propTypes["default"].number.isRequired,
  name: _propTypes["default"].string,
  width: _propTypes["default"].number.isRequired,
  onClick: _propTypes["default"].func,
  onEnter: _propTypes["default"].func,
  onLeave: _propTypes["default"].func,
  tooltipData: _propTypes["default"].object,
  y: _propTypes["default"].number.isRequired,
  x: _propTypes["default"].number,
  style: _propTypes["default"].object
};
var _default = Bar;
exports["default"] = _default;