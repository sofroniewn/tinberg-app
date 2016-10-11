var experiment = require('.')
var trials = experiment.trials()
var encoders = experiment.encoders()
var streams = experiment.core()

var device = require('../device')()
var deviceStream = device.create()

var behaviorStream = deviceStream.pipe(streams.behavior)
behaviorStream.pipe(deviceStream)

var logging = require('time-stream')
var mkdirp = require('mkdirp')
var savePath = './logs'
mkdirp(savePath)
loggingDataStream = logging.createWriteStream(savePath + '/behavior.data', encoders.behavior.Data)
streams.behavior.pipe(loggingDataStream)

streams.start()
device.start()
