interface LinkedList < T > {
	value: T;
	next: LinkedList < T > ;
	head: LinkedList < T > ;
	length: number;
	add(value: T);
}

class LinkedList < T > implements LinkedList < T > {
    public value: T;
    public next: LinkedList < T > ;
    public head: LinkedList < T > ;
    public length: number = 0;

    add(value: T) {
        let newlist = new LinkedList < T > ();
        newlist.value = value;
        let current = null;
        let i = 0;
        if (this.head == null) this.head = newlist;
        else {
            current = this.head;
            while (i++ < this.length-1)
                current = current.next;
            if(this.length >= 12) current.next.value = value;
            else current.next = newlist;
        }
        this.length++;
        if(this.length == 12){
            let head = this.head;
            current.next.next = head;
        }
    }
}

let sll = new LinkedList < any > ();

function Print(LinkedList) {
    let current = LinkedList.head;
    for(let i=0;i<12;i++){
        if (current != null) console.log(current.value);
        if (current.next != null) current = current.next;
        else break;
    }
}

import * as promptSync from 'prompt-sync';
let prompt = promptSync();
ask();

function ask(){
    let input = prompt ('Please input items, or input quit to quit: ');
    if (input == 'quit') Print(sll);
    else {
        sll.add(input);
        ask()
    }
}