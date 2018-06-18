"use strict";
exports.__esModule = true;
var promptSync = require("prompt-sync");
var prompt = promptSync(null);
var MaxHeap = /** @class */ (function () {
    function MaxHeap() {
        this.array = new Array;
    }
    MaxHeap.prototype.swap = function (i, j) {
        var temp = this.array[i];
        this.array[i] = this.array[j];
        this.array[j] = temp;
    };
    MaxHeap.prototype.maxHeaplize = function (index) {
        if (index > Math.floor((this.array.length - 2) / 2))
            return;
        var leftChild = 2 * index + 1;
        var rigthChild = leftChild + 1;
        var maxIndex = index;
        if (leftChild < this.array.length && this.array[leftChild] > this.array[maxIndex])
            maxIndex = leftChild;
        if (rigthChild < this.array.length && this.array[rigthChild] > this.array[maxIndex])
            maxIndex = rigthChild;
        this.swap(index, maxIndex);
        this.maxHeaplize(leftChild);
        this.maxHeaplize(rigthChild);
    };
    MaxHeap.prototype.createMaxHeap = function () {
        var lastIndex = Math.floor((this.array.length - 2) / 2);
        for (var i = lastIndex; i >= 0; i--) {
            this.maxHeaplize(i);
        }
    };
    MaxHeap.prototype.push = function (num) {
        this.array.push(num);
        var index = this.array.length - 1;
        var parIndex = Math.floor((index - 1) / 2);
        while (parIndex >= 0) {
            if (this.array[parIndex] < this.array[index]) {
                this.swap(index, parIndex);
                index = parIndex;
                parIndex = Math.floor((index - 1) / 2);
            }
            else {
                break;
            }
        }
    };
    MaxHeap.prototype.pop = function () {
        this.swap(0, this.array.length - 1);
        var temp = this.array.pop();
        this.createMaxHeap();
        return temp;
    };
    MaxHeap.prototype.output = function () {
        while (this.array.length) {
            console.log(this.pop());
        }
    };
    return MaxHeap;
}());
var maxHeap = new MaxHeap();
var count = 10;
while (count) {
    var inputS = prompt('Please input a number ' + (11 - count) + ' of 10: ');
    var input = parseInt(inputS);
    if (!isNaN(input)) {
        maxHeap.push(input);
        count--;
    }
    else {
        console.log('Input need to be a number!');
        continue;
    }
}
console.log('The decending order of the input is: ');
maxHeap.output();
