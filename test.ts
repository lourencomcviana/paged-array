//var ProgressBar = require('progress');
//import { ProgressBar } from "progress";
import * as ProgressBar from "progress";

var bar = new ProgressBar(':bar', { total: 60 });
var timer = setInterval(function () {
 bar.tick();
 if (bar.complete) {
   console.log('\ncomplete\n');
   clearInterval(timer);
 }
}, 100);