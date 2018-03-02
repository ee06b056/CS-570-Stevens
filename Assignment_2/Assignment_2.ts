'use strict'
import * as promptSync from 'prompt-sync';
let prompt = promptSync({});

let isContinue = true;

//define the stack class and methods
class Stack<T> {
	private arr: T[];

	constructor (arr?: T[]) {
		this.arr = arr || [];
	}

	public push (value: T) {
		this.arr.push(value);
	} 

	public pop (): T{
		return this.arr.pop();
	}

	public peek(): T {
		return this.arr[this.arr.length-1];
	}

	public get length () { return this.arr.length;}

	public clear() {this.arr = [];}

}

/*
function checkExp(infixExp: string):string {
	return infixExp;
}
*/
//funciton that convert the infix expression to postfix expression
function convertToPostfixExp (infixExp: string) {
	infixExp += '#';
	let postfixExp = new Stack();
	let rvPostfixExp = new Stack();
	let tempOperaters = new Stack(['('],);
	let temp = null;
	for (let i = 0; i < infixExp.length; i++) {
		if (!isNaN(parseInt(infixExp[i]))) {
			temp = temp * 10 + parseInt(infixExp[i]);
		} else if (infixExp[i]=='(') {
			tempOperaters.push(infixExp[i]);
		} else if (infixExp[i] == ')') {
			if (temp != null) {
				postfixExp.push(temp.toString());
				temp = null;
			}
			while (tempOperaters.peek() != '(') {
				postfixExp.push(tempOperaters.pop());
			}
			tempOperaters.pop();
		}else if (getPriority(infixExp[i]) > getPriority(tempOperaters.peek())) {
			if (temp != null) {
				postfixExp.push(temp.toString());
				temp = null;
			}
			tempOperaters.push(infixExp[i]);
		} else if (getPriority(infixExp[i]) <= getPriority(tempOperaters.peek())) {
			if (temp != null) {
				postfixExp.push(temp.toString());
				temp = null;
			}
			while (getPriority(infixExp[i]) <= getPriority(tempOperaters.peek())) {
				postfixExp.push(tempOperaters.pop());
			}
			tempOperaters.push(infixExp[i]);
		} else if (infixExp[i] == '#') {
			if (temp != null) {
				postfixExp.push(temp.toString());
				temp = null;
			}
			while(tempOperaters.length != 1) {
				postfixExp.push(tempOperaters.pop());
			}
		}
	}
	while(postfixExp.length != 0) {
		rvPostfixExp.push(postfixExp.pop());
	}
	return rvPostfixExp;
}

//get the priortity of the operaters
function getPriority (char: string): number {
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
function caculatePostfixExp (postfixExp) {
	let length = postfixExp.length;
	let caculStack = new Stack();
	let operand_1, operand_2, answer;
	let operater;
	let exp = '';
	while(postfixExp.length != 0){
		if (!isNaN(parseInt(postfixExp.peek()))) {
			exp += postfixExp.peek();
			exp += ' ';
			caculStack.push(postfixExp.pop());
		} else {
			operand_1 = parseInt(String(caculStack.pop()));
			operand_2 = parseInt(String(caculStack.pop()));
			if (postfixExp.peek() == '^') {
				exp += 'POW';
				exp += ' ';
			} else {
				exp += postfixExp.peek();
				exp += ' ';
			}
			operater = postfixExp.pop();
			switch (operater) {
				case '+': answer = operand_2 + operand_1; break;
				case '-': answer = operand_2 - operand_1; break;
				case '*': answer = operand_2 * operand_1; break;
				case '/': answer = operand_2 / operand_1; break;
				case '^': answer = Math.pow(operand_2, operand_1); break;
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
	let infixExp = prompt ('Please input the infix expression ("quit" to quit this programe): ');
	infixExp = infixExp.replace (/\s+/g, '');
	infixExp = infixExp.replace(/POW/g, '^');
	if (infixExp == 'quit') {break;}

	/*
	try {
		checkExp(infixExp);
	} catch (err) {
		console.log(err);
		continue;
	}
	*/
	let postfixExp = convertToPostfixExp(infixExp);	

	let answer = caculatePostfixExp(postfixExp);

} while (isContinue);
















