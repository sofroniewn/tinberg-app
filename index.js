var electron = require('electron')
var ipcMain = require('electron').ipcMain
var ipcStream = require('electron-ipc-stream')
var program = require('commander')
var glob = require('glob')
var path = require('path')
var leftPad = require('left-pad')
var mkdirp = require('mkdirp')
var jsonfile = require('jsonfile')

program
  .option('-e, --experiment [name]', 'Name of experiment', './experiment')
  .option('-d, --device [name]', 'Name of device', './device')
  .option('-l, --logging [name]', 'Name of logging', './logs')
  .parse(process.argv)

console.log('Launching app with:')
console.log('  -e', program.experiment)
console.log('  -d', program.device)
console.log('  -l', program.logging)

var app = electron.app
var BrowserWindow = electron.BrowserWindow

var mainWindow = null
function createWindow() {
  mainWindow = new BrowserWindow({
    resizable: false,
    width: 1440,
    height: 822,
    x: 0,
    y: 0,
    title: path.basename(program.experiment)
  })
  mainWindow.loadURL(`file://${__dirname}/renderer/index.html`)

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}


var experiment = require(program.experiment)
var trials = experiment.trials()
var encoders = experiment.encoders()
var streams = experiment.core()
var device = require(program.device)()
var deviceStream = device.create()
  
var behaviorStream = deviceStream.pipe(streams.behavior)
behaviorStream.pipe(deviceStream)

var logging = require('time-stream')

app.on('ready', function() {
  createWindow()

  var ipcsTrials = new ipcStream('trial', mainWindow)
  var ipcsBehavior = new ipcStream('behavior', mainWindow)
  var ipcsUI = new ipcStream('ui', mainWindow)

  behaviorStream.pipe(ipcsBehavior)
  streams.trial.pipe(ipcsTrials)
  ipcsUI.pipe(streams.ui)

  mainWindow.webContents.on('did-finish-load', function () {
    mainWindow.webContents.send('initList', Object.keys(trials))
    mainWindow.webContents.send('initOrder', [0, 1, 0])
  })

  var resetFlag = true
  ipcMain.on('reset', function () {
    console.log('reset')
    resetFlag = true
  })

  var initKey = null
  ipcMain.on('initTrial', function (event, key) {
    console.log(key)
    initKey = key
  })

  ipcMain.on('play', function () {
    console.log('play')
    if (resetFlag) {
      streams.start(trials[initKey])
      streams.next(trials[nextKey])
    }
    device.start()
  })

  ipcMain.on('pause', function () {
    console.log('pause')
    resetFlag = false 
    device.stop()
  })

  ipcMain.on('advance', function () {
    console.log('advance')
    streams.advance()
  })

  var nextKey = null
  ipcMain.on('nextTrial', function (event, key) {
    nextKey = key
    streams.next(trials[key])
  })

  var loggingFlag = false
  var sessionNumber = 0  
  var loggingDataStream = null
  var loggingTrialStream = null
  ipcMain.on('logging', function (event, data) {
    console.log('logging', data)
    loggingFlag = data
    if (loggingFlag & resetFlag) {
      console.log('start logs', sessionNumber)
      var savePath = program.logging + '/' + leftPad(sessionNumber, 6, 0) + '/behavior'
      mkdirp(savePath)
      if (loggingDataStream !== null) streams.behavior.unpipe(loggingDataStream)
      loggingDataStream = logging.createWriteStream(savePath + '/behavior.data', encoders.behavior.Data)
      streams.behavior.pipe(loggingDataStream)
      if (loggingTrialStream !== null) streams.trial.unpipe(loggingTrialStream)
      loggingTrialStream = logging.createWriteStream(savePath + '/trial.data', encoders.trial.Data)
      streams.trial.pipe(loggingTrialStream)
    }
  })

  ipcMain.on('number', function (event, data) {
    console.log('number', data)
    sessionNumber = Number(data)
    glob(program.logging + '/*', [], function (er, files) {
      var used = []
      files.forEach(function (el) {
        used.push(Number(path.basename(el)))
      })
      if (sessionNumber < 0) sessionNumber = 0
      if (used.indexOf(sessionNumber) !== -1) {
        sessionNumber = used[used.length-1]+1
      }
      mainWindow.webContents.send('number', sessionNumber)
    })
  })

  streams.trial.on('data', function (data) {
    if (!data.init) mainWindow.webContents.send('nextTrial', data.trial.key)
  })

  mainWindow.on('close', function () {
    behaviorStream.pause()
    streams.trial.pause()
  })
})

process.stdin.on('data', function(data) {
  if (data.toString().trim() === 'q') app.quit()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})