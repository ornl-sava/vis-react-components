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

var _SVGComponent = require('./SVGComponent');

var _SVGComponent2 = _interopRequireDefault(_SVGComponent);

var _d2 = require('./util/d3');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Circumshaker = function (_React$Component) {
  _inherits(Circumshaker, _React$Component);

  function Circumshaker(props) {
    _classCallCheck(this, Circumshaker);

    var _this = _possibleConstructorReturn(this, (Circumshaker.__proto__ || Object.getPrototypeOf(Circumshaker)).call(this, props));

    _this.graph = {
      nodes: [],
      links: []
    };

    _this.depth = 0;
    _this.radius = 0;

    _this.nodeSizeScale = (0, _d2.setScale)('linear');

    _this.generateGraph = _this.generateGraph.bind(_this);

    _this.onClick = _this.onClick.bind(_this);
    _this.onEnter = _this.onEnter.bind(_this);
    _this.onLeave = _this.onLeave.bind(_this);
    return _this;
  }

  _createClass(Circumshaker, [{
    key: 'generateGraph',
    value: function generateGraph() {
      var _this2 = this;

      this.graph.nodes.length = 0;
      this.graph.links.length = 0;
      if (Object.keys(this.props.data).length === 0) {
        return;
      }
      // Instantiate nodes and links

      // Helper to generate graph's links and nodes
      var genGraph = function genGraph(data) {
        var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        // Create node
        var node = {
          key: data[_this2.props.keyAccessor],
          value: data[_this2.props.valueAccessor],
          depth: depth

          // Bind all of data to node
        };node.data = data;

        // Find possible duplicates
        var duplicate = _this2.graph.nodes.filter(function (d) {
          return d.key === node.key;
        });

        // Don't add duplicate nodes
        if (duplicate.length === 0) {
          _this2.graph.nodes.push(node);
        } else {
          // If duplicate, set node to the duplicate
          // This is to make sure the link is established with the correct node
          node = duplicate[0];
        }

        // Create Link
        var link = {
          source: parent,
          target: node

          // Don't push link if it links to nothing
        };if (parent !== null) {
          _this2.graph.links.push(link);
        }

        // Continue traversing data
        if (_this2.props.childAccessor in data) {
          data[_this2.props.childAccessor].forEach(function (d) {
            genGraph(d, depth + 1, node);
          });
        }
      };

      // Populate graph
      genGraph(this.props.data);

      // Sort nodes and set parents to null
      this.graph.nodes.sort(function (a, b) {
        if (a.depth !== b.depth) {
          return (0, _d.ascending)(a.depth, b.depth);
        } else {
          var aKids = _this2.graph.links.filter(function (d) {
            return d.source === a;
          }).length;
          var bKids = _this2.graph.links.filter(function (d) {
            return d.source === b;
          }).length;

          return bKids - aKids;
        }
      }).forEach(function (d) {
        d.parent = null;
      });

      // Function to get leafs of a given subtree
      var getNumLeafs = function getNumLeafs(_node) {
        var leafs = (0, _d.set)();

        var getNumLeafsHelper = function getNumLeafsHelper(_links) {
          _links.forEach(function (g) {
            var children = _this2.graph.links.filter(function (h) {
              return g.target === h.source;
            });

            if (children.length === 0 && !leafs.has(g.target.key)) {
              leafs.add(g.target.key);
            } else {
              getNumLeafsHelper(children);
            }
          });
        };

        // Count leaves
        getNumLeafsHelper(_this2.graph.links.filter(function (g) {
          // Only count leaves that don't already have parents
          return g.source === _node && g.target.parent === null;
        }));

        return leafs.size();
      };

      // Find number of leafs for subtree
      this.graph.nodes.forEach(function (d) {
        // Set number of leafs for subtree
        d.leafs = getNumLeafs(d);

        // Claim children for node d
        // NOTE: This is ensure propering drawing during render
        _this2.graph.links.filter(function (g) {
          return g.source === d && g.target.parent === null;
        }).forEach(function (g) {
          g.target.parent = d;
        });
      });

      // Determine maximum depth allowed for rendering
      this.depth = Math.min((0, _d.max)(this.graph.nodes, function (d) {
        return d.depth;
      }), this.props.maxDepth);

      // Determine radius
      // NOTE: This is used as more of a radius 'band'
      this.radius = (0, _d.min)([this.props.chartWidth, this.props.chartHeight]) / this.depth / 2;

      // will be used to keep track of nodes with same degree
      var degreeDict = {};
      for (var i = 0; i <= this.depth; i++) {
        degreeDict[i] = {};
      }

      // Determine properties used for each node during drawing
      // Properties determined are as follows
      // (x, y) - coordinate of where to palce node
      // degree - degree of where to map node to polar coordiante system
      // startAngle - used to help determine next degree used for children
      // wedge - degree 'space' allotted for a node
      // radius - radius used for drawing node
      this.graph.nodes.forEach(function (d, i) {
        d.x = _this2.props.chartWidth / 2;
        d.y = _this2.props.chartHeight / 2;
        d.degree = 0;
        d.startAngle = 0;
        d.wedge = 360;

        if (d.depth !== 0) {
          var parent = d.parent;
          var leafs = d.leafs;
          var totalLeafs = parent.leafs;

          if (leafs === 0) {
            var siblings = _this2.graph.nodes.filter(function (g) {
              return g.parent === parent;
            });
            var siblingTotalLeafCount = 0;
            var numberOfSiblingsWithNoLeafs = 0;
            siblings.forEach(function (g) {
              if (g.leafs === 0) {
                numberOfSiblingsWithNoLeafs += 1;
              } else {
                siblingTotalLeafCount += g.leafs;
              }
            });

            d.wedge = (parent.wedge - siblingTotalLeafCount / totalLeafs * parent.wedge) / numberOfSiblingsWithNoLeafs;
          } else {
            d.wedge = leafs / totalLeafs * parent.wedge;
          }

          d.degree = parent.startAngle + d.wedge / 2;
          d.degree = d.degree % 360;
          if (!degreeDict[d.depth][d.degree]) {
            degreeDict[d.depth][d.degree] = 0;
          }
          degreeDict[d.depth][d.degree] += 1;
          d.startAngle = parent.startAngle;
          parent.startAngle += d.wedge;
        }
      });

      this.graph.nodes.forEach(function (d, i) {
        // rotate each node until it's not on top of another node
        while (degreeDict[d.depth][d.degree] > 1 && _this2.props.forcedSeparation > 0) {
          degreeDict[d.depth][d.degree] -= 1;
          d.degree += _this2.props.forcedSeparation;
          if (!degreeDict[d.depth][d.degree]) {
            degreeDict[d.depth][d.degree] = 0;
          }
          degreeDict[d.depth][d.degree] += 1;
        }
        // calculate final position for each node
        var r = _this2.radius * d.depth;
        d.x += r * Math.cos(d.degree * (Math.PI / 180));
        d.y += r * Math.sin(d.degree * (Math.PI / 180));
      });

      // Find max node size if not predefined
      var maxSize = this.props.nodeMaxSize !== null ? this.props.nodeMaxSize : Math.min(this.graph.nodes.reduce(function (prev, curr) {
        var r = _this2.radius * curr.depth;
        var theta = curr.startAngle > curr.degree ? curr.startAngle - curr.degree : curr.degree - curr.startAngle;
        theta *= Math.PI / 180;
        var arcLength = r * theta;
        return prev < arcLength || arcLength === 0 ? prev : arcLength;
      }, Math.Infinity), this.radius / 2);

      // Create scale that determines node size
      this.nodeSizeScale.range([this.props.nodeMinSize, maxSize]).domain((0, _d.extent)(this.graph.nodes, function (d) {
        return _this2.graph.links.filter(function (g) {
          return g.source === d || g.target === d;
        }).length;
      }));
    }
  }, {
    key: 'onClick',
    value: function onClick(event, data, index) {
      this.props.onClick(event, data, index);
    }
  }, {
    key: 'onEnter',
    value: function onEnter(event, data, index) {
      var _this3 = this;

      this.props.onEnter(event, data, index);

      // Only display linking paths
      var gNode = this.graph.nodes[index];
      this.graph.links.forEach(function (d, i) {
        var key = d.source.key.replace(/\W/g, '') + '-' + d.target.key.replace(/\W/g, '');
        var link = _this3.refs[key];
        link.style.display = d.source === gNode || d.target === gNode ? 'block' : 'none';
      });
    }
  }, {
    key: 'onLeave',
    value: function onLeave(event, data, index) {
      var _this4 = this;

      this.props.onLeave(event, data, index);

      // Display all paths once again
      this.graph.links.forEach(function (d, i) {
        var key = d.source.key.replace(/\W/g, '') + '-' + d.target.key.replace(/\W/g, '');
        var link = _this4.refs[key];
        link.style.display = 'block';
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      var _props = this.props,
          chartWidth = _props.chartWidth,
          chartHeight = _props.chartHeight;

      this.generateGraph();
      var det = function det(a, b, c) {
        return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
      };

      // Helper to create link paths
      var path = function path(d) {
        var depth = Math.min(d.source.depth, d.target.depth);
        var r = _this5.radius * depth + _this5.radius / 2;
        var root = {
          x: chartWidth / 2,
          y: chartHeight / 2
        };
        var sweep = det(d.source, d.target, root) <= 0 ? 0 : 1;
        var arc = 'L ' + d.target.x + ',' + d.target.y;
        if (d.source.depth !== 0) {
          arc = 'A ' + r + ',' + r + ' ' + 0 + ' ' + 0 + ',' + sweep + ' ' + d.target.x + ',' + d.target.y;
        }
        return 'M ' + d.source.x + ',' + d.source.y + ' ' + arc;
      };

      return _react2.default.createElement(
        'g',
        { className: this.props.className },
        _react2.default.createElement(
          'g',
          null,
          (0, _d.range)(1, this.depth + 1, 1).map(function (d, i) {
            return _react2.default.createElement('circle', {
              className: 'concentricCircle',
              key: i,
              r: _this5.radius * d,
              cx: chartWidth / 2,
              cy: chartHeight / 2 });
          })
        ),
        this.graph.links.map(function (d, i) {
          return _react2.default.createElement('path', { ref: d.source.key.replace(/\W/g, '') + '-' + d.target.key.replace(/\W/g, ''),
            key: d.source.key.replace(/\W/g, '') + '-' + d.target.key.replace(/\W/g, ''),
            className: 'link',
            d: path(d),
            display: typeof d.display === 'undefined' ? 'block' : d.display });
        }),
        _react2.default.createElement(
          _reactTransitionGroup.TransitionGroup,
          { component: 'g' },
          this.graph.nodes.map(function (d, i) {
            return _react2.default.createElement(_SVGComponent2.default, {
              key: d.key.replace(/\W/g, ''),
              className: 'node',
              Component: 'circle',
              data: d,
              index: i,
              onClick: _this5.onClick,
              onMouseEnter: _this5.onEnter,
              onMouseLeave: _this5.onLeave,
              onEnter: {
                func: function func(transition, props) {
                  var radius = _this5.radius * (_this5.depth + 1);
                  var degree = props.data.degree;
                  var x = _this5.props.chartWidth / 2;
                  var y = _this5.props.chartHeight / 2;
                  x += radius * Math.cos(degree * (Math.PI / 180));
                  y += radius * Math.sin(degree * (Math.PI / 180));
                  transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attrTween('r', function () {
                    return (0, _d.interpolate)(0, props.r);
                  }).attrTween('cx', function () {
                    return (0, _d.interpolate)(x, props.cx);
                  }).attrTween('cy', function () {
                    return (0, _d.interpolate)(y, props.cy);
                  });
                  return transition;
                }
              },
              onUpdate: {
                func: function func(transition, props) {
                  transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attr('r', props.r).attr('cx', props.cx).attr('cy', props.cy);
                  return transition;
                }
              },
              onExit: {
                func: function func(transition, props) {
                  var radius = _this5.radius * (_this5.depth + 1);
                  var degree = props.data.degree;
                  var x = _this5.props.chartWidth / 2;
                  var y = _this5.props.chartHeight / 2;
                  x += radius * Math.cos(degree * (Math.PI / 180));
                  y += radius * Math.sin(degree * (Math.PI / 180));
                  transition.delay(0).duration(500).ease((0, _d2.setEase)('linear')).attr('r', 0).attr('cx', x).attr('cy', y);
                  return transition;
                }
              },
              r: _this5.nodeSizeScale(_this5.graph.links.filter(function (g) {
                return g.source === d || g.target === d;
              }).length),
              cx: d.x,
              cy: d.y,
              fill: _this5.props.colorFunction ? _this5.props.colorFunction(d) : null });
          })
        )
      );
    }
  }]);

  return Circumshaker;
}(_react2.default.Component);

Circumshaker.defaultProps = {
  keyAccessor: 'key',
  valueAccessor: 'value',
  childAccessor: 'children',
  nodeMinSize: 8,
  nodeMaxSize: null,
  maxDepth: 3,
  forcedSeparation: 15,
  data: {},
  onClick: function onClick() {},
  onEnter: function onEnter() {},
  onLeave: function onLeave() {}

  // nodeMaxSize defaults to using largest fit possible space
};Circumshaker.propTypes = {
  keyAccessor: _propTypes2.default.string,
  valueAccessor: _propTypes2.default.string,
  childAccessor: _propTypes2.default.string,
  nodeMinSize: _propTypes2.default.number,
  nodeMaxSize: _propTypes2.default.number,
  maxDepth: _propTypes2.default.number,
  forcedSeparation: _propTypes2.default.number,
  chartHeight: _propTypes2.default.number,
  chartWidth: _propTypes2.default.number,
  className: _propTypes2.default.string,
  data: _propTypes2.default.object,
  onClick: _propTypes2.default.func,
  onEnter: _propTypes2.default.func,
  onLeave: _propTypes2.default.func,
  colorFunction: _propTypes2.default.func
};

exports.default = Circumshaker;