'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _topojson = require('topojson');

var _topojson2 = _interopRequireDefault(_topojson);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Choropleth = function (_React$Component) {
  _inherits(Choropleth, _React$Component);

  function Choropleth(props) {
    _classCallCheck(this, Choropleth);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Choropleth).call(this, props));

    _this.selectedColorScale = d3.scaleQuantile();
    _this.unselectedColorScale = d3.scaleQuantile();

    _this.projection = d3.geoEquirectangular();
    _this.path = d3.geoPath().projection(_this.projection);

    _this.tooltipData = _this.tooltipData.bind(_this);
    _this.onClick = _this.onClick.bind(_this);
    _this.onEnter = _this.onEnter.bind(_this);
    _this.onLeave = _this.onLeave.bind(_this);
    _this.renderLoadAnimation = _this.renderLoadAnimation.bind(_this);
    _this.renderMap = _this.renderMap.bind(_this);
    return _this;
  }

  _createClass(Choropleth, [{
    key: 'tooltipData',
    value: function tooltipData(id) {
      var _this2 = this;

      // Get datum based on id
      var index = -1;
      this.props.data.forEach(function (d, i) {
        if (d[_this2.props.keyField] === id) {
          index = i;
          return false;
        }
      });

      var datum = this.props.data[index];
      var count = typeof datum === 'undefined' ? 0 : datum[this.props.valueField];

      var tooltipData = {
        key: id,
        value: count
      };

      return tooltipData;
    }
  }, {
    key: 'onClick',
    value: function onClick(event) {
      var node = event.target;
      var id = node.getAttribute('data-id');
      this.props.onClick.apply(this, [id]);

      // Call this to remove tooltip
      this.props.onLeave(this.tooltipData(id), node);
    }
  }, {
    key: 'onEnter',
    value: function onEnter(event) {
      var node = event.target;
      var id = node.getAttribute('data-id');
      this.props.onEnter(this.tooltipData(id), node);
    }
  }, {
    key: 'onLeave',
    value: function onLeave(event) {
      var node = event.target;
      var id = node.getAttribute('data-id');
      this.props.onLeave(this.tooltipData(id), node);
    }
  }, {
    key: 'renderMap',
    value: function renderMap() {
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

      // Generate scale to determine class for coloring
      var tempSelectedColorScale = d3.scaleLinear().domain([0, this.props.numColorCat]).range([this.props.selectedMinColor, this.props.selectedMaxColor]).interpolate(d3.interpolateHcl);

      var tempUnselectedColorScale = d3.scaleLinear().domain([0, this.props.numColorCat]).range([this.props.unselectedMinColor, this.props.unselectedMaxColor]).interpolate(d3.interpolateHcl);

      var colorDomain = [0];
      this.props.data.forEach(function (d) {
        var datum = d[_this3.props.valueField];
        if (datum > 0) colorDomain.push(datum);
      });

      var selectedColorRange = [];
      var unselectedColorRange = [];
      d3.range(this.props.numColorCat).map(function (i) {
        selectedColorRange.push(tempSelectedColorScale(i));
        unselectedColorRange.push(tempUnselectedColorScale(i));
      });

      this.selectedColorScale.domain(colorDomain).range(selectedColorRange);

      this.unselectedColorScale.domain(colorDomain).range(unselectedColorRange);

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
          color = datum[_this3.props.selectedField] === _this3.props.selectedValue ? _this3.selectedColorScale(datum[_this3.props.valueField]) : _this3.unselectedColorScale(datum[_this3.props.valueField]);
        }
        return color;
      };

      return _react2.default.createElement(
        'g',
        null,
        _react2.default.createElement(
          'g',
          null,
          _topojson2.default.feature(this.props.map, this.props.map.objects.countries).features.map(function (d, i) {
            return _react2.default.createElement('path', { key: i,
              'data-id': d.id,
              d: _this3.path(d, i),
              fill: getColor(d.id),
              onClick: _this3.onClick,
              onMouseEnter: _this3.onEnter,
              onMouseLeave: _this3.onLeave });
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
  }, {
    key: 'renderLoadAnimation',
    value: function renderLoadAnimation() {
      var xPos = Math.floor(this.props.chartWidth / 2);
      var yPos = Math.floor(this.props.chartHeight / 2);
      var messageText = 'Loading data...';
      if (!this.props.loading) {
        if (this.props.status === 'Failed to fetch') {
          messageText = 'Can\'t connect to API URL';
        } else if (this.props.status !== 'OK') {
          messageText = 'Error retrieving data: ' + this.props.status;
        } else {
          messageText = 'No data returned!';
        }
      }
      return _react2.default.createElement(
        'g',
        { className: 'loading-message' },
        _react2.default.createElement(
          'text',
          { x: xPos, y: yPos },
          messageText
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var renderEl = null;
      renderEl = this.renderLoadAnimation(this.props);
      if (this.props.data.length > 0 && this.props.chartWidth !== 0) {
        renderEl = this.renderMap(this.props);
      }
      return renderEl;
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
  chartHeight: 0,
  chartWidth: 0,
  className: 'choropleth',
  data: [],
  keyField: 'key',
  valueField: 'value',
  loading: false,
  status: '',
  type: '',
  onClick: function onClick() {},
  onEnter: function onEnter() {},
  onLeave: function onLeave() {}
};

Choropleth.propTypes = {
  selectedMinColor: _react.PropTypes.string,
  selectedMaxColor: _react.PropTypes.string,
  unselectedMinColor: _react.PropTypes.string,
  unselectedMaxColor: _react.PropTypes.string,
  numColorCat: _react.PropTypes.number,
  map: _react.PropTypes.object.isRequired,
  chartHeight: _react.PropTypes.number.isRequired,
  chartWidth: _react.PropTypes.number.isRequired,
  className: _react.PropTypes.string.isRequired,
  data: _react.PropTypes.array,
  keyField: _react.PropTypes.string,
  valueField: _react.PropTypes.string,
  selectedField: _react.PropTypes.string,
  selectedValue: _react.PropTypes.string,
  loading: _react.PropTypes.bool,
  onClick: _react.PropTypes.func,
  onEnter: _react.PropTypes.func,
  onLeave: _react.PropTypes.func,
  status: _react.PropTypes.string
};

// Only required for REST calls
Choropleth.contextTypes = {
  filterField: _react.PropTypes.string,
  filterType: _react.PropTypes.string,
  params: _react.PropTypes.object,
  updateFilter: _react.PropTypes.func
};

exports.default = Choropleth;