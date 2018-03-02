'use strict';
exports.__esModule = true;
var Stack = /** @class */ (function () {
    function Stack() {
        this._arr = [];
    }
    Stack.prototype.push = function (value) {
        this._arr.push(value);
    };
    Stack.prototype.pop = function () {
        return this._arr.pop();
    };
    Stack.prototype.peek = function () {
        return this._arr[this._arr.length - 1];
    };
    Stack.prototype.isEmpty = function () {
        return this._arr.length === 0 ? true : false;
    };
    return Stack;
}());
var Queue = /** @class */ (function () {
    function Queue() {
        this._arr = [];
    }
    Queue.prototype.enQueue = function (value) {
        this._arr.push(value);
    };
    Queue.prototype.deQueue = function () {
        return this._arr.shift();
    };
    Queue.prototype.isEmpty = function () {
        return this._arr.length === 0 ? true : false;
    };
    Queue.prototype.join = function () {
        return this._arr.join(' ');
    };
    return Queue;
}());
function isNumber(input) {
    return !isNaN(Number(input));
}
function getPriority(input) {
    switch (input) {
        case '(': return 0;
        case '+': return 1;
        case '-': return 1;
        case '*': return 2;
        case '/': return 2;
        case '^': return 3;
        default: throw 'Incorrect operator';
    }
}
function postfixConverser(infix) {
    infix = infix.replace(/\s+/g, '').replace(/POW/g, '^').replace(/[)(/*\+-]/g, ' $& ').replace(/\s+/g, ' ').trim();
    var infix_arr = infix.split(' ');
    var infix_que = new Queue();
    var operator_stack = new Stack();
    var postfix_que = new Queue();
    while (infix_arr.length > 0) {
        infix_que.enQueue(infix_arr.shift());
    }
    console.log(infix_que);
    while (!infix_que.isEmpty()) {
        var i = infix_que.deQueue();
        console.log(i);
        if (isNumber(i)) {
            postfix_que.enQueue(i);
        }
        else if (operator_stack.isEmpty()) {
            operator_stack.push(i);
        }
        else if (i == '(') {
            operator_stack.push(i);
        }
        else if (i == ')') {
            while (operator_stack.peek() != '(') {
                postfix_que.enQueue(operator_stack.pop());
            }
            operator_stack.pop();
        }
        else if (getPriority(i) > getPriority(operator_stack.peek())) {
            operator_stack.push(i);
        }
        else if (getPriority(i) <= getPriority(operator_stack.peek())) {
            do {
                postfix_que.enQueue(operator_stack.pop());
            } while (getPriority(i) <= getPriority(operator_stack.peek()));
            operator_stack.push(i);
        }
    }
    while (!operator_stack.isEmpty()) {
        postfix_que.enQueue(operator_stack.pop());
    }
    return postfix_que;
}
var infix_exp = '8.9 -  ( 7*1239 /(8- 2)+3) ';
var postfix_que = postfixConverser(infix_exp);
var postfix_exp = postfix_que.join();
console.log(postfix_exp);
