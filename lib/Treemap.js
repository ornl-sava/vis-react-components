"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactTransitionGroup = require("react-transition-group");

var d3 = _interopRequireWildcard(require("d3"));

var _d2 = require("./util/d3");

var _SVGComponent = _interopRequireDefault(require("./SVGComponent"));

var _Tooltip = _interopRequireDefault(require("./Tooltip"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

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

var Treemap =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Treemap, _React$Component);

  function Treemap(props) {
    var _this;

    _classCallCheck(this, Treemap);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Treemap).call(this, props));
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this));
    _this.onEnter = _this.onEnter.bind(_assertThisInitialized(_this));
    _this.onLeave = _this.onLeave.bind(_assertThisInitialized(_this));
    _this.tip = props.tipFunction ? new _Tooltip["default"]().attr('className', 'd3-tip').html(props.tipFunction) : props.tipFunction;
    _this.state = {};
    return _this;
  }

  _createClass(Treemap, [{
    key: "onClick",
    value: function onClick(event, data, index) {
      var _this2 = this;

      if (this.props.zoom && data.children) {
        // the first setState is to make sure every component is properly initialized, to avoid a TransitionGroup error when that component tries to exit
        this.setState(this.state, function () {
          _this2.setState({
            selectedId: data.id
          });
        });
      } else {
        this.props.onClick(event, data, index);
      }
    }
  }, {
    key: "onEnter",
    value: function onEnter(event, data, index) {
      if (data && this.tip) {
        this.tip.show(event, data, index);
      }

      this.props.onEnter(event, data, index);
    }
  }, {
    key: "onLeave",
    value: function onLeave(event, data, index) {
      if (data && this.tip) {
        this.tip.hide(event, data, index);
      }

      this.props.onLeave(event, data, index);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.props.tipFunction) {
        this.tip.destroy();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      if (this.tip) {
        this.tip.hide();
        this.tip.destroy();
      }

      this.tip = this.props.tipFunction ? new _Tooltip["default"]().attr('className', 'd3-tip').html(this.props.tipFunction) : this.props.tipFunction;
      var w = this.props.chartWidth ? this.props.chartWidth : this.props.width;
      var h = this.props.chartHeight ? this.props.chartHeight : this.props.height;
      var barPadding = 2;
      var barOffset = 0;

      if (this.props.zoom) {
        barOffset = this.props.fontSize + 10 + 2 * barPadding;
      }

      h = h - barOffset;
      var manualPadding = this.props.stretch ? 2 : 0;
      var ratio = this.props.stretch ? 4 : 1;
      var treemap = d3.treemap().size([w / ratio, h]).round(true);

      if (!this.props.stretch) {
        treemap.padding(2);
      }

      var getParent = function getParent(id, zoomOut) {
        if (_this3.props.zoom && _this3.state.selectedId === id && !zoomOut) {
          return '';
        }

        return id.substring(0, id.lastIndexOf('.'));
      };

      var stratify = d3.stratify().parentId(function (d) {
        return getParent(d.id);
      });
      var activeData = this.props.data;

      if (this.props.zoom && this.state.selectedId) {
        activeData = [];
        var stillThere = false;
        this.props.data.map(function (d) {
          if (d.id === _this3.state.selectedId || d.id.includes(_this3.state.selectedId + '.')) {
            activeData.push(d);
          }

          if (d.id === _this3.state.selectedId) {
            stillThere = true;
          }
        });

        if (!stillThere) {
          this.state.selectedId = null;
          activeData = this.props.data;
        }
      }

      var root = stratify(activeData).sum(function (d) {
        return _this3.props.sizeFunction(d);
      }).sort(function (a, b) {
        return b.height - a.height || b.value - a.value;
      });
      var colors = d3.scaleOrdinal(d3.schemeCategory10);
      treemap(root);
      var visibleNodes = [];
      var overlayNodes = [];

      if (this.props.zoom) {
        root.children.map(function (d) {
          if (d.children) {
            visibleNodes = visibleNodes.concat(d.children);
          } else {
            visibleNodes.push(d);
          }

          overlayNodes.push(d);
        });
      } else {
        visibleNodes = root.leaves();
        overlayNodes = root.leaves();
      }

      var transitionFunc = {
        func: function func(transition, props) {
          transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attr('height', props.height).attr('width', props.width).attr('y', props.y).attr('x', props.x).attr('fill', props.fill);
          return transition;
        }
      };
      return (// There used to be a TransitionGroup in place of the top SVGComponent, but that caused a strange bug. May need to add it back.
        _react["default"].createElement(_reactTransitionGroup.TransitionGroup, {
          component: "g"
        }, this.props.zoom && _react["default"].createElement(_SVGComponent["default"], {
          Component: "rect",
          key: 'zoom rect',
          x: barPadding + 'px',
          y: barPadding + 'px',
          width: w - 2 * barPadding + 'px',
          height: barOffset - 2 * barPadding + 'px',
          fill: 'orange',
          onClick: function onClick() {
            if (_this3.state.selectedId) {
              _this3.setState({
                selectedId: getParent(_this3.state.selectedId, true)
              });
            }
          },
          onUpdate: transitionFunc
        }), this.props.zoom && _react["default"].createElement(_SVGComponent["default"], {
          Component: "text",
          key: 'zoom text',
          x: barPadding + 5 + 'px',
          y: barPadding + 5 + this.props.fontSize + 'px',
          fill: 'black',
          fontSize: this.props.fontSize + 'px',
          onUpdate: transitionFunc
        }, this.props.idDisplayFunction(root)), visibleNodes.map(function (d, i) {
          var w = Math.max((d.x1 - d.x0) * ratio - manualPadding, 0);
          var h = Math.max(d.y1 - d.y0 - manualPadding, 0);
          return _react["default"].createElement(_SVGComponent["default"], {
            Component: "svg",
            key: d.id + ' svg',
            x: d.x0 * ratio + manualPadding + 'px',
            y: barOffset + d.y0 + manualPadding + 'px',
            width: w + 'px',
            height: h + 'px',
            onUpdate: transitionFunc
          }, _react["default"].createElement(_SVGComponent["default"], {
            Component: "rect",
            key: d.id + ' rect',
            data: d,
            onUpdate: transitionFunc,
            x: '0px',
            y: '0px',
            width: w + 'px',
            height: h + 'px',
            fill: colors(getParent(d.id))
          }));
        }), overlayNodes.map(function (d) {
          var w = Math.max((d.x1 - d.x0) * ratio - manualPadding, 0);
          var h = Math.max(d.y1 - d.y0 - manualPadding, 0);
          return _react["default"].createElement(_SVGComponent["default"], {
            Component: "svg",
            key: d.id + ' svg',
            x: d.x0 * ratio + manualPadding + 'px',
            y: barOffset + d.y0 + manualPadding + 'px',
            width: w + 'px',
            height: h + 'px',
            onUpdate: transitionFunc
          }, _react["default"].createElement(_SVGComponent["default"], {
            Component: "rect",
            key: d.id + ' rect',
            data: d,
            onMouseEnter: _this3.onEnter,
            onMouseLeave: _this3.onLeave,
            onClick: _this3.onClick,
            onUpdate: transitionFunc,
            x: '0px',
            y: '0px',
            width: w + 'px',
            height: h + 'px',
            opacity: '0.0'
          }), _react["default"].createElement(_SVGComponent["default"], {
            Component: "text",
            key: d.id + ' text',
            onMouseEnter: _this3.onEnter,
            onMouseLeave: _this3.onLeave,
            onClick: _this3.onClick,
            onUpdate: transitionFunc,
            x: 5 + 'px',
            y: 2 + _this3.props.fontSize + 'px',
            fill: 'black',
            data: d,
            fontSize: _this3.props.fontSize + 'px'
          }, _this3.props.idDisplayFunction(d)));
        }))
      );
    }
  }]);

  return Treemap;
}(_react["default"].Component);

Treemap.defaultProps = {
  onClick: function onClick() {},
  onEnter: function onEnter() {},
  onLeave: function onLeave() {},
  data: [],
  sizeFunction: function sizeFunction(d) {
    return d.value;
  },
  idDisplayFunction: function idDisplayFunction(d) {
    return d.id;
  },
  fontSize: 12,
  zoom: false,
  stretch: false
};
Treemap.propTypes = {
  onClick: _propTypes["default"].func,
  onEnter: _propTypes["default"].func,
  onLeave: _propTypes["default"].func,
  tipFunction: _propTypes["default"].func,
  sizeFunction: _propTypes["default"].func,
  idDisplayFunction: _propTypes["default"].func,
  data: _propTypes["default"].array,
  width: _propTypes["default"].number,
  height: _propTypes["default"].number,
  chartWidth: _propTypes["default"].number,
  chartHeight: _propTypes["default"].number,
  fontSize: _propTypes["default"].number,
  zoom: _propTypes["default"].bool,
  stretch: _propTypes["default"].bool
};
var _default = Treemap;
exports["default"] = _default;