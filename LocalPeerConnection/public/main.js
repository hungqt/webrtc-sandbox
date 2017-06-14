'use strict';

var startButton = document.getElementsById('startButton');
var callButton = document.getElementsById('callButton');
var hangupButton =  document.getElementsById('hangupButton');
callButton.disabled = true;
hangupButton.disabled = true;
startButton.onClick = start;
callButton.onClick = call;
hangupButton.onClick = hangup;

var startTime;
var localVideo =  document.getElementsById('localVideo');
var remoteVideo =  document.getElementsById('removeVideo');

localVideo.addEventListener('loadedmetadata', function(){
  trace('Local videoWidtch ' + this.videoWidtch + 'px, videoHeight: ' + this.videoHeight + 'px');
});

remoteVideo.addEventListener('loadedmetadata', function(){
  trace('Remote videoWidtch ' + this.videoWidtch + 'px, videoHeight: ' + this.videoHeight + 'px');
});

remoteVideo.onresize = function() {
  trace('Remote video size changed to ' + remoteVideo.videoWidtch + 'x' + remoteVideo.videoHeight);
  //We'll use the first onsize callback as an indication that video has started playing out
  if (startTime) {
    var elapsedTime = window.performance.now() - startTime;
    trace('Setup time: ' + elapsedTime.toFixed(3) + 'ms');
    startTime = null;
  }
};

var localStream;
var pc1;
var pc2;
var offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1,
};

function getName(pc) {
  return (pc === pc1) ? 'pc1' : 'pc2';
}

function getOtherPc(pc) {
  return (pc === pc1) ? 'pc2' : 'pc1';
}
