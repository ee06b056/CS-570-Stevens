'use strict'

//define the interface 
interface Vector<T>  {
	length: number;
	get (index: number);
	set (index: number, value: T);
	push (value: T);
	pop (): T;
	insert(index: number, value: T);
}

//implement the interface with class FakeVector
class FakeVector<T> implements Vector<T> 
 {

 	private mem: T[];
 	public length: number;

 	constructor(length: number = 0) {
 		this.mem = new Array(length);
 		this.length = length;
 	}
 	
 	//get the capacity
 	private getCapacity(): number {
 		return this.mem.length;
 	}

 	//get the length
 	private getLength(): number {
 		return this.length;
 	}

 	//get the value of index
	public get (index: number): T {
		return this.mem[index];
	}

	//set the value of index
	public set (index: number, value: T) {
		this.mem[index] = value;
	}

	//insert the value of index
	public insert (index: number, value: T) {
		if (this.getLength() == this.getCapacity()) 
			this.reserve(this.length + 1);
		for (let i = this.getLength(); i >= index; i --) 
			this.mem[i] = this.mem[i-1];
		this.length++;
		this.mem[index] = value;
	}

	//remove the value of index
	private remove (index: number) {
		for (let i = index; i < this.getLength()-1; i++) 
			this.mem[i] = this.mem[i+1];
		this.length--;

	}
	//make sure the capacity is larger than length
	private reserve (capacity: number) {
		let newmem = new Array(Math.max(this.getCapacity() * 3, 1, capacity));
		for (let i = 0; i < this.mem.length; i++) 
			newmem[i] = this.mem[i];
		delete this.mem;
		this.mem = newmem;
	}

	//add the value to botton 
	public push(value: T) {
		if (this.getLength() == this.getCapacity()) {
			this.reserve(this.getLength() + 1);


		}
		this.mem[this.getLength()] = value;
		this.length++;
	}

	//remove the value of botton 
	public pop(): T {
		this.length--;
		return this.mem[this.getLength()-1];
	}

	//generator
	public* [Symbol.iterator] () {
		for (let i = 0; i < this.length; i++) 
			yield this.mem[i];
	}
}

//create a instance of class FakeVector and define the length as 2
let vector = new FakeVector<number[]>(2);

//test function for testing the iterator feature 
function outputVector (vector: FakeVector<number[]>) {
	for (let i of vector) {
		console.log(i);
	}
}

//test for set method 
vector.set(0, [0,1]);
vector.set(1, [1,2]);

//test for push method
vector.push([3,4]);
vector.push([4,5]);

//test for insert method
vector.insert(1, [9,9]);

//show the result 
outputVector(vector);


