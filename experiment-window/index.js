var viz = require('../../tinberg-exp-mvr/visualization/index.js')()
var IPCStream = require('electron-ipc-stream')
var ipcsD = new IPCStream('behavior')
var ipcsT = new IPCStream('trial')
var ipcRenderer = require('electron').ipcRenderer

var stream = null
var waiting = true
ipcsT.on('data', function (data) {
  if (waiting) {
    stream = viz.createStream(data.maze)
    ipcsD.pipe(stream)
    waiting = false
  } else {
    viz.updateTrial(data.maze)
  }
})
