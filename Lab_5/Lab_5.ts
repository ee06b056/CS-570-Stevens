import * as promptSync from 'prompt-sync';
let prompt = promptSync();
let isContinue: boolean = true;

class Node{
    public value: string;
    public next: Node;

    constructor(value) {
        this.value = value;
        this.next =null;
    }
}

class CirLinkedList {
    public head: Node = null;
    private inputCount: number = 0;

    constructor(){};

    public add (value: string) {
        if (this.inputCount === 0) {
            let node = new Node(value);
            this.head = node;
        } else if (this.inputCount < 12) {
            let node = new Node(value);
            let current = this.head;
            while(current.next != null) {
                current = current.next;
            }
            current.next = node;
        } else {
            let length = this.inputCount%12 + 1;
            let current = this.head;
            for (let i = 0; i < length - 1; i++){
                current = current.next;
            }
            current.value = value;
        }
        this.inputCount++;
    }

    public display () {
        if (this.inputCount === 0) {
            console.log('Emplety queue.\n')
        } else {
            let current = this.head;
            do {
                console.log(current.value);
                current = current.next;
            } while(current != null);
        }
    }
}

let cirQ = new CirLinkedList();
do {
    let input = prompt('Please input ("quit" to exit and display the queue): ');
    if (input == 'quit') break;
    cirQ.add(input); 
} while(isContinue);
cirQ.display();
