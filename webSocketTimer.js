var util = require('util')

/**
 * The timer is intended for a multiplayer game where you want to limit how much time a person has to submit their command
*/


function WebSocketTimer(options){
  options = options || {}
  
  var defaults={
    startTime:0,
    stopTime:0,
    increment:1,
    endFunc:null
  }
  
  util._extend(defaults, options)
  util._extend(this, defaults)
  
  //extends the defaults
  this.curTime = this.startTime 
  this.frequency= 1000 //send the time every second
  this.webSocket = null
  this.timerHandle = null
  
  this.curPlayer = null
}

//allow to change the settings midway through 
WebSocketTimer.prototype.changeSettings(options){
  util._extend(this, options)
}

WebSocketTimer.prototype.addWebSocket = function(webSocket){
  this.webSocket = webSocket
  var that = this
  webSocket.on('close', function(){
    console.log('stopping the timer')
    that.stop()
  })
}

WebSocketTimer.prototype.reset = function(webSocket, currentPlayer){
  this.curTime = this.startTime
  this.curPlayer = currentPlayer
  this.addWebSocket(webSocket)
}

WebSocketTimer.prototype.start = function(){
  
  var that = this
  this.timerHandle = setInterval( function(){
    that.callback.call(that)
  } , this.frequency)

}

WebSocketTimer.prototype.stop = function(){
  clearInterval(this.timerHandle)
}

WebSocketTimer.prototype.callback = function(){
  this.curTime += this.increment
  console.log(this.curTime)
  
  if(this.webSocket){
    //allow to send to  a group of websockets too
    if(Object.prototype.toString.call( this.webSocket ) === '[object Array]'){
      for(var i=0; i<this.webSocket.length; i++){
        this.webSocket[i].send(JSON.stringify({timer:this.curTime}))
      }
    }else{
      this.webSocket.send(JSON.stringify({timer:this.curTime}))
    }
  }
  if(this.curTime == this.stopTime){
    if(this.endFunc){
      this.endFunc()
    }
    this.stop()
  }
}

WebSocketTimer

module.exports = WebSocketTimer
