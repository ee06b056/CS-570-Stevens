'use stric';
//implement the interface with class FakeVector
class FakeVector {
    constructor(length = 0) {
        this.mem = new Array(length);
        this.length = length;
    }
    //get the capacity
    getCapacity() {
        return this.mem.length;
    }
    //get the length
    getLength() {
        return this.length;
    }
    //get the value of index
    get(index) {
        return this.mem[index];
    }
    //set the value of index
    set(index, value) {
        this.mem[index] = value;
    }
    //insert the value of index
    insert(index, value) {
        if (this.getLength() == this.getCapacity())
            this.reserve(this.length + 1);
        for (let i = this.getLength(); i >= index; i--)
            this.mem[i] = this.mem[i - 1];
        this.length++;
        this.mem[index] = value;
    }
    //remove the value of index
    remove(index) {
        for (let i = index; i < this.getLength() - 1; i++)
            this.mem[i] = this.mem[i + 1];
        this.length--;
    }
    //make sure the capacity is larger than length
    reserve(capacity) {
        let newmem = new Array(Math.max(this.getCapacity() * 3, 1, capacity));
        for (let i = 0; i < this.mem.length; i++)
            newmem[i] = this.mem[i];
        delete this.mem;
        this.mem = newmem;
    }
    //add the value to botton 
    push(value) {
        if (this.getLength() == this.getCapacity()) {
            this.reserve(this.getLength() + 1);
        }
        this.mem[this.getLength()] = value;
        this.length++;
    }
    //remove the value of botton 
    pop() {
        this.length--;
        return this.mem[this.getLength() - 1];
    }
    //generator
    *[Symbol.iterator]() {
        for (let i = 0; i < this.length; i++)
            yield this.mem[i];
    }
}
//create a instance of class FakeVector and define the length as 2
let vector = new FakeVector(2);
//test function for testing the iterator feature 
function outputVector(vector) {
    for (let i of vector) {
        console.log(i);
    }
}
//test for set method 
vector.set(0, [0, 1]);
vector.set(1, [1, 2]);
//test for push method
vector.push([3, 4]);
vector.push([4, 5]);
//test for insert method
vector.insert(1, [9, 9]);
//show the result 
outputVector(vector);
