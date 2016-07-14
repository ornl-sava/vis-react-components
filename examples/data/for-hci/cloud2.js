import * as d3 from 'd3'
// Word cloud layout by Jason Davies, https://www.jasondavies.com/wordcloud/
// Algorithm due to Jonathan Feinberg, http://static.mrfeinberg.com/bv_ch03.pdf

const cloudRadians = Math.PI / 180
const cw = 1 << 11 >> 5
const ch = 1 << 11

export default function () {
  let size = [256, 256]
  let text = cloudText
  let font = cloudFont
  let fontSize = cloudFontSize
  let fontStyle = cloudFontNormal
  let fontWeight = cloudFontNormal
  let rotate = cloudRotate
  let padding = cloudPadding
  let spiral = archimedeanSpiral
  let words = []
  let timeInterval = Infinity
  let eventa = d3.dispatch('word', 'end')
  let timer = null
  let random = Math.random
  let cloud = {}
  let canvas = cloudCanvas

  cloud.canvas = function (_) {
    // console.log('canvasFunc')
    arguments.length ? (canvas = functor(_), cloud) : canvas
    return arguments.length ? cloud : canvas
  }

  cloud.start = function () {
    // console.log('startFunc')
    let contextAndRatio = getContext(canvas())
    let board = zeroArray((size[0] >> 5) * size[1])
    let bounds = null
    let n = words.length
    let i = -1
    let tags = []
    let data = words.map((d, i) => {
      d.text = text.call(this, d, i)
      d.font = font.call(this, d, i)
      d.style = fontStyle.call(this, d, i)
      d.weight = fontWeight.call(this, d, i)
      d.rotate = rotate.call(this, d, i)
      d.size = ~~fontSize.call(this, d, i)
      d.padding = padding.call(this, d, i)
      return d
    }).sort((a, b) => { return b.size - a.size })

    if (timer) clearInterval(timer)
    timer = setInterval(step, 0)
    step()

    return cloud

    function step () {
      let start = Date.now()
      if (timer) {
        while (Date.now() - start < timeInterval && ++i < n) {
          var d = data[i]
          d.x = (size[0] * (random() + 0.5)) >> 1
          d.y = (size[1] * (random() + 0.5)) >> 1
          cloudSprite(contextAndRatio, d, data, i)
          if (d.hasText && place(board, d, bounds)) {
            tags.push(d)
            // eventa.word(d)
            eventa.call('word', d)
            if (bounds) cloudBounds(bounds, d)
            else bounds = [{x: d.x + d.x0, y: d.y + d.y0}, {x: d.x + d.x1, y: d.y + d.y1}]
            // Temporary hack
            d.x -= size[0] >> 1
            d.y -= size[1] >> 1
          }
        }
      }
      if (i >= n) {
        cloud.stop()
        eventa.call('end', (tags, bounds))
      }
    }
  }

  cloud.stop = function () {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    return cloud
  }

  function getContext (canvas) {
    // canvas.width = canvas.height = 1
    var ratio = Math.sqrt(canvas.getContext('2d').getImageData(0, 0, 1, 1).data.length >> 2)
    // canvas.width = (cw << 5) / ratio
    // canvas.height = ch / ratio

    var context = canvas.getContext('2d')
    context.fillStyle = context.strokeStyle = 'red'
    context.textAlign = 'center'

    return {context: context, ratio: ratio}
  }

  function place (board, tag, bounds) {
    // let perimeter = [{x: 0, y: 0}, {x: size[0], y: size[1]}]
    let startX = tag.x
    let startY = tag.y
    let maxDelta = Math.sqrt(size[0] * size[0] + size[1] * size[1])
    let s = spiral(size)
    let dt = random() < 0.5 ? 1 : -1
    let t = -dt
    let dxdy
    let dx
    let dy

    while (s(t += dt)) {
      dxdy = s(t += dt)
      dx = ~~dxdy[0]
      dy = ~~dxdy[1]

      if (Math.min(Math.abs(dx), Math.abs(dy)) >= maxDelta) break

      tag.x = startX + dx
      tag.y = startY + dy

      if (tag.x + tag.x0 < 0 || tag.y + tag.y0 < 0 ||
          tag.x + tag.x1 > size[0] || tag.y + tag.y1 > size[1]) continue
      // TODO only check for collisions within current bounds.
      if (!bounds || !cloudCollide(tag, board, size[0])) {
        if (!bounds || collideRects(tag, bounds)) {
          let sprite = tag.sprite
          let w = tag.width >> 5
          let sw = size[0] >> 5
          let lx = tag.x - (w << 4)
          let sx = lx & 0x7f
          let msx = 32 - sx
          let h = tag.y1 - tag.y0
          let x = (tag.y + tag.y0) * sw + (lx >> 5)
          let last
          for (var j = 0; j < h; j++) {
            last = 0
            for (var i = 0; i <= w; i++) {
              board[x + i] |= (last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0)
            }
            x += sw
          }
          delete tag.sprite
          return true
        }
      }
    }
    return false
  }

  cloud.timeInterval = function (_) {
    arguments.length ? (timeInterval = _ == null ? Infinity : _, cloud) : timeInterval
    return arguments.length ? cloud : timeInterval
  }

  cloud.words = function (_) {
    // console.log('wordFunc')
    arguments.length ? (words = _, cloud) : words
    return arguments.length ? cloud : words
  }

  cloud.size = function (_) {
    // console.log('sizeFunc')
    arguments.length ? (size = [+_[0], +_[1]], cloud) : size
    return arguments.length ? cloud : size
  }

  cloud.font = function (_) {
    // console.log('fontFunc')
    arguments.length ? (font = functor(_), cloud) : font
    return arguments.length ? cloud : font
  }

  cloud.fontStyle = function (_) {
    arguments.length ? (fontStyle = functor(_), cloud) : fontStyle
    return arguments.length ? cloud : fontStyle
  }

  cloud.fontWeight = function (_) {
    arguments.length ? (fontWeight = functor(_), cloud) : fontWeight
    return arguments.length ? cloud : fontWeight
  }

  cloud.rotate = function (_) {
    // console.log('rotateFunc')
    arguments.length ? (rotate = functor(_), cloud) : rotate
    return arguments.length ? cloud : rotate
  }

  cloud.text = function (_) {
    arguments.length ? (text = functor(_), cloud) : text
    return arguments.length ? cloud : text
  }

  cloud.spiral = function (_) {
    arguments.length ? (spiral = spirals[_] || _, cloud) : spiral
    return arguments.length ? cloud : spiral
  }

  cloud.fontSize = function (_) {
    // console.log('fontSize')
    arguments.length ? (fontSize = functor(_), cloud) : fontSize
    return arguments.length ? cloud : fontSize
  }

  cloud.padding = function (_) {
    // console.log('paddingFunc')
    arguments.length ? (padding = functor(_), cloud) : padding
    return arguments.length ? cloud : padding
  }

  cloud.random = function (_) {
    arguments.length ? (random = _, cloud) : random
    return arguments.length ? cloud : random
  }

  cloud.on = function () {
    // console.log('onFunc')
    var value = eventa.on.apply(eventa, arguments)
    return arguments.length ? cloud : value
  }

  return cloud
}

function cloudText (d) {
  return d.text
}

function cloudFont () {
  return 'serif'
}

function cloudFontNormal () {
  return 'normal'
}

function cloudFontSize (d) {
  return Math.sqrt(d.value)
}

function cloudRotate () {
  return (~~(Math.random() * 6) - 3) * 30
}

function cloudPadding () {
  return 1
}

// Fetches a monochrome sprite bitmap for the specified text.
// Load in batches for speed.
function cloudSprite (contextAndRatio, d, data, di) {
  if (d.sprite) return
  let c = contextAndRatio.context
  let ratio = contextAndRatio.ratio

  c.clearRect(0, 0, (cw << 5) / ratio, ch / ratio)
  let x = 0
  let y = 0
  let maxh = 0
  let n = data.length
  --di
  while (++di < n) {
    d = data[di]
    c.save()
    c.font = d.style + ' ' + d.weight + ' ' + ~~((d.size + 1) / ratio) + 'px ' + d.font
    let w = c.measureText(d.text + 'm').width * ratio
    let h = d.size << 1
    if (d.rotate) {
      let sr = Math.sin(d.rotate * cloudRadians)
      let cr = Math.cos(d.rotate * cloudRadians)
      let wcr = w * cr
      let wsr = w * sr
      let hcr = h * cr
      let hsr = h * sr
      w = (Math.max(Math.abs(wcr + hsr), Math.abs(wcr - hsr)) + 0x1f) >> 5 << 5
      h = ~~Math.max(Math.abs(wsr + hcr), Math.abs(wsr - hcr))
    } else {
      w = (w + 0x1f) >> 5 << 5
    }
    if (h > maxh) maxh = h
    if (x + w >= (cw << 5)) {
      x = 0
      y += maxh
      maxh = 0
    }
    if (y + h >= ch) break
    c.translate((x + (w >> 1)) / ratio, (y + (h >> 1)) / ratio)
    if (d.rotate) c.rotate(d.rotate * cloudRadians)
    c.fillText(d.text, 0, 0)
    if (d.padding) {
      c.lineWidth = 2 * d.padding
      c.strokeText(d.text, 0, 0)
    }
    c.restore()
    d.width = w
    d.height = h
    d.xoff = x
    d.yoff = y
    d.x1 = w >> 1
    d.y1 = h >> 1
    d.x0 = -d.x1
    d.y0 = -d.y1
    d.hasText = true
    x += w
  }
  let pixels = c.getImageData(0, 0, (cw << 5) / ratio, ch / ratio).data
  let sprite = []
  while (--di >= 0) {
    d = data[di]
    if (!d.hasText) continue
    let w = d.width
    let w32 = w >> 5
    let h = d.y1 - d.y0
    // Zero the buffer
    for (let i = 0; i < h * w32; i++) sprite[i] = 0
    x = d.xoff
    if (x == null) return
    y = d.yoff
    let seen = 0
    let seenRow = -1
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        let k = w32 * j + (i >> 5)
        let m = pixels[((y + j) * (cw << 5) + (x + i)) << 2] ? 1 << (31 - (i % 32)) : 0
        sprite[k] |= m
        seen |= m
      }
      if (seen) seenRow = j
      else {
        d.y0++
        h--
        j--
        y++
      }
    }
    d.y1 = d.y0 + seenRow
    d.sprite = sprite.slice(0, (d.y1 - d.y0) * w32)
  }
}

// Use mask-based collision detection.
function cloudCollide (tag, board, sw) {
  sw >>= 5
  let sprite = tag.sprite
  let w = tag.width >> 5
  let lx = tag.x - (w << 4)
  let sx = lx & 0x7f
  let msx = 32 - sx
  let h = tag.y1 - tag.y0
  let x = (tag.y + tag.y0) * sw + (lx >> 5)
  let last
  for (let j = 0; j < h; j++) {
    last = 0
    for (let i = 0; i <= w; i++) {
      if (((last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0)) &
      board[x + i]) return true
    }
    x += sw
  }
  return false
}

function cloudBounds (bounds, d) {
  let b0 = bounds[0]
  let b1 = bounds[1]
  if (d.x + d.x0 < b0.x) b0.x = d.x + d.x0
  if (d.y + d.y0 < b0.y) b0.y = d.y + d.y0
  if (d.x + d.x1 > b1.x) b1.x = d.x + d.x1
  if (d.y + d.y1 > b1.y) b1.y = d.y + d.y1
}

function collideRects (a, b) {
  return a.x + a.x1 > b[0].x && a.x + a.x0 < b[1].x && a.y + a.y1 > b[0].y && a.y + a.y0 < b[1].y
}

function archimedeanSpiral (size) {
  var e = size[0] / size[1]
  return function (t) {
    return [e * (t *= 0.1) * Math.cos(t), t * Math.sin(t)]
  }
}

function rectangularSpiral (size) {
  let dy = 4
  let dx = dy * size[0] / size[1]
  let x = 0
  let y = 0
  return function (t) {
    var sign = t < 0 ? -1 : 1
    // See triangular numbers: T_n = n * (n + 1) / 2.
    switch ((Math.sqrt(1 + 4 * sign * t) - sign) & 3) {
      case 0: x += dx; break
      case 1: y += dy; break
      case 2: x -= dx; break
      default: y -= dy; break
    }
    return [x, y]
  }
}

// TODO reuse arrays?
function zeroArray (n) {
  let a = []
  let i = -1
  while (++i < n) a[i] = 0
  return a
}

function cloudCanvas () {
  return document.createElement('canvas')
}

function functor (d) {
  return typeof d === 'function' ? d : function () { return d }
}

var spirals = {
  archimedean: archimedeanSpiral,
  rectangular: rectangularSpiral
}
