const prompt = require('prompt-sync')();
import * as fs from 'fs';

//Maxheap class
class MaxHeap {
    //array to store the heap data
    private array: number[];
    
    constructor () {
        this.array = new Array;
    }

    private swap (i:number, j:number) {
        let temp = this.array[i];
        this.array[i] = this.array[j];
        this.array[j] = temp;
    }

    //make sure the heap is always maxheap
    private maxHeaplize (index:number) {
        if (index > Math.floor((this.array.length-2)/2)) return;
        let leftChild = 2 * index + 1;
        let rigthChild = leftChild + 1;
        let maxIndex = index;
        if (leftChild < this.array.length && this.array[leftChild] > this.array[maxIndex]) maxIndex = leftChild;
        if (rigthChild < this.array.length && this.array[rigthChild] > this.array[maxIndex]) maxIndex = rigthChild;
        this.swap(index, maxIndex);
        this.maxHeaplize(leftChild);
        this.maxHeaplize(rigthChild);
    }

    //create the maxheap
    private createMaxHeap () {
        let lastIndex = Math.floor((this.array.length - 2)/2);
        for (let i = lastIndex; i >=0; i--) {
            this.maxHeaplize(i);
        }
    }

    //add one number to heap
    public push (num: number) :void {
        this.array.push(num);
        let index = this.array.length - 1;
        let parIndex = Math.floor((index-1)/2);
        while (parIndex >= 0){
            if (this.array[parIndex] < this.array[index]) {
                this.swap (index, parIndex);
                index = parIndex;
                parIndex = Math.floor((index-1)/2);
            } else {
                break;
            }
        }
    }

    //delete the root from the heap, outputing the max number
    public pop (): number {
        this.swap(0, this.array.length-1);
        let temp = this.array.pop();
        this.createMaxHeap();
        return <number>temp;
    }

    //output all number in decending order from the heap
    public output ():void {
        while(this.array.length) {
            console.log(this.pop());
        }
    }
}

let maxHeap = new MaxHeap();
let count = 10;
try {
    while (count) {
        let inputS = prompt('Please input a number ' + (11-count) + ' of 10: ');
        let input = parseInt(inputS);
        if (!isNaN(input)) {
            maxHeap.push(input);
            count--;
        } else {
            console.log('Input need to be a number!')
            continue;
        }
    }
    
    console.log('The decending order of the input is: ');
    maxHeap.output();
} catch (err) {
    console.log(err);
}