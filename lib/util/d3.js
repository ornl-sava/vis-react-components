'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setEase = exports.setScale = undefined;

var _d3Scale = require('d3-scale');

var _d3Ease = require('d3-ease');

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

// Returns a d3 ease given the type
// NOTE: Defaults to linear
var setEase = function setEase(easeType) {
  if (easeType === 'polyIn') {
    return _d3Ease.easePolyIn;
  } else if (easeType === 'polyOut') {
    return _d3Ease.easePolyOut;
  } else if (easeType === 'polyInOut') {
    return _d3Ease.easePolyInOut;
  } else if (easeType === 'quad') {
    return _d3Ease.easeQuad;
  } else if (easeType === 'quadIn') {
    return _d3Ease.easeQuadIn;
  } else if (easeType === 'quadOut') {
    return _d3Ease.easeQuadOut;
  } else if (easeType === 'easeQuadInOut') {
    return _d3Ease.easeQuadInOut;
  } else if (easeType === 'cubic') {
    return _d3Ease.easeCubic;
  } else if (easeType === 'cubicIn') {
    return _d3Ease.easeCubicIn;
  } else if (easeType === 'cubicOut') {
    return _d3Ease.easeCubicOut;
  } else if (easeType === 'cubicInOut') {
    return _d3Ease.easeCubicInOut;
  } else if (easeType === 'sin') {
    return _d3Ease.easeSin;
  } else if (easeType === 'sinIn') {
    return _d3Ease.easeSinIn;
  } else if (easeType === 'sinOut') {
    return _d3Ease.easeSinOut;
  } else if (easeType === 'sinInOut') {
    return _d3Ease.easeSinInOut;
  } else if (easeType === 'exp') {
    return _d3Ease.easeExp;
  } else if (easeType === 'expIn') {
    return _d3Ease.easeExpIn;
  } else if (easeType === 'expOut') {
    return _d3Ease.easeExpOut;
  } else if (easeType === 'expInOut') {
    return _d3Ease.easeExpInOut;
  } else if (easeType === 'circle') {
    return _d3Ease.easeCircle;
  } else if (easeType === 'circleIn') {
    return _d3Ease.easeCircleIn;
  } else if (easeType === 'circleOut') {
    return _d3Ease.easeCircleOut;
  } else if (easeType === 'circleInOut') {
    return _d3Ease.easeCircleInOut;
  } else if (easeType === 'elastic') {
    return _d3Ease.easeElastic;
  } else if (easeType === 'elasticIn') {
    return _d3Ease.easeElasticIn;
  } else if (easeType === 'elasticOut') {
    return _d3Ease.easeElasticOut;
  } else if (easeType === 'elasticInOut') {
    return _d3Ease.easeElasticInOut;
  } else if (easeType === 'back') {
    return _d3Ease.easeBack;
  } else if (easeType === 'backIn') {
    return _d3Ease.easeBackIn;
  } else if (easeType === 'backOut') {
    return _d3Ease.easeBackOut;
  } else if (easeType === 'backInOut') {
    return _d3Ease.easeBackInOut;
  } else if (easeType === 'bounce') {
    return _d3Ease.easeBounce;
  } else if (easeType === 'bounceIn') {
    return _d3Ease.easeBounceIn;
  } else if (easeType === 'bounceOut') {
    return _d3Ease.easeBounceOut;
  } else if (easeType === 'bounceInOut') {
    return _d3Ease.easeBounceInOut;
  } else {
    return _d3Ease.easeLinear;
  }
};

exports.setScale = setScale;
exports.setEase = setEase;