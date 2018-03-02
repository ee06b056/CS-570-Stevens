'use strict';

import * as prompt_sync from 'prompt-sync';
const prompt = prompt_sync();

class Stack {
    constructor () {
        this._arr = [];
    }
    private _arr: any[];
    public push (value: any): void {
        this._arr.push(value);
    }
    public pop(): any {
        return this._arr.pop();
    }
    public peek(): any {
        return this._arr[this._arr.length-1];
    }
    public isEmpty (): boolean {
        return this._arr.length === 0 ? true : false;
    }
}

class Queue {
    constructor () {
        this._arr = [];
    }
    private _arr: any[];
    public enQueue (value: any): void {
        this._arr.push(value);
    }
    public deQueue (): any {
        return this._arr.shift();
    }
    public isEmpty (): boolean {
        return this._arr.length === 0 ? true : false;
    }
    public join (): string {
        return this._arr.join(' ');
    }
}

function isNumber (input: string): boolean {
    return !isNaN(Number(input));
}

function getPriority (input: string): number {
    switch (input) {
        case undefined: return -1;
        case '(': return 0;
        case '+': return 1;
        case '-': return 1;
        case '*': return 2;
        case '/': return 2;
        case '%': return 2;
        case '^': return 3;
        default: throw 'Incorrect operator';
    }
}

function caculator (operand_1: any, operand_2: any, operator: string) {
    switch (operator) {
        case '+': return Number(operand_2) + Number(operand_1);
        case '-': return Number(operand_2) - Number(operand_1);
        case '*': return Number(operand_2) * Number(operand_1);
        case '/': return Number(operand_2) / Number(operand_1);
        case '%': return Number(operand_2) % Number(operand_1);
        case '^': return Math.pow(Number(operand_2), Number(operand_1));
        default : throw 'caculator err';
    }
}

function postfixConverser (infix: string): Queue {
    infix = infix.replace(/\s+/g, '').replace(/POW/g, '^').replace(/[)^%(/*\+-]/g, ' $& ').replace(/\s+/g, ' ').trim();
    let infix_arr = infix.split(' ');
    let infix_que = new Queue();
    let operator_stack = new Stack();
    let postfix_que = new Queue();
    while (infix_arr.length > 0) {
        infix_que.enQueue(infix_arr.shift());
    }

    while (!infix_que.isEmpty()) {
        let i = infix_que.deQueue();
        if (isNumber(i)) {
            postfix_que.enQueue(i);
        } else if (operator_stack.isEmpty() || operator_stack.peek() == '(' || i == '(') {
            operator_stack.push(i);
        } else if (i == ')') {
            while (operator_stack.peek() != '(') {
                postfix_que.enQueue(operator_stack.pop());
            }
            operator_stack.pop();
        } else if (getPriority(i) > getPriority(operator_stack.peek())) {
            operator_stack.push(i);
        } else if (getPriority(i) <= getPriority(operator_stack.peek())) {
            do {
                postfix_que.enQueue(operator_stack.pop());
            } while (getPriority(i) <= getPriority(operator_stack.peek()));
            operator_stack.push(i);
        }
    }

    while(!operator_stack.isEmpty()){
        postfix_que.enQueue(operator_stack.pop());
    }
    return postfix_que;
}

function postfixCaculator (postfix_que: Queue) {
    let temp_stack = new Stack();

    while (!postfix_que.isEmpty()) {
        let i = postfix_que.deQueue();
        if (isNumber(i)) {
            temp_stack.push(i);
        } else {
            let operand_1 = temp_stack.pop();
            let operand_2 = temp_stack.pop();
            let temp_result = caculator(operand_1,operand_2,i);
            temp_stack.push(temp_result);
        }
    }
    let result = Number(temp_stack.pop());
    console.log('result: '+ result);
    if (isNaN(result) || !isFinite(result)) {
        throw 'NaN or divided by 0 exceptions';
    }
    return result;
}

function main () {
    while (true) {
        try {
            let input = prompt('Please input the infix expression (input \'quit\') to terminated: ');
            if (input == 'quit' || input == 'Quit') {
                break;
            }
            let postfix_que = postfixConverser(input);
            let postfix_exp = postfix_que.join();
            let result = postfixCaculator(postfix_que);
            console.log('The postfix expression of your input is: ' + postfix_exp);
            console.log('The answer of this postfix expression is: ' + result);
        } catch (err) {
            console.log('Please input legal expression: ' + err);
        }
    }
}

main();