var ipcRenderer = require('electron').ipcRenderer
var debounce = require('lodash.debounce')

var controlPanel = document.createElement('div')
controlPanel.width = 200
controlPanel.height = 800
controlPanel.style.float = 'left'
controlPanel.style.marginLeft = '5px'
document.body.appendChild(controlPanel)

var reset = document.createElement('BUTTON')
var resetText = document.createTextNode('reset')
reset.appendChild(resetText)
controlPanel.appendChild(reset)


var playState = true
var timeStart = Date.now()
var play = document.createElement('BUTTON')
var playT = document.createTextNode('play')
play.appendChild(playT)
controlPanel.appendChild(play)


controlPanel.appendChild(document.createTextNode('logging'))
var logging = document.createElement('INPUT')
logging.setAttribute('type', 'checkbox')
controlPanel.appendChild(logging)
logging.onclick = function () {
  ipcRenderer.send('logging', logging.checked)
}

controlPanel.appendChild(document.createTextNode('session'))
var number = document.createElement('INPUT')
number.setAttribute('type', 'number')
number.value = 0
controlPanel.appendChild(number)
ipcRenderer.send('number', number.value)
number.oninput = debounce(function () {
  ipcRenderer.send('number', number.value)
}, 700)
ipcRenderer.on('number', function (event, data) {
  number.value = data
})


var advance = document.createElement('BUTTON')
var advanceT = document.createTextNode('advance')
advance.appendChild(advanceT)
controlPanel.appendChild(advance)
function advanceFunc() {
  ipcRenderer.send('advance')
}
advance.onclick = advanceFunc
advance.disabled = true


var listOfAllTrials = []
var list = document.createElement('UL')
ipcRenderer.on('initList', function (event, data) {
  listOfAllTrials = data
  listOfAllTrials.forEach(function (el) {
    var trial = document.createElement('LI')
    trial.appendChild(document.createTextNode(el))
    list.appendChild(trial)
  })
  controlPanel.appendChild(list)
})

var curTrial = 0

var trialOrder = []
var order = document.createElement('OL')
order.start = 0
ipcRenderer.on('initOrder', function (event, data) {
  trialOrder = data
  trialOrder.forEach(function (el) {
    var trial = document.createElement('LI')
    trial.appendChild(document.createTextNode(listOfAllTrials[el]))
    order.appendChild(trial)
  })
  controlPanel.appendChild(order)
  ipcRenderer.send('initTrial', order.childNodes[curTrial].innerHTML)
  ipcRenderer.send('nextTrial', order.childNodes[curTrial+1].innerHTML)
})

var toAdd = 1

function nextTrial () {
  order.childNodes[curTrial].style.color = 'gray'
  curTrial++
  ipcRenderer.send('nextTrial', order.childNodes[curTrial+1].innerHTML)
  order.childNodes[curTrial].style.color = 'red'
  trial = document.createElement('LI')
  trial.appendChild(document.createTextNode(listOfAllTrials[toAdd]))
  toAdd++
  toAdd = toAdd%2
  order.appendChild(trial)
}
ipcRenderer.on('nextTrial', nextTrial)

play.onclick = function () {
  if (playState) {
    play.innerHTML = 'pause'
    ipcRenderer.send('play')
    reset.disabled = true
    advance.disabled = false
    logging.disabled = true
    number.disabled = true
    order.childNodes[curTrial].style.color = 'red'
  } else {
    play.innerHTML = 'play'
    ipcRenderer.send('pause')
    reset.disabled = false
    logging.disabled = false
    advance.disabled = true
    number.disabled = false
    order.childNodes[curTrial].style.color = 'black'
  }
  playState = !playState
}

reset.onclick = function () {
  ipcRenderer.send('reset')
  order.childNodes.forEach(function (el) {
    el.style.color = 'black'
  })
  curTrial = 0
  //list.childNodes[curTrial].style.color = 'black'
  ipcRenderer.send('initTrial', order.childNodes[curTrial].innerHTML)
  ipcRenderer.send('nextTrial', order.childNodes[curTrial+1].innerHTML)
  if (logging.checked) {
    number.value++
    ipcRenderer.send('number', number.value)
  }
  ipcRenderer.send('logging', logging.checked)
}


//////////////////////////////////////////////////////////////////////////////

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
