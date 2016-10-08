var through = require('through2')
var from = require('from2')
var now = require('performance-now')
var writer = require('to2')


module.exports = function create () {
  var trialStream = from.obj(function () {})
  var results = {
    r: false,
    c: false,
    deltaTime: 0,
    time: 0,
    date: Date.now()
  }
  var startTime = null
  var curTime = 0
  var prevTime = 0

  return {
    behavior: through.obj(function (data, enc, callback) {
      if (startTime === null) {
          startTime = now()
        }

      curTime = now()
      results.r = data.r
      results.c = data.c
      results.date = Date.now()
      results.deltaTime = curTime - prevTime
      results.time = curTime - startTime
      prevTime = curTime

      callback(null, results)
    }),
    trial: trialStream,
    ui: writer.obj(function(data, enc, callback) {
      callback()
    }),
    next: function(maze) {
    },
    advance: function() {
    },
    start: function(maze) {
      startTime = null
    }
  }
}
