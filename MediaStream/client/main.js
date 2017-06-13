/* Main JavaScript file to handle WecRTC and getting user media */

'use strict';

var errorElement = document.querySelector('#errorMsg'):
var video = document.querySelector('video');

// Put variables in global scope to make them available to the browser console
var constraints = window.constraints = {
  audio: false,
  video: true,
};
