'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var promptSync = require("prompt-sync");
var prompt = promptSync();
var isContinue = true;
//define the stack class and methods
var Stack = /** @class */ (function () {
    function Stack(arr) {
        this.arr = arr || [];
    }
    Stack.prototype.push = function (value) {
        this.arr.push(value);
    };
    Stack.prototype.pop = function () {
        return this.arr.pop();
    };
    Stack.prototype.peek = function () {
        return this.arr[this.arr.length - 1];
    };
    Object.defineProperty(Stack.prototype, "length", {
        get: function () { return this.arr.length; },
        enumerable: true,
        configurable: true
    });
    Stack.prototype.clear = function () { this.arr = []; };
    return Stack;
}());
/*
function checkExp(infixExp: string):string {
    return infixExp;
}
*/
//funciton that convert the infix expression to postfix expression
function convertToPostfixExp(infixExp) {
    infixExp += '#';
    var postfixExp = new Stack();
    var rvPostfixExp = new Stack();
    var tempOperaters = new Stack(['(']);
    var temp = null;
    for (var i = 0; i < infixExp.length; i++) {
        if (!isNaN(parseInt(infixExp[i]))) {
            temp = temp * 10 + parseInt(infixExp[i]);
        }
        else if (infixExp[i] == '(') {
            tempOperaters.push(infixExp[i]);
        }
        else if (infixExp[i] == ')') {
            if (temp != null) {
                postfixExp.push(temp.toString());
                temp = null;
            }
            while (tempOperaters.peek() != '(') {
                postfixExp.push(tempOperaters.pop());
            }
            tempOperaters.pop();
        }
        else if (getPriority(infixExp[i]) > getPriority(tempOperaters.peek())) {
            if (temp != null) {
                postfixExp.push(temp.toString());
                temp = null;
            }
            tempOperaters.push(infixExp[i]);
        }
        else if (getPriority(infixExp[i]) <= getPriority(tempOperaters.peek())) {
            if (temp != null) {
                postfixExp.push(temp.toString());
                temp = null;
            }
            while (getPriority(infixExp[i]) <= getPriority(tempOperaters.peek())) {
                postfixExp.push(tempOperaters.pop());
            }
            tempOperaters.push(infixExp[i]);
        }
        else if (infixExp[i] == '#') {
            if (temp != null) {
                postfixExp.push(temp.toString());
                temp = null;
            }
            while (tempOperaters.length != 1) {
                postfixExp.push(tempOperaters.pop());
            }
        }
    }
    while (postfixExp.length != 0) {
        rvPostfixExp.push(postfixExp.pop());
    }
    return rvPostfixExp;
}
//get the priortity of the operaters
function getPriority(char) {
    switch (char) {
        case '^': return 3;
        case '*': return 2;
        case '/': return 2;
        case '+': return 1;
        case '-': return 1;
        case '(': return 0;
    }
}
//caculate and display the postfix expression in the same time
function caculatePostfixExp(postfixExp) {
    var length = postfixExp.length;
    var caculStack = new Stack();
    var operand_1, operand_2, answer;
    var operater;
    var exp = '';
    while (postfixExp.length != 0) {
        if (!isNaN(parseInt(postfixExp.peek()))) {
            exp += postfixExp.peek();
            exp += ' ';
            caculStack.push(postfixExp.pop());
        }
        else {
            operand_1 = parseInt(String(caculStack.pop()));
            operand_2 = parseInt(String(caculStack.pop()));
            if (postfixExp.peek() == '^') {
                exp += 'POW';
                exp += ' ';
            }
            else {
                exp += postfixExp.peek();
                exp += ' ';
            }
            operater = postfixExp.pop();
            switch (operater) {
                case '+':
                    answer = operand_2 + operand_1;
                    break;
                case '-':
                    answer = operand_2 - operand_1;
                    break;
                case '*':
                    answer = operand_2 * operand_1;
                    break;
                case '/':
                    answer = operand_2 / operand_1;
                    break;
                case '^':
                    answer = Math.pow(operand_2, operand_1);
                    break;
            }
            caculStack.push(answer);
        }
    }
    answer = caculStack.pop();
    console.log('The postfix expression is : ', exp);
    console.log('The answer of this expression is : ', answer);
    return answer;
}
//main funciton that control the programme flow
do {
    var infixExp = prompt('Please input the infix expression ("quit" to quit this programe): ');
    infixExp = infixExp.replace(/\s+/g, '');
    infixExp = infixExp.replace(/POW/g, '^');
    if (infixExp == 'quit') {
        break;
    }
    /*
    try {
        checkExp(infixExp);
    } catch (err) {
        console.log(err);
        continue;
    }
    */
    var postfixExp = convertToPostfixExp(infixExp);
    var answer = caculatePostfixExp(postfixExp);
} while (isContinue);
