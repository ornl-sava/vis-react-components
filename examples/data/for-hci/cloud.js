import * as d3 from 'd3'
// Word cloud layout by Jason Davies, http://www.jasondavies.com/word-cloud/
// Algorithm due to Jonathan Feinberg, http://static.mrfeinberg.com/bv_ch03.pdf
(function (exports) {
  function cloud () {
    let size = [256, 256]
    let text = cloudText
    let font = cloudFont
    let fontSize = cloudFontSize
    let rotate = cloudRotate
    let padding = cloudPadding
    let spiral = archimedeanSpiral
    let words = []
    let timeInterval = Infinity
    let event = d3.dispatch('word', 'end')
    let timer = null
    let cloud = {}

    cloud.start = function () {
      let board = zeroArray((size[0] >> 5) * size[1])
      let bounds = null
      let n = words.length
      let i = -1
      let tags = []
      let data = words.map(function (d, i) {
        return {
          text: text.call(this, d, i),
          font: font.call(this, d, i),
          rotate: rotate.call(this, d, i),
          size: ~~fontSize.call(this, d, i),
          padding: cloudPadding.call(this, d, i)
        }
      }).sort(function (a, b) { return b.size - a.size })

      if (timer) clearInterval(timer)
      timer = setInterval(step, 0)
      step()

      return cloud

      function step () {
        let start = +new Date()
        let d
        if (timer) {
          while (+new Date() - start < timeInterval && ++i < n) {
            d = data[i]
            d.x = (size[0] * (Math.random() + 0.5)) >> 1
            d.y = (size[1] * (Math.random() + 0.5)) >> 1
            cloudSprite(d, data, i)
            if (place(board, d, bounds)) {
              tags.push(d)
              event.word(d)
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
          event.end(tags, bounds)
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

    cloud.timeInterval = function (x) {
      if (!arguments.length) return timeInterval
      timeInterval = x == null ? Infinity : x
      return cloud
    }

    function place (board, tag, bounds) {
      // let perimeter = [{x: 0, y: 0}, {x: size[0], y: size[1]}]
      let startX = tag.x
      let startY = tag.y
      // let axDelta = Math.sqrt(size[0] * size[0] + size[1] * size[1])
      let s = spiral(size)
      let dt = Math.random() < 0.5 ? 1 : -1
      let t = -dt
      let dxdy
      let dx
      let dy

      // while (dxdy = s(t += dt)) {
      while (s(t += dt)) {
        dx = ~~dxdy[0]
        dy = ~~dxdy[1]

        // what is max delta?
        // if (Math.min(dx, dy) > maxDelta) break

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
            for (let j = 0; j < h; j++) {
              last = 0
              for (let i = 0; i <= w; i++) {
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

    cloud.words = function (x) {
      if (!arguments.length) return words
      words = x
      return cloud
    }

    cloud.size = function (x) {
      if (!arguments.length) return size
      size = [+x[0], +x[1]]
      return cloud
    }

    cloud.font = function (x) {
      if (!arguments.length) return font
      font = d3.functor(x)
      return cloud
    }

    cloud.rotate = function (x) {
      if (!arguments.length) return rotate
      rotate = d3.functor(x)
      return cloud
    }

    cloud.text = function (x) {
      if (!arguments.length) return text
      text = d3.functor(x)
      return cloud
    }

    cloud.spiral = function (x) {
      if (!arguments.length) return spiral
      spiral = spirals[x + ''] || x
      return cloud
    }

    cloud.fontSize = function (x) {
      if (!arguments.length) return fontSize
      fontSize = d3.functor(x)
      return cloud
    }

    cloud.padding = function (x) {
      if (!arguments.length) return padding
      padding = d3.functor(x)
      return cloud
    }

    return d3.rebind(cloud, event, 'on')
  }

  function cloudText (d) {
    return d.text
  }

  function cloudFont () {
    return 'serif'
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
  function cloudSprite (d, data, di) {
    if (d.sprite) return
    c.clearRect(0, 0, (cw << 5) / ratio, ch / ratio)
    let x = 0
    let y = 0
    let maxh = 0
    let n = data.length
    di--
    while (++di < n) {
      d = data[di]
      c.save()
      c.font = ~~((d.size + 1) / ratio) + 'px ' + d.font
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
      c.restore()
      d.width = w
      d.height = h
      d.xoff = x
      d.yoff = y
      d.x1 = w >> 1
      d.y1 = h >> 1
      d.x0 = -d.x1
      d.y0 = -d.y1
      x += w
    }
    let pixels = c.getImageData(0, 0, (cw << 5) / ratio, ch / ratio).data
    let sprite = []
    while (--di >= 0) {
      d = data[di]
      let w = d.width
      let w32 = w >> 5
      let h = d.y1 - d.y0
      let p = d.padding
      // Zero the buffer
      for (let i = 0; i < h * w32; i++) sprite[i] = 0
      x = d.xoff
      if (x == null) return
      y = d.yoff
      let seen = 0
      let seenRow = -1
      for (var j = 0; j < h; j++) {
        for (var i = 0; i < w; i++) {
          let k = w32 * j + (i >> 5)
          let m = pixels[((y + j) * (cw << 5) + (x + i)) << 2] ? 1 << (31 - (i % 32)) : 0
          if (p) {
            if (j) sprite[k - w32] |= m
            if (j < w - 1) sprite[k + w32] |= m
            m |= (m << 1) | (m >> 1)
          }
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
    for (var j = 0; j < h; j++) {
      last = 0
      for (var i = 0; i <= w; i++) {
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

  let cloudRadians = Math.PI / 180
  let cw = 1 << 11 >> 5
  let ch = 1 << 11
  let canvas
  let ratio = 1

  if (typeof document !== 'undefined') {
    canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    ratio = Math.sqrt(canvas.getContext('2d').getImageData(0, 0, 1, 1).data.length >> 2)
    canvas.width = (cw << 5) / ratio
    canvas.height = ch / ratio
  } else {
    // node-canvas support
    var Canvas = require('canvas')
    canvas = new Canvas(cw << 5, ch)
  }

  let c = canvas.getContext('2d')
  let spirals = {
    archimedean: archimedeanSpiral,
    rectangular: rectangularSpiral
  }
  c.fillStyle = 'red'
  c.textAlign = 'center'

  exports.cloud = cloud
})(typeof exports === 'undefined' ? d3.layout || (d3.layout = {}) : exports)
