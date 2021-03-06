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

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BrushX =
/*#__PURE__*/
function (_React$Component) {
  _inherits(BrushX, _React$Component);

  function BrushX(props) {
    var _this;

    _classCallCheck(this, BrushX);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BrushX).call(this, props));
    _this.brushSelection = [];
    _this.brushPhase = '';
    return _this;
  }

  _createClass(BrushX, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.initBrush();
    } // shouldComponentUpdate () {
    //   if (this.brushPhase === 'brushed' || this.brushPhase === '') {
    //     return true
    //   }
    //   return false
    // }

  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
        this.initBrush();
      }

      if (this.props.hideBrushSelection) {
        this.clearBrush();
      }
    }
  }, {
    key: "initBrush",
    value: function initBrush() {
      var thisNode = (0, _reactDom.findDOMNode)(this);
      var selection = (0, _d.select)(thisNode);
      this.brush = (0, _d.brushX)().extent([[0, 0], [this.props.width, this.props.height]]).on('start', this._start.bind(this)).on('brush', this._brush.bind(this)).on('end', this._end.bind(this));
      selection.call(this.brush);
    }
  }, {
    key: "_start",
    value: function _start() {
      this.brushPhase = 'start';
      this.applySelection();
    }
  }, {
    key: "_brush",
    value: function _brush() {
      this.brushPhase = 'brushing';
      this.applySelection();
    }
  }, {
    key: "_end",
    value: function _end() {
      // console.log(d3Event)
      if (_d.event.selection || _d.event.sourceEvent instanceof MouseEvent) {
        this.brushPhase = 'brushed'; // console.log('brush event firing')

        this.props.onBrush(this.brushSelection);
      }
    }
  }, {
    key: "clearBrush",
    value: function clearBrush() {
      var thisNode = (0, _reactDom.findDOMNode)(this);
      var selection = (0, _d.select)(thisNode);
      selection.call(this.brush.move, null);
      this.brushSelection = [];
      this.brushPhase = '';
    }
  }, {
    key: "applySelection",
    value: function applySelection() {
      if (!_d.event.sourceEvent || _d.event.sourceEvent.type === 'brush' || !_d.event.selection) return;
      var domain = this.calculateSelection(_d.event.selection.map(this.props.scale.invert));
      var thisNode = (0, _reactDom.findDOMNode)(this);
      (0, _d.select)(thisNode).call(this.brush.move, domain.map(this.props.scale));
      this.brushSelection = domain;
    }
  }, {
    key: "calculateSelection",
    value: function calculateSelection(domain) {
      var _this$props = this.props,
          interval = _this$props.interval,
          scale = _this$props.scale;
      var dateScale = /time/.test(scale.type);

      if (dateScale) {
        domain = domain.map(function (val) {
          return val.getTime();
        });
      }

      var nIntervals = Math.abs(scale.domain()[1] - scale.domain()[0]) / interval;
      var out = domain.slice();

      for (var i = 0; i < nIntervals; i++) {
        var xVal = dateScale ? scale.domain()[0].getTime() : scale.domain()[0];
        xVal += interval * i;

        if (domain[0] >= xVal && domain[0] < xVal + interval) {
          out[0] = xVal;
        }

        if (domain[1] > xVal && domain[1] < xVal + interval) {
          out[1] = xVal;
        }
      }

      if (out[0] === out[1]) {
        out[1] += interval;
      }

      return dateScale ? [new Date(out[0]), new Date(out[1])] : out;
    }
  }, {
    key: "render",
    value: function render() {
      // console.log('brush selection is : ' + this.state.selection)
      return _react["default"].createElement("g", {
        className: "brush",
        id: 'brush-' + this.props.brushID,
        width: this.props.width,
        height: this.props.height,
        onMouseMove: this.props.onMouseMove
      }, this.props.children);
    }
  }]);

  return BrushX;
}(_react["default"].Component);

BrushX.defaultProps = {
  showHandles: false,
  hideBrushSelection: true
};
BrushX.propTypes = {
  brushID: _propTypes["default"].string.isRequired,
  children: _propTypes["default"].node,
  hideBrushSelection: _propTypes["default"].bool,
  width: _propTypes["default"].number.isRequired,
  height: _propTypes["default"].number.isRequired,
  interval: _propTypes["default"].number.isRequired,
  scale: _propTypes["default"].func.isRequired,
  onBrush: _propTypes["default"].func,
  onMouseMove: _propTypes["default"].func
};
var _default = BrushX;
exports["default"] = _default;