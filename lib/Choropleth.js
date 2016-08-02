'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTransitionGroup = require('react-addons-transition-group');

var _reactAddonsTransitionGroup2 = _interopRequireDefault(_reactAddonsTransitionGroup);

var _d = require('d3');

var _topojson = require('topojson');

var _topojson2 = _interopRequireDefault(_topojson);

var _d2 = require('./util/d3');

var _SVGComponent = require('./SVGComponent');

var _SVGComponent2 = _interopRequireDefault(_SVGComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Choropleth = function (_React$Component) {
  _inherits(Choropleth, _React$Component);

  function Choropleth(props) {
    _classCallCheck(this, Choropleth);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Choropleth).call(this, props));

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
      var mapBounds = this.path.bounds(_topojson2.default.feature(this.props.map, this.props.map.objects.countries));
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
        var color = _this3.props.unselectedMinColor;
        if (typeof datum !== 'undefined') {
          color = datum[_this3.props.selectedField] === _this3.props.selectedValue ? _this3.props.selectedColorScale(datum[_this3.props.valueField]) : _this3.props.unselectedColorScale(datum[_this3.props.valueField]);
        }
        return color;
      };

      return _react2.default.createElement(
        'g',
        null,
        _react2.default.createElement(
          _reactAddonsTransitionGroup2.default,
          { component: 'g' },
          _topojson2.default.feature(this.props.map, this.props.map.objects.countries).features.map(function (d, i) {
            return _react2.default.createElement(_SVGComponent2.default, { Component: 'path', key: i,
              'data-id': d.id,
              d: _this3.path(d, i),
              fill: getColor(d.id),
              onEnter: {
                func: function func(transition, props) {
                  transition.delay(0).duration(1000).ease((0, _d2.setEase)('linear')).attrTween('fill', function () {
                    return (0, _d.interpolate)(_this3.props.selectedMinColor, props.fill);
                  });
                  return transition;
                }
              },
              onUpdate: {
                func: function func(transition, props) {
                  transition.delay(0).duration(1000).ease((0, _d2.setEase)('linear')).attr('fill', props.fill);
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
          _react2.default.createElement('path', { d: this.path(_topojson2.default.mesh(this.props.map, this.props.map.objects.countries, function (a, b) {
              return a !== b;
            })), className: 'boundary' })
        )
      );
    }
  }]);

  return Choropleth;
}(_react2.default.Component);

Choropleth.defaultProps = {
  selectedMinColor: '#eff3ff',
  selectedMaxColor: '#2171b5',
  unselectedMinColor: '#f7f7f7',
  unselectedMaxColor: '#636363',
  numColorCat: 20,
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
  selectedColorScale: _react.PropTypes.func,
  unselectedColorScale: _react.PropTypes.func,
  selectedMinColor: _react.PropTypes.string,
  selectedMaxColor: _react.PropTypes.string,
  unselectedMinColor: _react.PropTypes.string,
  unselectedMaxColor: _react.PropTypes.string,
  numColorCat: _react.PropTypes.number,
  map: _react.PropTypes.object.isRequired,
  data: _react.PropTypes.array,
  chartWidth: _react.PropTypes.number,
  chartHeight: _react.PropTypes.number,
  keyField: _react.PropTypes.string,
  valueField: _react.PropTypes.string,
  selectedField: _react.PropTypes.string,
  selectedValue: _react.PropTypes.string,
  onClick: _react.PropTypes.func,
  onEnter: _react.PropTypes.func,
  onLeave: _react.PropTypes.func,
  onMove: _react.PropTypes.func
};

// Only required for REST calls
Choropleth.contextTypes = {
  filterField: _react.PropTypes.string,
  filterString: _react.PropTypes.string,
  filterType: _react.PropTypes.string,
  updateFilter: _react.PropTypes.func
};

exports.default = Choropleth;