var from = require('from2')
var writer = require('to2')
var duplexify = require('duplexify')
var NanoTimer = require('nanotimer')
var cTTY = require('crtrdg-tty')

module.exports = function () {
  var timer = new NanoTimer()
  var readableStream = from.obj(function () {})
  var tty = cTTY()
  var started = false
  var results = {
    r: false,
    c: false
  }

  return {
    create: function () {
      var writableStream = writer.obj(function(data, enc, callback) {
        //console.log(data)
        callback()
      })
      return duplexify.obj(writableStream, readableStream)
    },
    start: function () {
      if (!started) {
        timer.setInterval(function () {
          if (tty.keysDown['R']) results.r = true
          else results.r = false
          if (tty.keysDown['C']) results.c = true
          else results.c = false
          readableStream.push(results)
        }, '', '1m')
        started = true
      }
    },
    stop: function () {
      timer.clearInterval()
      started = false
    }
  }
}
