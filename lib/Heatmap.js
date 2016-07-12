'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('d3');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Heatmap = function (_React$Component) {
  _inherits(Heatmap, _React$Component);

  function Heatmap(props) {
    _classCallCheck(this, Heatmap);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Heatmap).call(this, props));

    _this.colorScale = (0, _d.scaleQuantile)();
    _this.xDomain = _this.props.xDomain;
    _this.yDomain = _this.props.yDomain;

    _this.onClick = _this.onClick.bind(_this);
    _this.onEnter = _this.onEnter.bind(_this);
    _this.onLeave = _this.onLeave.bind(_this);
    _this.updateDomain = _this.updateDomain.bind(_this);
    _this.renderLoadAnimation = _this.renderLoadAnimation.bind(_this);
    _this.renderHeatmap = _this.renderHeatmap.bind(_this);

    _this.updateDomain(props, _this.state);
    return _this;
  }
  // Update the domain for the shared scale


  _createClass(Heatmap, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.updateDomain(nextProps, this.state);
    }
  }, {
    key: 'updateDomain',
    value: function updateDomain(props, state) {
      if (props.data.length > 0 && props.data[0].bins.length > 0) {
        // If xDomain is not predefined
        // NOTE: When determining domain for x the first bin is Used
        // Each bin should have matching x domain keys
        var xDomain = props.xDomain;
        if (xDomain.length === 0) {
          // NOTE: Computing offset so proper xDomain is given for time scales
          // Nth bin has a start time of it's key; so it's 'end time'
          // must be taken into consideration
          var offset = props.data[0].bins[1][props.xAccessor.key] - props.data[0].bins[0][props.xAccessor.key];
          if (props.xScale.type === 'ordinalBand') {
            xDomain = props.data[0].bins.map(function (d) {
              return d[props.xAccessor.key];
            });
          } else {
            xDomain = (0, _d.extent)(props.data[0].bins, function (d) {
              return d[props.xAccessor.key];
            });
            xDomain[1] = xDomain[1] + offset;
          }
        }

        // If yDomain is not predefined
        var yDomain = props.yDomain;
        if (yDomain.length === 0) {
          // NOTE: Computing offset so proper xDomain is given for time scales
          // Nth bin has a start time of it's key; so it's 'end time'
          // must be taken into consideration
          // let offset = props.data[1][props.yAccessor.key] -
          // props.data[0][props.yAccessor.key]
          if (props.yScale.type === 'ordinalBand') {
            yDomain = props.data.map(function (d) {
              return d[props.yAccessor.key];
            });
          } else {
            yDomain = [0.000001, (0, _d.max)(props.data, function (d) {
              return d[props.yAccessor.key];
            })];
            // yDomain[1] = yDomain[1] + offset
          }
        }

        // Update scale if domains are new
        if (xDomain !== this.xDomain) {
          this.props.xScale.domain(xDomain);
          this.xDomain = xDomain;
        }

        if (yDomain !== this.yDomain) {
          this.props.yScale.domain(yDomain);
          this.yDomain = yDomain;
        }

        // Generate color scale
        var yMax = props.colorPerRow ? (0, _d.max)(props.data, function (d, i) {
          return (0, _d.max)(d.bins, function (e, j) {
            return e[props.xAccessor.value];
          });
        }) : (0, _d.max)(props.data, function (d, i) {
          return d[props.yAccessor.value];
        });

        var tempColorScale = (0, _d.scaleLinear)().domain([0, yMax]).range([props.minColor, props.maxColor]).interpolate(_d.interpolateHcl);

        var colorDomain = [0, 1];
        var colorRange = [props.minColor];
        var colorDomainBand = yMax / (props.numColorCat - 1);
        for (var i = 2; i < props.numColorCat + 1; i++) {
          var value = colorDomain[i - 1] + colorDomainBand;
          if (i === 2) value--;
          colorDomain.push(value);
          colorRange.push(tempColorScale(value));
        }

        // NOTE: Alternate quantile color generation . . .
        // Generate scale to determine class for coloring
        // let tempColorScale = scale.linear()
        //   .domain([0, props.numColorCat])
        //   .range([props.minColor, props.maxColor])
        //   .interpolate(interpolateHcl)
        //
        // let colorDomain = [0, 1]
        // props.data.forEach((d) => {
        //   d.bins.forEach((g) => {
        //     let datum = g[props.yAccessor.value]
        //     if (datum > 0) colorDomain.push(datum)
        //   })
        // })
        //
        // let colorRange = []
        // range(props.numColorCat).map((i) => {
        //   colorRange.push(tempColorScale(i))
        // })

        this.colorScale.domain(colorDomain).range(colorRange);
      }
    }
  }, {
    key: 'onClick',
    value: function onClick(event) {
      // Call this to remove tooltip
      this.props.onClick(event);
    }
  }, {
    key: 'onEnter',
    value: function onEnter(event) {
      var node = event.target;
      this.props.onEnter(this.tooltipData(node), node);
    }
  }, {
    key: 'onLeave',
    value: function onLeave(event) {
      var node = event.target;
      this.props.onLeave(this.tooltipData(node), node);
    }
  }, {
    key: 'tooltipData',
    value: function tooltipData(node) {
      var key = node.getAttribute('data-key');
      var value = node.getAttribute('data-value');
      return {
        key: key,
        value: value
      };
    }
  }, {
    key: 'renderHeatmap',
    value: function renderHeatmap() {
      var _this2 = this;

      var props = this.props;
      return _react2.default.createElement(
        'g',
        { className: props.className },
        props.data.map(function (d, i) {
          var height = i === 0 ? props.chartHeight : props.yScale(props.data[i - 1][props.yAccessor.key]);
          height -= props.yScale(d[props.yAccessor.key]);
          return d.bins.map(function (e, j) {
            var width = j + 1 < d.bins.length ? props.xScale(d.bins[j + 1][props.xAccessor.key]) : props.chartWidth;
            width -= props.xScale(e[props.xAccessor.key]);
            var rectProps = {
              'data-key': e[props.labelField],
              'data-value': e[props.xAccessor.value],
              'key': i + j,
              'x': props.xScale(e[props.xAccessor.key]),
              'y': props.yScale(d[props.yAccessor.key]),
              'width': width,
              'height': height,
              'fill': _this2.colorScale(e[props.xAccessor.value]),
              'onMouseEnter': _this2.onEnter,
              'onMouseLeave': _this2.onLeave,
              'onClick': _this2.onClick
            };
            return _react2.default.createElement('rect', rectProps);
          });
        })
      );
    }
  }, {
    key: 'renderLoadAnimation',
    value: function renderLoadAnimation() {
      var _props = this.props;
      var chartWidth = _props.chartWidth;
      var chartHeight = _props.chartHeight;

      var props = _objectWithoutProperties(_props, ['chartWidth', 'chartHeight']);

      var xPos = Math.floor(chartWidth / 2);
      var yPos = Math.floor(chartHeight / 2);
      var messageText = 'Loading data...';
      if (!props.loading) {
        if (props.status === 'Failed to fetch') {
          messageText = 'Can\'t connect to API URL';
        } else if (props.status !== 'OK') {
          messageText = 'Error retrieving data: ' + props.status;
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
      renderEl = this.renderLoadAnimation();
      if (this.props.data.length > 0 && this.props.chartWidth !== 0) {
        renderEl = this.renderHeatmap();
      }
      return renderEl;
    }
  }]);

  return Heatmap;
}(_react2.default.Component);

Heatmap.defaultProps = {
  minColor: '#eff3ff',
  maxColor: '#2171b5',
  numColorCat: 11,
  colorPerRow: true,
  labelField: 'label',
  chartHeight: 0,
  chartWidth: 0,
  className: 'heatmap',
  data: [],
  xDomain: [],
  yDomain: [],
  xAccessor: {
    key: 'key',
    value: 'value'
  },
  yAccessor: {
    key: 'key',
    value: 'value'
  },
  loading: false,
  status: '',
  onClick: function onClick() {},
  onEnter: function onEnter() {},
  onLeave: function onLeave() {}
};

Heatmap.propTypes = {
  minColor: _react.PropTypes.string,
  maxColor: _react.PropTypes.string,
  numColorCat: _react.PropTypes.number,
  colorPerRow: _react.PropTypes.bool,
  labelField: _react.PropTypes.string,
  xDomain: _react.PropTypes.array,
  xAccessor: _react.PropTypes.object,
  yDomain: _react.PropTypes.array,
  yAccessor: _react.PropTypes.object,
  chartHeight: _react.PropTypes.number.isRequired,
  chartWidth: _react.PropTypes.number.isRequired,
  className: _react.PropTypes.string.isRequired,
  data: _react.PropTypes.array,
  loading: _react.PropTypes.bool,
  onClick: _react.PropTypes.func,
  onEnter: _react.PropTypes.func,
  onLeave: _react.PropTypes.func,
  status: _react.PropTypes.string,
  xScale: _react.PropTypes.any,
  yScale: _react.PropTypes.any
};

exports.default = Heatmap;