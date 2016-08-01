import {
  scaleBand,
  scalePoint,
  scaleIdentity,
  scaleLinear,
  scaleLog,
  scaleOrdinal,
  scaleImplicit,
  scalePow,
  scaleSqrt,
  scaleQuantile,
  scaleQuantize,
  scaleThreshold,
  scaleTime,
  scaleUtc
} from 'd3-scale'

// Returns a d3 scale given the type
// NOTE: Defaults to linear
const setScale = (scaleType) => {
  let scale = null
  if (/ordinal/.test(scaleType)) {
    if (scaleType === 'ordinalBand') {
      scale = scaleBand()
    } else if (scaleType === 'ordinalPoint') {
      scale = scalePoint()
    } else {
      scale = scaleOrdinal()
    }
  } else if (scaleType === 'implicit') {
    scale = scaleImplicit()
  } else if (scaleType === 'identity') {
    scale = scaleIdentity()
  } else if (scaleType === 'time') {
    scale = scaleTime()
  } else if (scaleType === 'timeUtc') {
    scale = scaleUtc()
  } else if (scaleType === 'sqrt') {
    scale = scaleSqrt()
  } else if (scaleType === 'log') {
    scale = scaleLog()
  } else if (scaleType === 'power') {
    scale = scalePow().exponent(0.5)
  } else if (scaleType === 'qunatile') {
    scale = scaleQuantile()
  } else if (scaleType === 'quantize') {
    scale = scaleQuantize()
  } else if (scaleType === 'threshold') {
    scale = scaleThreshold()
  } else {
    scaleType = 'linear'
    scale = scaleLinear()
  }
  scale.type = scaleType
  return scale
}

import {
  easeLinear,
  easePolyIn,
  easePolyOut,
  easePolyInOut,
  easeQuad,
  easeQuadIn,
  easeQuadOut,
  easeQuadInOut,
  easeCubic,
  easeCubicIn,
  easeCubicOut,
  easeCubicInOut,
  easeSin,
  easeSinIn,
  easeSinOut,
  easeSinInOut,
  easeExp,
  easeExpIn,
  easeExpOut,
  easeExpInOut,
  easeCircle,
  easeCircleIn,
  easeCircleOut,
  easeCircleInOut,
  easeElastic,
  easeElasticIn,
  easeElasticOut,
  easeElasticInOut,
  easeBack,
  easeBackIn,
  easeBackOut,
  easeBackInOut,
  easeBounce,
  easeBounceIn,
  easeBounceOut,
  easeBounceInOut
} from 'd3-ease'

// Returns a d3 ease given the type
// NOTE: Defaults to linear
const setEase = (easeType) => {
  if (easeType === 'polyIn') {
    return easePolyIn
  } else if (easeType === 'polyOut') {
    return easePolyOut
  } else if (easeType === 'polyInOut') {
    return easePolyInOut
  } else if (easeType === 'quad') {
    return easeQuad
  } else if (easeType === 'quadIn') {
    return easeQuadIn
  } else if (easeType === 'quadOut') {
    return easeQuadOut
  } else if (easeType === 'easeQuadInOut') {
    return easeQuadInOut
  } else if (easeType === 'cubic') {
    return easeCubic
  } else if (easeType === 'cubicIn') {
    return easeCubicIn
  } else if (easeType === 'cubicOut') {
    return easeCubicOut
  } else if (easeType === 'cubicInOut') {
    return easeCubicInOut
  } else if (easeType === 'sin') {
    return easeSin
  } else if (easeType === 'sinIn') {
    return easeSinIn
  } else if (easeType === 'sinOut') {
    return easeSinOut
  } else if (easeType === 'sinInOut') {
    return easeSinInOut
  } else if (easeType === 'exp') {
    return easeExp
  } else if (easeType === 'expIn') {
    return easeExpIn
  } else if (easeType === 'expOut') {
    return easeExpOut
  } else if (easeType === 'expInOut') {
    return easeExpInOut
  } else if (easeType === 'circle') {
    return easeCircle
  } else if (easeType === 'circleIn') {
    return easeCircleIn
  } else if (easeType === 'circleOut') {
    return easeCircleOut
  } else if (easeType === 'circleInOut') {
    return easeCircleInOut
  } else if (easeType === 'elastic') {
    return easeElastic
  } else if (easeType === 'elasticIn') {
    return easeElasticIn
  } else if (easeType === 'elasticOut') {
    return easeElasticOut
  } else if (easeType === 'elasticInOut') {
    return easeElasticInOut
  } else if (easeType === 'back') {
    return easeBack
  } else if (easeType === 'backIn') {
    return easeBackIn
  } else if (easeType === 'backOut') {
    return easeBackOut
  } else if (easeType === 'backInOut') {
    return easeBackInOut
  } else if (easeType === 'bounce') {
    return easeBounce
  } else if (easeType === 'bounceIn') {
    return easeBounceIn
  } else if (easeType === 'bounceOut') {
    return easeBounceOut
  } else if (easeType === 'bounceInOut') {
    return easeBounceInOut
  } else {
    return easeLinear
  }
}

export { setScale, setEase }
