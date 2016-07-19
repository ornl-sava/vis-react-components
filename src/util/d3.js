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
} from 'd3'

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

export { setScale }
