const os = require('os');
const os_utils = require('os-utils');
const systemInformation = require('systeminformation');

let chart = null;
var lastMeasureTimes = [];
let model = null;
let precentageMem = null;

module.exports = {
  chart, lastMeasureTimes, model, precentageMem, os, os_utils,systemInformation
}; 