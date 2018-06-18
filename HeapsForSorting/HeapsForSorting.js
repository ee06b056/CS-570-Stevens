var fs = require('fs');
var promptSync = require('prompt-sync')();
var MaxHeap = /** @class */ (function () {
    function MaxHeap() {
        this.arr = new Array();
    }
    MaxHeap.prototype.testOutput = function () {
        while (this.arr.length > 0) {
            console.log(this.arr);
            console.log(this.pop());
        }
    };
    MaxHeap.prototype.push = function (num) {
        this.arr.push(num);
        var index = this.arr.length - 1, parIndex = Math.floor((index - 1) / 2);
        while (parIndex >= 0) {
            if (this.arr[index] > this.arr[parIndex]) {
                this.swap(index, parIndex);
                index = parIndex, parIndex = Math.floor((index - 1) / 2);
            }
            else {
                break;
            }
        }
        console.log(this.arr);
    };
    MaxHeap.prototype.pop = function () {
        this.swap(0, this.arr.length - 1);
        var output = this.arr.pop();
        this.maximaze(0);
        return output;
    };
    MaxHeap.prototype.swap = function (index_1, index_2) {
        if (index_1 >= this.arr.length || index_2 >= this.arr.length)
            return;
        var temp = this.arr[index_1];
        this.arr[index_1] = this.arr[index_2];
        this.arr[index_2] = temp;
    };
    MaxHeap.prototype.maximaze = function (index) {
        var left_child = index * 2 + 1, right_child = index * 2 + 2, maxIndex = index;
        while (left_child < this.arr.length) {
            if (this.arr[left_child] > this.arr[maxIndex])
                maxIndex = left_child;
            if (this.arr[right_child] > this.arr[maxIndex])
                maxIndex = right_child;
            if (maxIndex != index) {
                this.swap(maxIndex, index);
                index = maxIndex;
                left_child = index * 2 + 1, right_child = index * 2 + 2;
            }
            else {
                break;
            }
        }
    };
    return MaxHeap;
}());
function main() {
    var maxHeap = new MaxHeap();
    for (var i = 0; i < 5; i++) {
        var input = parseInt(promptSync('please input one number'));
        maxHeap.push(input);
    }
    maxHeap.testOutput();
}
main();
