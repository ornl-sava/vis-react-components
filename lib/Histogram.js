'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

var _Bar = require('./Bar');

var _Bar2 = _interopRequireDefault(_Bar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Copied from http://stackoverflow.com/questions/4492678/swap-rows-with-columns-transposition-of-a-matrix-in-javascript
// Used that version to be concise
// need to test with jagged arrays
var transpose = function transpose(a) {
  return a[0].map(function (_, c) {
    return a.map(function (r) {
      return r[c];
    });
  });
};

var Histogram = function (_React$Component) {
  _inherits(Histogram, _React$Component);

  function Histogram(props) {
    _classCallCheck(this, Histogram);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Histogram).call(this, props));

    _this.state = { interval: null };
    return _this;
  }
  // Update the domain for the shared scale


  _createClass(Histogram, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.data.length > 0) {
        this.updateDomain(nextProps, this.state);
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      if (nextProps.data.length > 0 || nextProps.sortBy !== this.props.sortBy || nextProps.sortOrder !== this.props.sortOrder || nextProps.sortTypes !== this.props.sortTypes) {
        this.updateDomain(nextProps, nextState);
      }
      return true;
    }
  }, {
    key: 'updateDomain',
    value: function updateDomain(props, state) {
      var domainData = props.data;
      if (props.sortBy !== null && props.sortOrder !== null) {
        // Simple deep copy of data to prevent mutation of props
        domainData = this.sortData(JSON.parse(JSON.stringify(props.data)), props, state);
      }

      var yDomain = [0.00001, this.getMaxCount(props.data) * 1.1];
      var xDomain = domainData[0].bins.map(function (bin) {
        return bin[props.xAccessor];
      });

      if (xDomain[0] instanceof Date) {
        var interval = xDomain[1].getTime() - xDomain[0].getTime();
        this.setState({ interval: interval });
        // Add one more interval to the domain so all bins can be rendered property
        xDomain.push(new Date(xDomain[xDomain.length - 1].getTime() + interval));
        xDomain = [xDomain[0], xDomain[xDomain.length - 1]];
      }

      this.props.xScale.domain(xDomain);
      this.props.yScale.domain(yDomain);
    }
  }, {
    key: 'sortData',
    value: function sortData(data, props, state) {
      // NOTE: This WILL mutate the prop
      // Sort first bin and then sort rest of bins accordingly
      var sortArr = [];
      data[0].bins.sort(function (a, b) {
        var i = 0;
        if (props.sortBy === 'x') {
          i = props.sortOrder === 'Ascending' ? _d2.default.ascending(a[props.xAccessor], b[props.xAccessor]) : _d2.default.descending(a[props.xAccessor], b[props.xAccessor]);
        } else {
          var useBin = props.sortTypes.indexOf(data[0].type) > -1 || props.sortTypes.length === 0;
          var ya = useBin ? a[props.yAccessor] : 0;
          var yb = useBin ? b[props.yAccessor] : 0;
          for (var j = 1; j < data.length; j++) {
            var _useBin = props.sortTypes.indexOf(data[j].type) > -1 || props.sortTypes.length === 0;
            if (_useBin) {
              data[j].bins.forEach(function (d, i) {
                if (d[props.xAccessor] === a[props.xAccessor]) {
                  ya += d[props.yAccessor];
                }
                if (d[props.xAccessor] === b[props.xAccessor]) {
                  yb += d[props.yAccessor];
                }
              });
            }
          }
          i = props.sortOrder === 'Ascending' ? ya - yb : yb - ya;
        }
        sortArr.push(i);
        return i;
      });
      // Sort rest of bins in same manner

      var _loop = function _loop(i) {
        var j = 0;
        data[i].bins.sort(function (a, b) {
          return sortArr[j++];
        });
      };

      for (var i = 1; i < data.length; i++) {
        _loop(i);
      }
      return data;
    }
  }, {
    key: 'getMaxCount',
    value: function getMaxCount(dataArr) {
      var max = 0;
      var props = this.props;
      if (props.type === 'stacked') {
        var xArr = dataArr.reduce(function (prev, datum, histogramIndex) {
          if (histogramIndex > 0) {
            datum.bins.map(function (bin, index) {
              prev[index] += bin[props.yAccessor];
            });
          }
          return prev;
        }, dataArr[0].bins.map(function (bin) {
          return bin[props.yAccessor];
        }));
        max = Math.max.apply(Math, _toConsumableArray(xArr));
      } else {
        max = dataArr.reduce(function (oldMax, datum) {
          var localMax = Math.max.apply(Math, _toConsumableArray(datum.bins.map(function (bin) {
            return bin[props.yAccessor];
          })));
          return localMax > oldMax ? localMax : oldMax;
        }, 0);
      }
      return max;
    }
  }, {
    key: 'addOverlay',
    value: function addOverlay(barData) {
      var props = this.props;
      for (var i = 0; i < barData.length; i++) {
        var overlayObj = _extends({}, barData[i][0]);
        overlayObj.className = '_overlay';
        overlayObj.key = overlayObj.className + '-' + overlayObj.data[props.xAccessor];
        overlayObj[props.yAccessor] = 1;
        overlayObj.tooltipData = {};
        overlayObj.tooltipData.label = barData[i][0].data[props.xAccessor];
        overlayObj.tooltipData.stackNames = barData[i].reduce(function (prev, bar) {
          return bar ? [bar.name].concat(prev) : [''].concat(prev);
        }, []);
        overlayObj.tooltipData.stackCounts = barData[i].reduce(function (prev, bar) {
          return bar ? [bar.data[props.yAccessor]].concat(prev) : [0].concat(prev);
        }, []);
        overlayObj.tooltipData.yPos = barData[i][0][props.yAccessor];
        overlayObj.tooltipData.xPos = props.xScale(barData[i][0].data[props.xAccessor]);
        overlayObj.height = props.yScale.range()[0];
        barData[i].push(_extends(overlayObj, this.state));
      }
    }
  }, {
    key: 'buildABar',
    value: function buildABar(bin, name, type, height, width, y) {
      var props = this.props;
      var keyVal = type.toString() + '-' + bin[props.xAccessor].toString();
      return {
        name: name,
        className: bin.className ? type + ' ' + bin.className : type,
        key: keyVal,
        height: height,
        data: _extends({ x: bin[props.xAccessor], y: bin[props.yAccessor] }, bin),
        width: width,
        y: y
      };
    }
  }, {
    key: 'renderHistogram',
    value: function renderHistogram() {
      var _this2 = this;

      var _props = this.props;
      var chartWidth = _props.chartWidth;
      var chartHeight = _props.chartHeight;

      var props = _objectWithoutProperties(_props, ['chartWidth', 'chartHeight']);

      var numBins = props.data[0].bins.length;
      var paddedWidth = chartWidth * (1.0 - props.padding).toFixed(2);
      var barWidth = Math.floor(paddedWidth / (numBins + props.outerPadding * 2));
      if (typeof props.xScale.rangePoints === 'function') {
        props.xScale.rangeRoundBands([0, chartWidth], props.padding, props.outerPadding);
      } else {
        props.xScale.range([0, chartWidth]);
      }

      var barData = transpose(props.data.map(function (histogram, index) {
        return histogram.bins.map(function (bin) {
          var scaledY = chartHeight - props.yScale(bin[props.yAccessor]);
          var barHeight = bin[props.yAccessor] > 0 ? Math.max(Math.floor(scaledY), 5) : 0;
          var yPos = chartHeight - barHeight;
          return _this2.buildABar(bin, props.data[index].name, props.data[index].type, barHeight, barWidth, yPos);
        });
      }));

      if (props.addOverlay === true) {
        this.addOverlay(barData);
      }
      var svgBars = barData.map(function (dataArr, index) {
        return dataArr.map(function (data, barIndex) {
          if (!data) {
            return null;
          }
          // If we are a stacked bar chart we need to reference the previously stored
          // calculation for 'y' in barData. Can't easily calculate this above
          if (props.type === 'stacked' && barIndex > 0 && data.className !== '_overlay') {
            data[props.yAccessor] = dataArr[barIndex - 1][props.yAccessor] - data.height;
          }
          return _react2.default.createElement(_Bar2.default, _extends({}, data, { onClick: props.onBarClick, onEnter: props.onEnter, onLeave: props.onLeave }));
        });
      });

      var svgBins = svgBars.map(function (bars, i) {
        var yPos = 0;
        var xPos = props.xScale(barData[i][0].data[props.xAccessor]);
        if (xPos == null) {
          // also catches undefined
          xPos = 0;
        }
        return _react2.default.createElement(
          'g',
          { className: 'bin', key: props.className + '-' + i.toString(), transform: 'translate(' + xPos + ',' + yPos + ')' },
          bars
        );
      });
      return _react2.default.createElement(
        'g',
        null,
        svgBins
      );
    }
  }, {
    key: 'renderLoadAnimation',
    value: function renderLoadAnimation(props) {
      var chartWidth = props.chartWidth;
      var chartHeight = props.chartHeight;

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
      renderEl = this.renderLoadAnimation(this.props);
      if (this.props.data.length > 0 && this.props.chartWidth !== 0) {
        renderEl = this.renderHistogram(this.props);
      }
      return renderEl;
    }
  }]);

  return Histogram;
}(_react2.default.Component);

Histogram.defaultProps = {
  addOverlay: true,
  padding: 0.2,
  outerPadding: 0.4,
  chartHeight: 0,
  chartWidth: 0,
  className: 'histogram',
  data: [],
  loading: false,
  status: '',
  type: '',
  xAccessor: 'x',
  yAccessor: 'y',
  onBarClick: function onBarClick() {},
  onEnter: function onEnter() {},
  onLeave: function onLeave() {}
};

Histogram.propTypes = {
  sortBy: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.bool]),
  sortOrder: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.bool]),
  sortTypes: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.bool]),
  addOverlay: _react.PropTypes.bool,
  padding: _react.PropTypes.number.isRequired,
  outerPadding: _react.PropTypes.number.isRequired,
  chartHeight: _react.PropTypes.number.isRequired,
  chartWidth: _react.PropTypes.number.isRequired,
  className: _react.PropTypes.string.isRequired,
  data: _react.PropTypes.array,
  loading: _react.PropTypes.bool,
  onBarClick: _react.PropTypes.func,
  onEnter: _react.PropTypes.func,
  onLeave: _react.PropTypes.func,
  status: _react.PropTypes.string,
  type: _react.PropTypes.string,
  xAccessor: _react.PropTypes.string.isRequired,
  xScale: _react.PropTypes.any,
  yAccessor: _react.PropTypes.string.isRequired,
  yScale: _react.PropTypes.any
};

exports.default = Histogram;