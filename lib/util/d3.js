'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setScale = undefined;

var _d = require('d3');

// Returns a d3 scale given the type
// NOTE: Defaults to linear
var setScale = function setScale(scaleType) {
  var scale = null;
  if (/ordinal/.test(scaleType)) {
    if (scaleType === 'ordinalBand') {
      scale = (0, _d.scaleBand)();
    } else if (scaleType === 'ordinalPoint') {
      scale = (0, _d.scalePoint)();
    } else {
      scale = (0, _d.scaleOrdinal)();
    }
  } else if (scaleType === 'implicit') {
    scale = (0, _d.scaleImplicit)();
  } else if (scaleType === 'identity') {
    scale = (0, _d.scaleIdentity)();
  } else if (scaleType === 'time') {
    scale = (0, _d.scaleTime)();
  } else if (scaleType === 'timeUtc') {
    scale = (0, _d.scaleUtc)();
  } else if (scaleType === 'sqrt') {
    scale = (0, _d.scaleSqrt)();
  } else if (scaleType === 'log') {
    scale = (0, _d.scaleLog)();
  } else if (scaleType === 'power') {
    scale = (0, _d.scalePow)().exponent(0.5);
  } else if (scaleType === 'qunatile') {
    scale = (0, _d.scaleQuantile)();
  } else if (scaleType === 'quantize') {
    scale = (0, _d.scaleQuantize)();
  } else if (scaleType === 'threshold') {
    scale = (0, _d.scaleThreshold)();
  } else {
    scaleType = 'linear';
    scale = (0, _d.scaleLinear)();
  }
  scale.type = scaleType;
  return scale;
};

exports.setScale = setScale;