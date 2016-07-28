'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HybridScatterHeatmap = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('d3');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var binByNumeric = function binByNumeric(data, accessor, range, numBins) {
  var bins = [];
  var step = (range[1] - range[0]) / numBins;

  for (var i = 0; i < numBins; i++) {
    var bin = [];
    for (var j = 0; j < data.length; j++) {
      if (data[j][accessor] < range[0] + (i + 1) * step && data[j][accessor] >= range[0] + i * step) {
        bin.push(data[j]);
      }
    }
    bin.key = i * step;
    bin.step = step;
    bin.count = bin.length;
    bins.push(bin);
  }

  return bins;
};

// Using file bound let so active heatmaps persist through view changes
var heatmap = void 0;

var HybridScatterHeatmap = exports.HybridScatterHeatmap = function (_React$Component) {
  _inherits(HybridScatterHeatmap, _React$Component);

  function HybridScatterHeatmap(props) {
    _classCallCheck(this, HybridScatterHeatmap);

    // Set default state
    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HybridScatterHeatmap).call(this, props));

    _this.state = {
      expandedSectionNumbers: [], // Section #s to divide at
      domainExpansionFactor: 1, // Factor of domain to be used
      rangeExpansionFactor: 2, // Factor to expand range by
      xScale: (0, _d.scaleTime)().nice(_d.timeSecond, 1),
      yScale: (0, _d.scaleLinear)(),
      scatterColorScale: (0, _d.scaleLinear)(),
      heatmapColorScale: (0, _d.scaleQuantile)()
    };

    // Use this to instead of 'let heatmap' to keep active heatmaps from persisting
    // this.heatmap = undefined

    _this.endTime = _this.props.startTime - _this.props.timeWindow;

    _this.createChart = _this.createChart.bind(_this);
    _this.updateChart = _this.updateChart.bind(_this);
    _this.resizeChart = _this.resizeChart.bind(_this);
    _this.updateScales = _this.updateScales.bind(_this);
    _this.updateAxes = _this.updateAxes.bind(_this);
    _this.updateScatter = _this.updateScatter.bind(_this);
    _this.updateHeatmap = _this.updateHeatmap.bind(_this);
    return _this;
  }

  _createClass(HybridScatterHeatmap, [{
    key: 'createChart',
    value: function createChart() {
      var _this2 = this;

      // Get root
      var root = this.refs.root;

      // Create svg
      var svg = (0, _d.select)(root).append('svg');

      // Create chart
      var chart = svg.append('g').attr('class', 'chart');

      // Resize Chart
      this.resizeChart();

      // Create title
      var header = chart.append('g').attr('class', 'header');

      header.append('text').attr('class', 'label time').text('Displaying events from ' + (0, _d.timeFormat)('%x %X')(new Date(this.endTime)) + ' to ' + (0, _d.timeFormat)('%x %X')(new Date(this.props.startTime)));

      header.append('text').attr('class', 'label reset').text('reset').on('click', function () {
        // Set heatmap data to inactive
        for (var i = 0; i < _this2.props.heatmapHorzDivisions; i++) {
          for (var j = 0; j < _this2.props.heatmapVertDivisions; j++) {
            heatmap[j][i].active = 0;
          }
        }
        // Remove expanded columns
        _this2.setState({
          expandedSectionNumbers: []
        }, function () {
          _this2.resizeChart();
        });
      });

      // Create container for heatmap bins
      chart.append('g').attr('class', 'heatmap data');

      // Create x axis
      chart.append('g').attr('class', 'x axis').append('text').attr('class', 'label').text(this.props.xLabel);

      // Create y axis
      chart.append('g').attr('class', 'y axis').append('text').attr('class', 'label').text(this.props.yLabel);

      // Create data container for scatter points
      chart.append('g').attr('class', 'scatter data');

      // Create color scale for scatter
      this.state.scatterColorScale.domain(this.props.yDomain).range([this.props.minScatterColor, this.props.maxScatterColor]).interpolate(_d.interpolateHcl);

      // Create color scale for heatmap
      var colors = [];
      var tempColorScale = (0, _d.scaleLinear)().domain([0, this.props.numColorCat]).range([this.props.minHeatmapColor, this.props.maxHeatmapColor]);

      (0, _d.range)(this.props.numColorCat).map(function (d) {
        colors.push(tempColorScale(d));
      });

      this.state.heatmapColorScale.range(colors);
    }
  }, {
    key: 'updateChart',
    value: function updateChart() {
      this.updateScales();
      this.updateAxes();
      this.updateHeatmap();
      this.updateScatter();
      // console.log(this.state.xScale.domain(), this.state.xScale.range())
    }
  }, {
    key: 'updateScatter',
    value: function updateScatter() {
      var _this3 = this;

      var root = this.refs.root;
      var chart = (0, _d.select)(root).select('svg').select('.chart');
      var scatterData = chart.select('.scatter.data');

      // Flatten and filter heatmap
      var data = heatmap.reduce(function (a, b) {
        return a.concat(b.filter(function (d) {
          return d.active;
        }));
      }, []).reduce(function (a, b) {
        return a.concat(b);
      }, []);

      // Bind subset of data for scatter
      var points = scatterData.selectAll('.point').data(data, function (d, i) {
        return d[_this3.props.idAccessor];
      });

      // Exit
      points.exit().remove();

      // Enter + Update
      points.enter().append('circle').attr('class', 'point').attr('r', 4).attr('cy', function (d) {
        return _this3.state.yScale(d[_this3.props.yAccessor]);
      }).attr('cx', function (d) {
        return _this3.state.xScale(d[_this3.props.xAccessor]);
      }).style('fill', function (d, i) {
        return _this3.state.scatterColorScale(d[_this3.props.yAccessor]);
      }).on('click.scatter.' + this.props.clsName, function (d, i) {
        return _this3.props.scatterOnClick(d, i);
      }).on('mouseover.scatter.' + this.props.clsName, function (d, i) {
        return _this3.props.scatterOnMouseOver(d, i);
      }).on('mouseout.scatter.' + this.props.clsName, function (d, i) {
        return _this3.props.scatterOnMouseOut(d, i);
      }).merge(points).style('fill', function (d, i) {
        return _this3.state.scatterColorScale(d[_this3.props.yAccessor]);
      }).attr('cx', function (d) {
        return _this3.state.xScale(d[_this3.props.xAccessor]);
      });
    }
  }, {
    key: 'updateHeatmap',
    value: function updateHeatmap() {
      var _this4 = this;

      var root = this.refs.root;
      var chart = (0, _d.select)(root).select('svg').select('.chart');
      var heatmapData = chart.select('.heatmap.data');

      // Rebin heatmap
      var tempHeatmap = binByNumeric(this.props.data, 'score', [0, 6], this.props.heatmapVertDivisions).reverse();
      tempHeatmap.forEach(function (d, i, arr) {
        arr[i] = binByNumeric(d, 'time', [_this4.endTime, _this4.props.startTime], _this4.props.heatmapHorzDivisions);
        arr[i].forEach(function (f, j) {
          f.rowIndex = i;
          f.yKey = d.key;
          f.yStep = d.step;
          f.active = typeof heatmap === 'undefined' ? false : heatmap[i][j].active;
        });
        arr[i].key = d.key;
        arr[i].step = d.step;
        arr[i].count = d.count;
      });

      heatmap = tempHeatmap;

      // Helper function to obtain the height of a single bin
      var binHeight = function binHeight(d) {
        var low = _this4.state.yScale(d.yKey);
        var high = _this4.state.yScale(d.yKey - d.yStep);
        return high - low >= 0 ? high - low : _this4.state.yScale(_this4.props.yDomain[1] - d.yStep);
      };

      var binWidth = function binWidth(d) {
        // Keep in sync by using already defined endTime above
        // console.log(this.endTime, d.key, d.step)
        var low = _this4.state.xScale(_this4.endTime + d.key);
        var high = _this4.state.xScale(_this4.endTime + d.key + d.step);
        return high - low;
      };

      // Bind subset of data for heatmap
      var rows = heatmapData.selectAll('.row').data(heatmap, function (d, i) {
        return i;
      });

      // Exit rows
      rows.exit().remove();

      // Enter + Update rows
      rows = rows.enter().append('g').attr('class', 'row').merge(rows).attr('transform', function (d, i) {
        var x = 0;
        var y = _this4.state.yScale(d.key + d.step);
        return 'translate(' + x + ',' + y + ')';
      });

      // Bind Bins
      var bins = rows.selectAll('.bin').data(function (d) {
        return d;
      }, function (d, i) {
        return i;
      });

      var self = this;

      // Exit Bins
      bins.exit().remove();

      // Enter + Update Bins
      bins.enter().append('rect').attr('class', 'bin').on('click.heatmap.' + this.props.clsName, function (d, i) {
        // Need to have reference to dynamic scope for access to d3 element, so no es6
        self.props.heatmapOnClick(d, i);
        heatmap[d.rowIndex][i].active = 1 - heatmap[d.rowIndex][i].active;
        self.updateChart();
      }).on('mouseover.heatmap.' + this.props.clsName, function (d, i) {
        return _this4.props.heatmapOnMouseOver(d, i);
      }).on('mouseout.heatmap.' + this.props.clsName, function (d, i) {
        return _this4.props.heatmapOnMouseOut(d, i);
      }).merge(bins).transition().duration(100).attr('opacity', function (d, i) {
        return heatmap[d.rowIndex][i].active ? 0 : 1;
      }).attr('x', function (d) {
        return _this4.state.xScale(_this4.endTime + d.key);
      }).attr('y', 0).attr('width', function (d) {
        return binWidth(d);
      }).attr('height', function (d) {
        return binHeight(d);
      }).attr('fill', function (d) {
        var color = d.count ? _this4.state.heatmapColorScale(d.count) : _this4.props.minHeatmapColor;
        return color;
      });

      var heatmapHeightBand = (this.props.height - this.props.margin.top - this.props.margin.bottom) / this.props.heatmapVertDivisions;

      // Create clickable markers to expand entire column
      var columnMarkers = heatmapData.selectAll('.markerCol').data(heatmap[0], function (d, i) {
        return i;
      });

      columnMarkers.enter().append('rect').attr('class', 'markerCol').on('click.markerCol', function (d, i) {
        if (event.shiftKey) {
          // Iterate over the columns corresponding bins and flip their activity
          for (var row = 0; row < _this4.props.heatmapVertDivisions; row++) {
            heatmap[row][i].active = 1 - heatmap[row][i].active;
          }
          self.updateChart();
        } else {
          var index = _this4.state.expandedSectionNumbers.indexOf(i);
          var toExpand = null;
          if (index > -1) {
            toExpand = _this4.state.expandedSectionNumbers;
            toExpand.splice(index, 1);
          } else {
            var chartWidth = root.offsetWidth - _this4.props.margin.left - _this4.props.margin.right;
            var originalBlockSize = chartWidth * (1 / _this4.props.heatmapHorzDivisions);
            var expandedBlockSize = originalBlockSize * _this4.state.rangeExpansionFactor;
            var pending = (_this4.state.expandedSectionNumbers.length + 1) * expandedBlockSize;
            if (pending >= chartWidth || _this4.state.expandedSectionNumbers.length + 1 === _this4.props.heatmapHorzDivisions) {
              toExpand = _this4.state.expandedSectionNumbers;
            } else {
              toExpand = _this4.state.expandedSectionNumbers.concat(i).sort(function (a, b) {
                return a - b;
              });
            }
          }
          _this4.setState({
            expandedSectionNumbers: toExpand
          }, function () {
            self.resizeChart();
          });
        }
      }).merge(columnMarkers).transition().duration(100).attr('x', function (d, i) {
        return _this4.state.xScale(_this4.endTime + d.key);
      }).attr('y', function (d, i) {
        return -(heatmapHeightBand / 4) - 3;
      }).attr('fill', function (d, i) {
        var count = 0;
        for (var row = 0; row < _this4.props.heatmapVertDivisions; row++) {
          count += heatmap[row][i].count;
        }
        var color = _this4.state.heatmapColorScale(count);
        return color;
      }).attr('width', function (d) {
        return binWidth(d);
      }).attr('height', function () {
        return heatmapHeightBand / 4;
      });
    }
  }, {
    key: 'updateScales',
    value: function updateScales() {
      var props = this.props;

      var originalTimeSlice = this.props.timeWindow / this.props.heatmapHorzDivisions;
      var expandedTimeSlice = originalTimeSlice * this.state.domainExpansionFactor;

      // Compute new end time
      var timeWindow = 0;
      for (var i = 0; i < this.props.heatmapHorzDivisions; i++) {
        if (this.state.expandedSectionNumbers.indexOf(i) > -1) {
          timeWindow += expandedTimeSlice;
        } else {
          timeWindow += originalTimeSlice;
        }
      }

      // console.log(timeWindow / 1000, originalTimeSlice, expandedTimeSlice)
      this.endTime = this.props.startTime - timeWindow;

      var xDomain = [this.endTime];
      for (var _i = 0; _i < this.props.heatmapHorzDivisions - 1; _i++) {
        var previous = xDomain[xDomain.length - 1];
        if (this.state.expandedSectionNumbers.indexOf(_i) > -1) {
          xDomain.push(previous + expandedTimeSlice);
        } else {
          xDomain.push(previous + originalTimeSlice);
        }
      }
      xDomain.push(this.props.startTime);

      // Update window of time x scale
      this.state.xScale.domain(xDomain);

      // Update y scale domain
      this.state.yScale.domain(props.yDomain);

      // Update scatter color scale
      this.state.scatterColorScale.domain(props.yDomain);

      // Update heatmap color scale
      var colorDomain = [0, 8];
      if (typeof heatmap !== 'undefined') {
        colorDomain.concat(heatmap.reduce(function (a, b) {
          return a.concat(b);
        }, []).map(function (d) {
          return d.length;
        }));
      }

      this.state.heatmapColorScale.domain(colorDomain);
    }
  }, {
    key: 'updateAxes',
    value: function updateAxes() {
      var root = this.refs.root;
      var svg = (0, _d.select)(root).select('svg');
      var chart = svg.select('.chart');

      chart.select('.header .time').text('Displaying events from ' + (0, _d.timeFormat)('%x %X')(new Date(this.endTime)) + ' to ' + (0, _d.timeFormat)('%x %X')(new Date(this.props.startTime)));

      chart.select('.x.axis').call((0, _d.axisBottom)().scale(this.state.xScale).ticks(5).tickFormat(function (a) {
        var format = (0, _d.timeFormat)('%I:%M:%S');
        return format(a);
      }));

      chart.select('.y.axis').call((0, _d.axisLeft)().scale(this.state.yScale));
    }
  }, {
    key: 'resizeChart',
    value: function resizeChart() {
      var root = this.refs.root;
      var svg = (0, _d.select)(root).select('svg');
      var chart = svg.select('.chart');

      var chartWidth = root.offsetWidth - this.props.margin.left - this.props.margin.right;
      var chartHeight = this.props.height - this.props.margin.top - this.props.margin.bottom;

      // Check edge cases to find where to place mid points
      var originalBlockSize = chartWidth * (1 / this.props.heatmapHorzDivisions);
      var expandedBlockSize = originalBlockSize * this.state.rangeExpansionFactor;
      var newBlockSize = (chartWidth - this.state.expandedSectionNumbers.length * expandedBlockSize) / (this.props.heatmapHorzDivisions - this.state.expandedSectionNumbers.length);
      var xRange = [0];

      for (var i = 0; i < this.props.heatmapHorzDivisions - 1; i++) {
        var previous = xRange[xRange.length - 1];
        if (this.state.expandedSectionNumbers.indexOf(i) > -1) {
          xRange.push(previous + expandedBlockSize);
        } else {
          xRange.push(previous + newBlockSize);
        }
      }

      xRange.push(chartWidth);
      this.state.xScale.range(xRange);

      this.state.yScale.range([chartHeight, 0]);
      chart.attr('transform', 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')');

      chart.select('.header .time').attr('y', -this.props.margin.top + 1).attr('dy', '0.71em').style('text-anchor', 'start');

      chart.select('.header .reset').attr('x', chartWidth).attr('y', -this.props.margin.top + 1).attr('dy', '0.71em').style('text-anchor', 'end');

      chart.select('.x.axis').attr('transform', 'translate(0,' + chartHeight + ')').call((0, _d.axisBottom)().scale(this.state.xScale)).select('.label').attr('x', chartWidth).attr('y', -6);

      chart.select('.y.axis').call((0, _d.axisLeft)().scale(this.state.yScale)).select('.label').attr('transform', 'rotate(-90)').attr('y', 6).attr('dy', '.35em');

      svg.attr('width', chartWidth + this.props.margin.left + this.props.margin.right).attr('height', chartHeight + this.props.margin.top + this.props.margin.bottom);

      this.updateChart();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.createChart();
      this.resizeChart();
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      this.updateChart();
      return false;
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', { ref: 'root', className: this.props.clsName });
    }
  }]);

  return HybridScatterHeatmap;
}(_react2.default.Component);

HybridScatterHeatmap.propTypes = {
  clsName: _react.PropTypes.string.isRequired,
  margin: _react.PropTypes.object,
  width: _react.PropTypes.number,
  height: _react.PropTypes.number,
  xLabel: _react.PropTypes.string,
  yLabel: _react.PropTypes.string,
  scatterOnClick: _react.PropTypes.func,
  scatterOnMouseOver: _react.PropTypes.func,
  scatterOnMouseOut: _react.PropTypes.func,
  heatmapOnClick: _react.PropTypes.func,
  heatmapOnMouseOver: _react.PropTypes.func,
  heatmapOnMouseOut: _react.PropTypes.func,
  idAccessor: _react.PropTypes.string,
  xAccessor: _react.PropTypes.string.isRequired,
  yAccessor: _react.PropTypes.string.isRequired,
  minScatterColor: _react.PropTypes.any,
  maxScatterColor: _react.PropTypes.any,
  minHeatmapColor: _react.PropTypes.any,
  maxHeatmapColor: _react.PropTypes.any,
  numColorCat: _react.PropTypes.number,
  yDomain: _react.PropTypes.array.isRequired,
  data: _react.PropTypes.array,
  startTime: _react.PropTypes.number,
  timeWindow: _react.PropTypes.number,
  heatmapVertDivisions: _react.PropTypes.number,
  heatmapHorzDivisions: _react.PropTypes.number,
  updateInterval: _react.PropTypes.number
};

// Set default props
HybridScatterHeatmap.defaultProps = {
  startTime: +new Date(),
  timeWindow: 20 * 1000,
  heatmapVertDivisions: 4,
  heatmapHorzDivisions: 4,
  updateInterval: 0,
  minHeatmapColor: '#ffffff',
  maxHeatmapColor: '#08306b',
  numColorCat: 11,
  minScatterColor: '#e5f5e0',
  maxScatterColor: '#00441b',
  margin: { top: 30, right: 5, bottom: 20, left: 50 },
  width: 400,
  height: 250,
  idAccessor: 'uuid',
  xLabel: 'x',
  yLabel: 'y',
  scatterOnClick: function scatterOnClick() {},
  scatterOnMouseOver: function scatterOnMouseOver() {},
  scatterOnMouseOut: function scatterOnMouseOut() {},
  heatmapOnClick: function heatmapOnClick() {},
  heatmapOnMouseOver: function heatmapOnMouseOver() {},
  heatmapOnMouseOut: function heatmapOnMouseOut() {}
};

exports.default = HybridScatterHeatmap;