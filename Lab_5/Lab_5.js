"use strict";
exports.__esModule = true;
var promptSync = require("prompt-sync");
var prompt = promptSync();
var isContinue = true;
var Node = /** @class */ (function () {
    function Node(value) {
        this.value = value;
        this.next = null;
    }
    return Node;
}());
var CirLinkedList = /** @class */ (function () {
    function CirLinkedList() {
        this.head = null;
        this.inputCount = 0;
    }
    ;
    CirLinkedList.prototype.add = function (value) {
        if (this.inputCount === 0) {
            var node = new Node(value);
            this.head = node;
        }
        else if (this.inputCount < 12) {
            var node = new Node(value);
            var current = this.head;
            while (current.next != null) {
                current = current.next;
            }
            current.next = node;
        }
        else {
            var length_1 = this.inputCount % 12 + 1;
            var current = this.head;
            for (var i = 0; i < length_1 - 1; i++) {
                current = current.next;
            }
            current.value = value;
        }
        this.inputCount++;
    };
    CirLinkedList.prototype.display = function () {
        if (this.inputCount === 0) {
            console.log('Emplety queue.\n');
        }
        else {
            var current = this.head;
            do {
                console.log(current.value);
                current = current.next;
            } while (current != null);
        }
    };
    return CirLinkedList;
}());
var cirQ = new CirLinkedList();
do {
    var input = prompt('Please input ("quit" to exit and display the queue): ');
    if (input == 'quit')
        break;
    cirQ.add(input);
} while (isContinue);
cirQ.display();
