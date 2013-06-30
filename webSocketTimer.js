/**
 * The timer is intended for a multiplayer game where you want to limit how much time a person has to submit their command
*/

function WebSocketTimer(options){

  options = options || {}
  this.startTime= options.startTime || 0 
  this.frequency= 1000 //send the time every second
  this.increment = options.increment  || 1
  this.curTime = this.startTime 
  this.stopTime = options.stopTime || 0
  this.webSocket = null
  this.timerHandle = null
  this.endFunc = options.endFunc || null
  this.curPlayer = null
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
    this.webSocket.send(JSON.stringify({timer:this.curTime}))
  }
  if(this.curTime == this.stopTime){
    if(this.endFunc){
      this.endFunc()
    }
    this.stop()
  }
}

module.exports = WebSocketTimer
