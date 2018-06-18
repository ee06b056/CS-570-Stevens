"use strict";
exports.__esModule = true;
var fs = require("fs");
var ts = fs.readFileSync('infile.dat').toString();
var arr = new Array;
arr = ts.split(",");
console.log(arr[0]);
console.log(typeof (arr[0]));
