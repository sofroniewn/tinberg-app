var ipcRenderer = require('electron').ipcRenderer
var debounce = require('lodash.debounce')
var css = require('dom-css')


module.exports = function () {
  var controlPanel = document.createElement('div')
  css(controlPanel, {
    float: 'left',
    width: '210px',
    height: '800px',
    margin: '0px',
    border: '0px',
    padding: '20px',
    backgroundColor: '#F0F8FF'
  })
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


  var advance = document.createElement('BUTTON')
  var advanceT = document.createTextNode('advance')
  advance.appendChild(advanceT)
  controlPanel.appendChild(advance)
  function advanceFunc() {
    ipcRenderer.send('advance')
  }
  advance.onclick = advanceFunc
  advance.disabled = true



  var br = document.createElement('br')
  controlPanel.appendChild(br)



  controlPanel.appendChild(document.createTextNode('logging'))
  var logging = document.createElement('INPUT')
  logging.setAttribute('type', 'checkbox')
  controlPanel.appendChild(logging)
  logging.onclick = function () {
    ipcRenderer.send('logging', logging.checked)
  }

  var br2 = document.createElement('br')
  controlPanel.appendChild(br2)

  controlPanel.appendChild(document.createTextNode('random'))
  var random = document.createElement('INPUT')
  random.setAttribute('type', 'checkbox')
  controlPanel.appendChild(random)

  var br3 = document.createElement('br')
  controlPanel.appendChild(br3)

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
  var keyV = 0
  var repV = -1

  function newTrialName () {
    if (!random.checked) {
      repV++
      if (repV >= parseInt(listSelected.childNodes[keyV].getElementsByTagName('INPUT')[0].value, 10)) {
        keyV++
        repV = 0
      }
      if (keyV >= listSelected.childNodes.length) {
        keyV = 0
      }
      return listSelected.childNodes[keyV].textContent
    } else {
      console.log('hllooee')
      var partitions = listArray.childNodes.map(function (el) {
        return 10
        //return parseInt(el.getElementsByTagName('INPUT')[0].value, 10)
      })
      console.log(partitions)
      // var cumsum = [];
      // partitions.reduce(function(a,b,i) {
      //   return cumsum[i] = a+b
      // }, 0)
      // var ind = Math.round(Math.random()*cumsum[cumsum.length-1])
      // var keyVR = cumsum.findIndex(function (el) {
      //   return (el - ind) >= 0
      // })
      return listSelected.childNodes[0].textContent
    }
  }

  function addTrial () {
    var trial = document.createElement('LI')
    trial.appendChild(document.createTextNode(newTrialName()))
    order.appendChild(trial)
  }

  var listOfSelectedTrials = []
  var listSelected = document.createElement('UL')
  
  ipcRenderer.on('initList', function (event, data) {
    listOfSelectedTrials = data
    listOfSelectedTrials.forEach(function (el) {
      var trial = document.createElement('LI')
      trial.appendChild(document.createTextNode(el))
      var numberR = document.createElement('INPUT')
      numberR.setAttribute('type', 'number')
      numberR.setAttribute('min', 0)
      numberR.value = 3
      css(numberR, {
        width: '30px',
        // margin: '0px',
        // border: '0px',
        // padding: '0px',
        backgroundColor: '#F0F8FF'
      })
      trial.appendChild(numberR)
      listSelected.appendChild(trial)
    })
    controlPanel.appendChild(listSelected)
    keyV = 0
    repV = 0
    addTrial()
    addTrial()
    addTrial()
    controlPanel.appendChild(order)
    ipcRenderer.send('initTrial', order.childNodes[curTrial].innerHTML)
    ipcRenderer.send('nextTrial', order.childNodes[curTrial+1].innerHTML)
  })

  function nextTrial () {
    order.childNodes[curTrial].style.color = 'gray'
    curTrial++
    ipcRenderer.send('nextTrial', order.childNodes[curTrial+1].innerHTML)
    order.childNodes[curTrial].style.color = 'red'
    addTrial()
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
    // order.childNodes.forEach(function (el) {
    //   el.style.color = 'black'
    // })
    while (order.firstChild) {
      order.removeChild(order.firstChild)
    }
    keyV = 0
    repV = -1
    addTrial()
    addTrial()
    addTrial()
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
}
