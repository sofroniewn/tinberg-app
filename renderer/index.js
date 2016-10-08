var IPCStream = require('electron-ipc-stream')
var ipcsBehavior = new IPCStream('behavior')
var ipcsTrial = new IPCStream('trial')
var ipcsUI = new IPCStream('ui')
var program = require('commander')
var process = require('electron').remote.process

program
  .option('-e, --experiment [name]', 'Name of experiment', './experiment')
  .option('-d, --device [name]', 'Name of device', './device')
  .option('-l, --logging [name]', 'Name of logging', './logs')
  .parse(process.argv)

var controlPanel = require('./controlPanel.js')()
var experiment = require('../' + program.experiment)
var streams = experiment.visualization()

ipcsBehavior.pipe(streams.behavior)
ipcsTrial.pipe(streams.trial)
streams.ui.pipe(ipcsUI)
