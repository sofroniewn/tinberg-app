var IPCStream = require('electron-ipc-stream')
var ipcsD = new IPCStream('behavior')
var ipcsT = new IPCStream('trial')
var ipcRenderer = require('electron').ipcRenderer
var program = require('commander')
var process = require('electron').remote.process

program
  .option('-e, --experiment [name]', 'Name of experiment', './experiment')
  .option('-d, --device [name]', 'Name of device', './device')
  .option('-l, --logging [name]', 'Name of logging', './logs')
  .parse(process.argv)

console.log('Launching app with:')
console.log('  -e', program.experiment)
console.log('  -d', program.device)
console.log('  -l', program.logging)



var controlPanel = require('./controlPanel.js')()
var experiment = require('../' + program.experiment)
var viz = experiment.visualization()

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
