"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactTransitionGroup = require("react-transition-group");

var _d = require("d3");

var topojson = _interopRequireWildcard(require("topojson"));

var _d2 = require("./util/d3");

var _SVGComponent = _interopRequireDefault(require("./SVGComponent"));

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

var Choropleth =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Choropleth, _React$Component);

  function Choropleth(props) {
    var _this;

    _classCallCheck(this, Choropleth);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Choropleth).call(this, props));
    _this.projection = (0, _d.geoEquirectangular)();
    _this.path = (0, _d.geoPath)().projection(_this.projection);
    _this.getDatum = _this.getDatum.bind(_assertThisInitialized(_this));
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this));
    _this.onEnter = _this.onEnter.bind(_assertThisInitialized(_this));
    _this.onLeave = _this.onLeave.bind(_assertThisInitialized(_this));
    _this.onMove = _this.onMove.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Choropleth, [{
    key: "getDatum",
    value: function getDatum(id) {
      var _this2 = this;

      // Get datum based on id
      var index = -1;
      this.props.data.forEach(function (d, i) {
        if (d[_this2.props.keyField] === id) {
          index = i;
          return false;
        }
      });
      return this.props.data[index];
    }
  }, {
    key: "onClick",
    value: function onClick(event) {
      var target = event.target;
      var id = target.getAttribute('data-id');
      this.props.onClick(event, this.getDatum(id));
    }
  }, {
    key: "onEnter",
    value: function onEnter(event) {
      var target = event.target;
      var id = target.getAttribute('data-id');
      this.props.onEnter(event, this.getDatum(id));
    }
  }, {
    key: "onLeave",
    value: function onLeave(event) {
      var target = event.target;
      var id = target.getAttribute('data-id');
      this.props.onLeave(event, this.getDatum(id));
    }
  }, {
    key: "onMove",
    value: function onMove(event) {
      var target = event.target;
      var id = target.getAttribute('data-id');
      this.props.onMove(event, this.getDatum(id));
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      // Get map bounds and scaling
      var mapBounds = this.path.bounds(topojson.feature(this.props.map, this.props.map.objects.countries));
      var mapScale = this.projection.scale(); // Get possible scales based on width / height

      var hscale = mapScale * this.props.chartWidth / (mapBounds[1][0] - mapBounds[0][0]);
      var vscale = mapScale * this.props.chartHeight / (mapBounds[1][1] - mapBounds[0][1]); // Determine which scaling to use

      mapScale = hscale < vscale ? hscale : vscale;
      this.projection.scale(mapScale).translate([this.props.chartWidth / 2, this.props.chartHeight / 2]);
      this.path.projection(this.projection); // Helper to get datum and return color

      var getColor = function getColor(id) {
        // Find associated datum
        var index = -1;

        _this3.props.data.forEach(function (d, i) {
          if (d[_this3.props.keyField] === id) {
            index = i;
            return false;
          }
        });

        var datum = _this3.props.data[index];

        var color = _this3.props.unselectedColorScale.range()[0];

        if (typeof datum !== 'undefined') {
          if (datum[_this3.props.selectedField] === _this3.props.selectedValue) {
            color = datum[_this3.props.valueField] === 0 ? _this3.props.selectedColorScale.range()[0] : _this3.props.selectedColorScale(datum[_this3.props.valueField]);
          } else {
            color = datum[_this3.props.valueField] === 0 ? _this3.props.unselectedColorScale.range()[0] : _this3.props.unselectedColorScale(datum[_this3.props.valueField]);
          }
        }

        return color;
      };

      return _react["default"].createElement("g", null, _react["default"].createElement(_reactTransitionGroup.TransitionGroup, {
        component: "g"
      }, topojson.feature(this.props.map, this.props.map.objects.countries).features.map(function (d, i) {
        return _react["default"].createElement(_SVGComponent["default"], {
          Component: "path",
          key: i,
          "data-id": d.id,
          d: _this3.path(d, i),
          fill: getColor(d.id),
          onEnter: {
            func: function func(transition, props) {
              transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attrTween('fill', function () {
                return (0, _d.interpolate)(_this3.props.unselectedColorScale.range()[0], props.fill);
              });
              return transition;
            }
          },
          onUpdate: {
            func: function func(transition, props) {
              transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attr('fill', props.fill).attr('d', props.d);
              return transition;
            }
          },
          onClick: _this3.onClick,
          onMouseEnter: _this3.onEnter,
          onMouseLeave: _this3.onLeave,
          onMouseMove: _this3.onMove
        });
      })), _react["default"].createElement("g", null, _react["default"].createElement(_SVGComponent["default"], {
        Component: "path",
        className: "boundary",
        onUpdate: {
          func: function func(transition, props) {
            transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attr('d', props.d);
            return transition;
          }
        },
        d: this.path(topojson.mesh(this.props.map, this.props.map.objects.countries, function (a, b) {
          return a !== b;
        }))
      })));
    }
  }]);

  return Choropleth;
}(_react["default"].Component);

Choropleth.defaultProps = {
  data: [],
  keyField: 'key',
  valueField: 'value',
  selectedField: 'selectedField',
  selectedValue: 'selected',
  onClick: function onClick() {},
  onEnter: function onEnter() {},
  onLeave: function onLeave() {},
  onMove: function onMove() {}
};
Choropleth.propTypes = {
  selectedColorScale: _propTypes["default"].func,
  unselectedColorScale: _propTypes["default"].func,
  map: _propTypes["default"].object.isRequired,
  data: _propTypes["default"].array,
  chartWidth: _propTypes["default"].number,
  chartHeight: _propTypes["default"].number,
  keyField: _propTypes["default"].string,
  valueField: _propTypes["default"].string,
  selectedField: _propTypes["default"].string,
  selectedValue: _propTypes["default"].string,
  onClick: _propTypes["default"].func,
  onEnter: _propTypes["default"].func,
  onLeave: _propTypes["default"].func,
  onMove: _propTypes["default"].func
};
var _default = Choropleth;
exports["default"] = _default;