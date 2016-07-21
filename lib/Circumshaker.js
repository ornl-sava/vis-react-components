'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('d3');

var _d2 = require('./util/d3');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// NOTE: This component was built around data that was not concise.
// Flip flopping key used was required. Once data is changed,
// code will be fixed
var Circumshaker = function (_React$Component) {
  _inherits(Circumshaker, _React$Component);

  function Circumshaker(props) {
    _classCallCheck(this, Circumshaker);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Circumshaker).call(this, props));

    _this.graph = {};

    _this.depth = 0;
    _this.radius = 0;
    _this.nodeSizeScale = (0, _d2.setScale)('linear');

    _this.generateGraph = _this.generateGraph.bind(_this);

    _this.onClick = _this.onClick.bind(_this);
    _this.onEnter = _this.onEnter.bind(_this);
    _this.onLeave = _this.onLeave.bind(_this);
    _this.getDatum = _this.getDatum.bind(_this);

    _this.generateGraph(props);
    return _this;
  }

  // Update the domain for the shared scale


  _createClass(Circumshaker, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.generateGraph(nextProps);
    }
  }, {
    key: 'generateGraph',
    value: function generateGraph(props) {
      var _this2 = this;

      if (Object.keys(props.data).length > 0) {
        (function () {
          var graph = _this2.graph;

          // Instantiate nodes and links
          graph.nodes = [];
          graph.links = [];

          // Helper to generate graph's links and nodes
          var generateGraph = function generateGraph(data) {
            var depth = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
            var parent = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

            // Create node
            // TODO: Used some passed down prop to determine key, value used
            var node = depth !== 0 ? { key: data.key_as_string, value: data.doc_count, depth: depth } : { key: data.source_ip, value: data.dest_ip.length, depth: 0 };
            node.data = data;

            // Find possible duplicates
            var duplicate = graph.nodes.filter(function (d) {
              return d.key === node.key;
            });

            // Don't add duplicate nodes
            if (duplicate.length === 0) {
              graph.nodes.push(node);
            } else {
              // If duplicate, set node to the duplicate
              // This is to make sure the link is established with the correct node
              node = duplicate[0];
            }

            // Create Link
            var link = {
              source: parent,
              target: node
            };

            // Don't push link if it links to nothing
            if (parent !== null) {
              graph.links.push(link);
            }

            // To ensure next alternating path is taken during traversal
            // TODO: used some passed down prop to determine alternation
            var prop = null;
            if (data.hasOwnProperty('dest_ip')) {
              prop = 'dest_ip';
            } else if (data.hasOwnProperty('source_ip')) {
              prop = 'source_ip';
            }

            // Continue traversing data
            if (prop !== null) {
              data[prop].forEach(function (d) {
                generateGraph(d, depth + 1, node);
              });
            }
          };

          // Populate graph
          generateGraph(props.data);

          // Sort nodes and set parents to null
          graph.nodes.sort(function (a, b) {
            if (a.depth !== b.depth) {
              return (0, _d.ascending)(a.depth, b.depth);
            } else {
              var aKids = graph.links.filter(function (d) {
                return d.source === a;
              }).length;
              var bKids = graph.links.filter(function (d) {
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
                var children = graph.links.filter(function (h) {
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
            getNumLeafsHelper(graph.links.filter(function (g) {
              // Only count leaves that don't already have parents
              return g.source === _node && g.target.parent === null;
            }));

            return leafs.size();
          };

          // Find number of leafs for subtree
          graph.nodes.forEach(function (d) {
            // Set number of leafs for subtree
            d.leafs = getNumLeafs(d);

            // Claim children for node d
            // NOTE: This is ensure propering drawing during render
            graph.links.filter(function (g) {
              return g.source === d && g.target.parent === null;
            }).forEach(function (g) {
              g.target.parent = d;
            });
          });

          // Determine maximum depth allowed for rendering
          _this2.depth = Math.min((0, _d.max)(_this2.graph.nodes, function (d) {
            return d.depth;
          }), props.maxDepth);

          // Determine radius
          // NOTE: This is used as more of a radius 'band'
          _this2.radius = (0, _d.min)([props.chartWidth, props.chartHeight]) / _this2.depth / 2;

          // Determine properties used for each node during drawing
          // Properties determined are as follows
          // (x, y) - coordinate of where to palce node
          // degree - degree of where to map node to polar coordiante system
          // startAngle - used to help determine next degree used for children
          // wedge - degree 'space' allotted for a node
          // radius - radius used for drawing node
          graph.nodes.forEach(function (d, i) {
            d.x = props.chartWidth / 2;
            d.y = props.chartHeight / 2;
            d.degree = 0;
            d.startAngle = 0;
            d.wedge = 360;

            if (d.depth !== 0) {
              (function () {
                var parent = d.parent;
                var leafs = d.leafs;
                var totalLeafs = parent.leafs;

                if (leafs === 0) {
                  var siblings = graph.nodes.filter(function (g) {
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
                d.startAngle = parent.startAngle;
                parent.startAngle += d.wedge;
              })();
            }

            var r = _this2.radius * d.depth;
            d.x += r * Math.cos(d.degree * (Math.PI / 180));
            d.y += r * Math.sin(d.degree * (Math.PI / 180));
          });

          // Find max node size if not predefined
          var maxSize = props.nodeMaxSize !== null ? props.nodeMaxSize : graph.nodes.reduce(function (prev, curr) {
            var r = _this2.radius * curr.depth;
            var theta = curr.startAngle > curr.degree ? curr.startAngle - curr.degree : curr.degree - curr.startAngle;
            theta *= Math.PI / 180;
            var arcLength = r * theta;
            return prev < arcLength || arcLength === 0 ? prev : arcLength;
          }, Math.Infinity);

          // Create scale that determines node size
          _this2.nodeSizeScale.range([props.nodeMinSize, maxSize]).domain((0, _d.extent)(_this2.graph.nodes, function (d) {
            return _this2.graph.links.filter(function (g) {
              return g.source === d || g.target === d;
            }).length;
          }));
        })();
      }
    }
  }, {
    key: 'onClick',
    value: function onClick(event) {
      var target = event.target;
      this.props.onClick(event, this.getDatum(target));
    }
  }, {
    key: 'onEnter',
    value: function onEnter(event) {
      var target = event.target;
      this.props.onEnter(event, this.getDatum(target));

      // Only display linking paths
      var nodeIndex = target.getAttribute('data-nodeIndex');
      var gNode = this.graph.nodes[nodeIndex];
      this.graph.links.forEach(function (d, i) {
        d.display = d.source === gNode || d.target === gNode ? 'block' : 'none';
      });
      // NOTE: This might not be the most efficient
      // look into betters way sometime
      this.forceUpdate();
    }
  }, {
    key: 'onLeave',
    value: function onLeave(event) {
      var target = event.target;
      this.props.onLeave(event, this.getDatum(target));

      // Display all paths once again
      this.graph.links.forEach(function (d, i) {
        d.display = 'block';
      });
      // NOTE: This might not be the most efficient ... may need better way
      this.forceUpdate();
    }
  }, {
    key: 'getDatum',
    value: function getDatum(target) {
      var label = target.getAttribute('data-nodeKey');
      var count = target.getAttribute('data-nodeValue');
      return {
        label: label,
        count: count
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props;
      var chartWidth = _props.chartWidth;
      var chartHeight = _props.chartHeight;


      var det = function det(a, b, c) {
        return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
      };

      // Helper to create link paths
      var path = function path(d) {
        var depth = Math.min(d.source.depth, d.target.depth);
        var r = _this3.radius * depth + _this3.radius / 2;
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
        (0, _d.range)(1, this.depth + 1, 1).map(function (d, i) {
          var cocentricCircleProps = {
            className: 'cocentricCircle',
            key: i,
            r: _this3.radius * d,
            cx: chartWidth / 2,
            cy: chartHeight / 2
          };
          return _react2.default.createElement('circle', cocentricCircleProps);
        }),
        this.graph.links.map(function (d, i) {
          var linkProps = {
            className: 'link',
            key: i,
            display: typeof d.display === 'undefined' ? 'block' : d.display,
            d: path(d)
          };
          return _react2.default.createElement('path', linkProps);
        }),
        this.graph.nodes.map(function (d, i) {
          var nodeProps = {
            'data-nodeIndex': i,
            'data-nodeKey': d.key,
            'data-nodeValue': d.value,
            onMouseEnter: _this3.onEnter,
            onMouseLeave: _this3.onLeave,
            onClick: _this3.onClick,
            className: 'node',
            key: i,
            r: _this3.nodeSizeScale(_this3.graph.links.filter(function (g) {
              return g.source === d || g.target === d;
            }).length),
            cx: d.x,
            cy: d.y
          };
          return _react2.default.createElement('circle', nodeProps);
        })
      );
    }
  }]);

  return Circumshaker;
}(_react2.default.Component);

Circumshaker.defaultProps = {
  nodeMinSize: 8,
  nodeMaxSize: null,
  maxDepth: 3,
  labelField: 'label',
  data: {},
  onClick: function onClick() {},
  onEnter: function onEnter() {},
  onLeave: function onLeave() {}
};

Circumshaker.propTypes = {
  nodeMinSize: _react.PropTypes.number,
  nodeMaxSize: _react.PropTypes.number,
  maxDepth: _react.PropTypes.number,
  labelField: _react.PropTypes.string,
  chartHeight: _react.PropTypes.number,
  chartWidth: _react.PropTypes.number,
  className: _react.PropTypes.string,
  data: _react.PropTypes.object,
  onClick: _react.PropTypes.func,
  onEnter: _react.PropTypes.func,
  onLeave: _react.PropTypes.func
};

exports.default = Circumshaker;