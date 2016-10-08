var raf = require('raf')
var from = require('from2')
var writer = require('to2')

module.exports = function () {
  var uiStream = from.obj(function () {})

  raf(function tick() {
    raf(tick)
  })

  return {
    behavior: writer.obj(function (data, enc, callback) {
      callback()
    }),
    trial: writer.obj(function (data, enc, callback) {
      callback()
    }),
    ui: uiStream
  }
}
