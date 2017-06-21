'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactTransitionGroup = require('react-transition-group');

var _d = require('d3');

var _topojson = require('topojson');

var topojson = _interopRequireWildcard(_topojson);

var _d2 = require('./util/d3');

var _SVGComponent = require('./SVGComponent');

var _SVGComponent2 = _interopRequireDefault(_SVGComponent);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Choropleth = function (_React$Component) {
  _inherits(Choropleth, _React$Component);

  function Choropleth(props) {
    _classCallCheck(this, Choropleth);

    var _this = _possibleConstructorReturn(this, (Choropleth.__proto__ || Object.getPrototypeOf(Choropleth)).call(this, props));

    _this.projection = (0, _d.geoEquirectangular)();
    _this.path = (0, _d.geoPath)().projection(_this.projection);

    _this.getDatum = _this.getDatum.bind(_this);
    _this.onClick = _this.onClick.bind(_this);
    _this.onEnter = _this.onEnter.bind(_this);
    _this.onLeave = _this.onLeave.bind(_this);
    _this.onMove = _this.onMove.bind(_this);
    return _this;
  }

  _createClass(Choropleth, [{
    key: 'getDatum',
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
    key: 'onClick',
    value: function onClick(event) {
      var target = event.target;
      var id = target.getAttribute('data-id');
      this.props.onClick(event, this.getDatum(id));
    }
  }, {
    key: 'onEnter',
    value: function onEnter(event) {
      var target = event.target;
      var id = target.getAttribute('data-id');
      this.props.onEnter(event, this.getDatum(id));
    }
  }, {
    key: 'onLeave',
    value: function onLeave(event) {
      var target = event.target;
      var id = target.getAttribute('data-id');
      this.props.onLeave(event, this.getDatum(id));
    }
  }, {
    key: 'onMove',
    value: function onMove(event) {
      var target = event.target;
      var id = target.getAttribute('data-id');
      this.props.onMove(event, this.getDatum(id));
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      // Get map bounds and scaling
      var mapBounds = this.path.bounds(topojson.feature(this.props.map, this.props.map.objects.countries));
      var mapScale = this.projection.scale();

      // Get possible scales based on width / height
      var hscale = mapScale * this.props.chartWidth / (mapBounds[1][0] - mapBounds[0][0]);
      var vscale = mapScale * this.props.chartHeight / (mapBounds[1][1] - mapBounds[0][1]);

      // Determine which scaling to use
      mapScale = hscale < vscale ? hscale : vscale;
      this.projection.scale(mapScale).translate([this.props.chartWidth / 2, this.props.chartHeight / 2]);

      this.path.projection(this.projection);

      // Helper to get datum and return color
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

      return _react2.default.createElement(
        'g',
        null,
        _react2.default.createElement(
          _reactTransitionGroup.TransitionGroup,
          { component: 'g' },
          topojson.feature(this.props.map, this.props.map.objects.countries).features.map(function (d, i) {
            return _react2.default.createElement(_SVGComponent2.default, { Component: 'path', key: i,
              'data-id': d.id,
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
              onMouseMove: _this3.onMove });
          })
        ),
        _react2.default.createElement(
          'g',
          null,
          _react2.default.createElement(_SVGComponent2.default, { Component: 'path',
            className: 'boundary',
            onUpdate: {
              func: function func(transition, props) {
                transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attr('d', props.d);
                return transition;
              }
            },
            d: this.path(topojson.mesh(this.props.map, this.props.map.objects.countries, function (a, b) {
              return a !== b;
            })) })
        )
      );
    }
  }]);

  return Choropleth;
}(_react2.default.Component);

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
  selectedColorScale: _propTypes2.default.func,
  unselectedColorScale: _propTypes2.default.func,
  map: _propTypes2.default.object.isRequired,
  data: _propTypes2.default.array,
  chartWidth: _propTypes2.default.number,
  chartHeight: _propTypes2.default.number,
  keyField: _propTypes2.default.string,
  valueField: _propTypes2.default.string,
  selectedField: _propTypes2.default.string,
  selectedValue: _propTypes2.default.string,
  onClick: _propTypes2.default.func,
  onEnter: _propTypes2.default.func,
  onLeave: _propTypes2.default.func,
  onMove: _propTypes2.default.func
};

exports.default = Choropleth;