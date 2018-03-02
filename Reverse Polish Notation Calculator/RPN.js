'use strict';
exports.__esModule = true;
var prompt_sync = require("prompt-sync");
var prompt = prompt_sync();
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
function caculator(operand_1, operand_2, operator) {
    switch (operator) {
        case '+': return Number(operand_2) + Number(operand_1);
        case '-': return Number(operand_2) - Number(operand_1);
        case '*': return Number(operand_2) * Number(operand_1);
        case '/': return Number(operand_2) / Number(operand_1);
        case '^': return Math.pow(Number(operand_2), Number(operand_1));
        default: throw 'caculator err';
    }
}
function postfixConverser(infix) {
    infix = infix.replace(/\s+/g, '').replace(/POW/g, '^').replace(/[)(/*\+-^]/g, ' $& ').replace(/\s+/g, ' ').trim();
    var infix_arr = infix.split(' ');
    var infix_que = new Queue();
    var operator_stack = new Stack();
    var postfix_que = new Queue();
    while (infix_arr.length > 0) {
        infix_que.enQueue(infix_arr.shift());
    }
    while (!infix_que.isEmpty()) {
        var i = infix_que.deQueue();
        if (isNumber(i)) {
            postfix_que.enQueue(i);
        }
        else if (operator_stack.isEmpty() || operator_stack.peek() == '(' || i == '(') {
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
function postfixCaculator(postfix_que) {
    var temp_stack = new Stack();
    while (!postfix_que.isEmpty()) {
        var i = postfix_que.deQueue();
        if (isNumber(i)) {
            temp_stack.push(i);
        }
        else {
            var operand_1 = temp_stack.pop();
            var operand_2 = temp_stack.pop();
            var temp_result = caculator(operand_1, operand_2, i);
            temp_stack.push(temp_result);
        }
    }
    return Number(temp_stack.pop());
}
function main() {
    while (true) {
        try {
            var input = prompt('Please input the infix expression (input \'quit\') to terminated: ');
            if (input == 'quit' || input == 'Quit') {
                break;
            }
            var postfix_que = postfixConverser(input);
            var postfix_exp = postfix_que.join();
            var result = postfixCaculator(postfix_que);
            console.log('The postfix expression of your input is: ' + postfix_exp);
            console.log('The answer of this postfix expression is: ' + result);
        }
        catch (err) {
            console.log('Please input legal expression');
        }
    }
}
main();
