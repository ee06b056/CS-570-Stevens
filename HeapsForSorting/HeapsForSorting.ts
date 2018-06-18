const fs = require('fs');
const promptSync = require('prompt-sync')();

class MaxHeap {
    private arr: number[];

    constructor () {
        this.arr = new Array<number>();
    }

    public testOutput (): void {

        while (this.arr.length > 0) {
            console.log(this.arr);
            console.log(this.pop());
        }
    }

    public push (num: number): void {
        this.arr.push(num);
        let index = this.arr.length - 1, parIndex = Math.floor((index - 1) / 2);
        while (parIndex >= 0) {
            if (this.arr[index] > this.arr[parIndex]) {
                this.swap(index, parIndex);
                index = parIndex, parIndex = Math.floor((index - 1) / 2);
            } else {
                break;
            }
        }
        console.log(this.arr);
    }

    public pop (): number {
        this.swap(0, this.arr.length - 1);
        let output = this.arr.pop();
        this.maximaze(0);
        return <number>output;
    }

    private swap (index_1: number, index_2: number): void {
        if (index_1 >= this.arr.length || index_2 >= this.arr.length) return;
        let temp = this.arr[index_1];
        this.arr[index_1] = this.arr[index_2];
        this.arr[index_2] = temp;
    }

    private maximaze (index:number): void {
        let left_child = index * 2 + 1, right_child = index * 2 + 2, maxIndex = index;
        while (left_child < this.arr.length) {
            if (this.arr[left_child] > this.arr[maxIndex]) maxIndex = left_child;
            if (this.arr[right_child] > this.arr[maxIndex]) maxIndex = right_child;
            if (maxIndex != index) {
                this.swap(maxIndex, index);
                index = maxIndex;
                left_child = index * 2 + 1, right_child = index * 2 + 2;
            } else {
                break;
            }
        }
    }
}

function main() {
    let maxHeap = new MaxHeap();
    for (let i = 0; i < 5; i++) {
        let input = parseInt(promptSync('please input one number'));
        maxHeap.push(input);
    }

    maxHeap.testOutput();

    
}

main();
