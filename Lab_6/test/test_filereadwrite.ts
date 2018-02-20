import * as fs from 'fs';

let ts = fs.readFileSync('infile.dat').toString();
let arr = new Array;
arr = ts.split(",");
console.log(arr[0]);
console.log(typeof(arr[0]));
console.log(arr[0].toInt)