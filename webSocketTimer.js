function WebSocketTimer(options){

  options = options || {}
  this.startTime= options.startTime || 0 
  this.frequency= 1000 //send the time every second
  this.increment = options.increment  || 1
  this.curTime = this.startTime 
  this.stopTime = options.stopTime || 0
  this.webSocket = null
  this.timerHandle = null
}

WebSocketTimer.prototype.addWebSocket = function(webSocket){
  this.webSocket = webSocket
}

WebSocketTimer.prototype.startTimer = function(){
  var that = this
  this.timerHandle = setInterval( function(){
    that.callback.call(that)
  } , this.frequency)

}

WebSocketTimer.prototype.callback = function(){
  this.curTime += this.increment
  console.log(this.curTime)
  if(this.curTime == this.stopTime){
    clearInterval(this.timerHandle)
  }
}

thing = new WebSocketTimer({stopTime:10})
thing.startTimer()
