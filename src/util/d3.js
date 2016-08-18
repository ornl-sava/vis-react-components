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

import * as d3Ease from 'd3-ease'

const setEase = (easeType) => {
  let easing = 'ease' + easeType.charAt(0).toUpperCase() + easeType.slice(1)
  return d3Ease[easing]
}

import * as d3Axis from 'd3-axis'

const setAxis = (orientationType) => {
  let orientation = 'axis' + orientationType.charAt(0).toUpperCase() + orientationType.slice(1)
  return d3Axis[orientation]()
}

export { setScale, setEase, setAxis }
