'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('./util/d3');

var _d2 = require('d3');

var d3 = _interopRequireWildcard(_d2);

var _Tooltip = require('./Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bezierLine = function bezierLine(node1, node2) {
  return 'M' + node1.x + ',' + node1.y + 'S' + node1.x + ',' + (node1.y + node2.y) / 2 + ' ' + node2.x + ',' + node2.y;
};

var ForceDirectedGraph = function (_React$Component) {
  _inherits(ForceDirectedGraph, _React$Component);

  function ForceDirectedGraph(props) {
    _classCallCheck(this, ForceDirectedGraph);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ForceDirectedGraph).call(this, props));

    _this.state = {
      nodes: [],
      links: []
    };

    _this.nodes = [];
    _this.links = [];
    _this.data = props.data;
    _this.rootNode = d3.hierarchy(_this.data).sum(function (d) {
      return d.value;
    }).sort(function (a, b) {
      return b.height - a.height || b.value - a.value;
    });
    _this.setTree(props);

    _this.colScale = d3.scaleOrdinal(d3.schemeCategory10);
    _this.xScale = (0, _d.setScale)('ordinalBand');

    _this.updateDR = _this.updateDR.bind(_this);
    _this.updateDR(props);

    _this.simulation = d3.forceSimulation();
    _this.setSim(props);

    _this.onDClick = _this.onDClick.bind(_this);
    _this.simOn = false;

    _this.tip = props.tipFunction ? new _Tooltip2.default().attr('className', 'd3-tip').html(props.tipFunction) : props.tipFunction;
    _this.onEnter = _this.onEnter.bind(_this);
    _this.onLeave = _this.onLeave.bind(_this);

    _this.pos = new Array(2);
    _this.nodePos = new Array(2);
    _this.isDrag = false;
    _this.onDrag = _this.onDrag.bind(_this);
    _this.onDragStart = _this.onDragStart.bind(_this);
    _this.onDragEnd = _this.onDragEnd.bind(_this);
    _this.hidingNodes = [];
    return _this;
  }

  _createClass(ForceDirectedGraph, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      // using the nodes with the x and y values attached in falseStart
      this.setState({ nodes: this.nodes, links: this.links });
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      // need to have a catch for if the props change rather than state...
      return true;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.simulation.stop();
    }
  }, {
    key: 'onDClick',
    value: function onDClick(event) {
      if (this.simOn) {
        console.log('FDG-onDC-simOn');
        this.simOn = false;
        // both don't need to be on... play with alpha
        this.setSim(this.props);
        this.simulation.restart();
        this.isDrag = false;
      } else {
        console.log('FDG-onDC-simOff', this.links);
        this.simOn = true;
        this.isDrag = false;
        this.setState({ nodes: this.nodes, links: this.links });
        this.simulation.stop();
        this.setTree(this.props);
      }
    }
  }, {
    key: 'onEnter',
    value: function onEnter(event) {
      var target = this.getDatum(event.target);
      // console.log('FDGT-onE', target)
      var type = 'Node ';
      if (target.data.events.indexOf('parent-') >= 0) {
        type = 'Parent ';
      } else if (target.data.events.indexOf('root-') >= 0) {
        type = 'Root ';
      }
      var tooltipD = { label: type + event.target.getAttribute('data-key') + ' at Hour ' + target.data.hour, counts: target.data.events.length };
      if (target && this.props.tipFunction) {
        this.tip.show(event, tooltipD);
      }
      this.props.onEnter(event, target);
    }
  }, {
    key: 'onLeave',
    value: function onLeave(event) {
      var target = this.getDatum(event.target);
      var tooltipD = { label: 'Hour-' + target.data.hour, counts: target.data.events.length };
      if (target && this.props.tipFunction) {
        this.tip.hide(event, tooltipD);
      }
      this.props.onLeave(event, target);
    }
  }, {
    key: 'onDragStart',
    value: function onDragStart(event) {
      // console.log('FFG-oDStart-HERE')
      this.simulation.stop();
      var target = this.getDatum(event.target);
      // let i = target.data.index
      if (target.children !== null) {
        target._children = target.children;
        target.children = null;
        // need to fix
        if (this.simOn) {
          this.setTree(this.props);
          this.setState({ nodes: this.nodes, links: this.links });
        } else {
          this.reSet(this.props);
          this.setSim(this.props);
          this.simulation.alphaTarget(0.3).restart();
        }
      } else if (target.children === null) {
        target.children = target._children;
        target._children = null;
        this.reSet(this.props);
        this.setSim(this.props);
        this.simulation.alphaTarget(0.3).restart();
      }
      // else {
      //   this.pos = [event.clientX, event.clientY]
      //   this.isDrag = true
      //   let pos = [this.nodes[i].x, this.nodes[i].y]
      //   pos = pos.slice(0)
      //   // console.log('FFG-oDStart-i', i)
      //   this.nodes[i].fx = this.nodePos[0] = pos[0]
      //   this.nodes[i].fy = this.nodePos[1] = pos[1]
      //   this.simulation.alphaTarget(0.3).restart()
      // }
    }
  }, {
    key: 'onDrag',
    value: function onDrag(event) {
      if (this.isDrag) {
        var target = this.getDatum(event.target);
        var tooltipD = { label: ' ', counts: target.data.events.length };
        var i = this.getIndex(event.target);
        this.nodes[i].fx = event.clientX - this.pos[0] + this.nodePos[0];
        this.nodes[i].fy = event.clientY - this.pos[1] + this.nodePos[1];
        // hiding tool tip on drag
        if (target && this.props.tipFunction) {
          this.tip.hide(event, tooltipD);
        }
      }
    }
  }, {
    key: 'onDragEnd',
    value: function onDragEnd(event) {
      this.isDrag = false;
      this.pos = [0, 0];
      // console.log('FFG-oDE')
      var i = this.getIndex(event.target);
      this.nodes[i].fx = null;
      this.nodes[i].fy = null;
      this.simulation.alphaTarget(0);
    }
  }, {
    key: 'updateDR',
    value: function updateDR(props) {
      this.colScale.domain(d3.range(0, props.numTData, 1));
      this.xScale.domain(d3.range(0, props.numTData, 1)).range([0, props.chartWidth]).padding(0.2);
    }
  }, {
    key: 'getIndex',
    value: function getIndex(target) {
      return target.getAttribute('data-index');
    }
  }, {
    key: 'getDatum',
    value: function getDatum(target) {
      var i = target.getAttribute('data-index');
      return this.nodes[i];
    }
  }, {
    key: 'setSim',
    value: function setSim(props) {
      var _this2 = this;

      this.simulation
      // .alphaTarget(0.4) // animation will not stop if the target is not 0
      // .alphaDecay(0.1) // slower start
      .alphaMin(0.01).force('link', d3.forceLink().id(function (d, i) {
        return i;
      })).force('charge', d3.forceManyBody().strength(-30).distanceMax(500)).force('center', d3.forceCenter(props.chartWidth / 2, props.chartHeight / 2));

      this.simulation.nodes(this.nodes).on('tick', function (d, i) {
        _this2.simUpdate(d, i);
      });

      this.simulation.force('link').links(this.links);
    }
  }, {
    key: 'simUpdate',
    value: function simUpdate(d, i) {
      this.setState({ nodes: this.nodes, links: this.links });
    }
  }, {
    key: 'setTree',
    value: function setTree(props) {
      var tree = d3.tree().size([props.chartWidth, props.chartHeight]);
      tree(this.rootNode);
      this.nodes = this.rootNode.descendants();
      this.links = this.rootNode.links();
      // console.log('FDG-setTree')
    }
  }, {
    key: 'reSet',
    value: function reSet() {
      this.nodes = this.rootNode.descendants();
      this.links = this.rootNode.links();
    }
  }, {
    key: 'drawSim',
    value: function drawSim(props) {
      var _this3 = this;

      // console.log('FDG-draw-props', props)
      var nodeList = [];
      var linkList = [];
      // console.log('FDG-draw-state', this.state)
      // console.log('FDG-draw-radius', props.radius)
      var events = {
        // 'onMouseMove': this.onDrag,
        'onMouseDown': this.onDragStart,
        // 'onMouseUp': this.onDragEnd,
        'onMouseEnter': this.onEnter,
        'onMouseLeave': this.onLeave
      };
      this.state.nodes.map(function (d, i) {
        var circleProps = {
          'data-key': d.data.index,
          'data-index': i,
          'r': props.radius,
          'cx': d.x,
          'cy': d.y,
          'fill': _this3.colScale(d.data.hour),
          'events': d.events,
          'hour': d.hour
        };
        nodeList.push(_react2.default.createElement('circle', _extends({ key: 'cir-id' + d.data.index + '-hr-' + d.hour }, events, circleProps)));
      });
      this.state.links.map(function (data, index) {
        if (props.isCurved) {
          linkList.push(_react2.default.createElement('path', { key: 'line-id-' + linkList.length, className: 'lineMatch', d: bezierLine(data.source, data.target), style: { stroke: '#cdd5e4', strokeWidth: 2 } }));
        } else {
          var lineData = {
            x1: data.source.x,
            y1: data.source.y,
            x2: data.target.x,
            y2: data.target.y,
            style: { stroke: '#cdd5e4', strokeWidth: 2 },
            data: data
          };
          linkList.push(_react2.default.createElement('line', _extends({ key: 'line-id' + linkList.length }, lineData)));
        }
      });
      return _react2.default.createElement(
        'g',
        { onDoubleClick: this.onDClick },
        linkList,
        nodeList
      );
    }
  }, {
    key: 'render',
    value: function render() {
      // console.log('FDG-r')
      var el = null;
      var props = this.props;
      el = this.drawSim(props);
      return _react2.default.createElement(
        'g',
        { className: props.className + 'fdg' },
        el
      );
    }
  }]);

  return ForceDirectedGraph;
}(_react2.default.Component);

ForceDirectedGraph.defaultProps = {
  xAccessor: 'x',
  yAccessor: 'y',
  radius: 7,
  onClick: function onClick() {},
  onEnter: function onEnter() {},
  onLeave: function onLeave() {},
  className: '',
  tipFunction: function tipFunction() {},
  isCurved: true
};

ForceDirectedGraph.propTypes = {
  chartHeight: _react.PropTypes.number,
  chartWidth: _react.PropTypes.number,
  className: _react.PropTypes.string,
  radius: _react.PropTypes.number,
  tipFunction: _react.PropTypes.func,
  xScale: _react.PropTypes.any,
  yScale: _react.PropTypes.any,
  data: _react.PropTypes.object,
  onClick: _react.PropTypes.func,
  onEnter: _react.PropTypes.func,
  onLeave: _react.PropTypes.func,
  isCurved: _react.PropTypes.bool
};

exports.default = ForceDirectedGraph;