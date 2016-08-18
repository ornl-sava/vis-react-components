'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setAxis = exports.setEase = exports.setScale = undefined;

var _d3Scale = require('d3-scale');

var _d3Ease = require('d3-ease');

var d3Ease = _interopRequireWildcard(_d3Ease);

var _d3Axis = require('d3-axis');

var d3Axis = _interopRequireWildcard(_d3Axis);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Returns a d3 scale given the type
// NOTE: Defaults to linear
var setScale = function setScale(scaleType) {
  var scale = null;
  if (/ordinal/.test(scaleType)) {
    if (scaleType === 'ordinalBand') {
      scale = (0, _d3Scale.scaleBand)();
    } else if (scaleType === 'ordinalPoint') {
      scale = (0, _d3Scale.scalePoint)();
    } else {
      scale = (0, _d3Scale.scaleOrdinal)();
    }
  } else if (scaleType === 'implicit') {
    scale = (0, _d3Scale.scaleImplicit)();
  } else if (scaleType === 'identity') {
    scale = (0, _d3Scale.scaleIdentity)();
  } else if (scaleType === 'time') {
    scale = (0, _d3Scale.scaleTime)();
  } else if (scaleType === 'timeUtc') {
    scale = (0, _d3Scale.scaleUtc)();
  } else if (scaleType === 'sqrt') {
    scale = (0, _d3Scale.scaleSqrt)();
  } else if (scaleType === 'log') {
    scale = (0, _d3Scale.scaleLog)();
  } else if (scaleType === 'power') {
    scale = (0, _d3Scale.scalePow)().exponent(0.5);
  } else if (scaleType === 'qunatile') {
    scale = (0, _d3Scale.scaleQuantile)();
  } else if (scaleType === 'quantize') {
    scale = (0, _d3Scale.scaleQuantize)();
  } else if (scaleType === 'threshold') {
    scale = (0, _d3Scale.scaleThreshold)();
  } else {
    scaleType = 'linear';
    scale = (0, _d3Scale.scaleLinear)();
  }
  scale.type = scaleType;
  return scale;
};

var setEase = function setEase(easeType) {
  var easing = 'ease' + easeType.charAt(0).toUpperCase() + easeType.slice(1);
  return d3Ease[easing];
};

var setAxis = function setAxis(orientationType) {
  var orientation = 'axis' + orientationType.charAt(0).toUpperCase() + orientationType.slice(1);
  return d3Axis[orientation]();
};

exports.setScale = setScale;
exports.setEase = setEase;
exports.setAxis = setAxis;