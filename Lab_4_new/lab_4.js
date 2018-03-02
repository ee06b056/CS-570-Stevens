// Group 4
//Lab 4: Wrapper & Iterator Lab
class FakeVector {
    constructor(length) {
        this._arr = new Array(length);
        this.length = length;
    }
    get(index) {
        if (index < 0 || index > this.length - 1) {
            throw "Incorrect index";
        }
        return this._arr[index];
    }
    set(index, value) {
        if (index < 0 || index > this.length - 1) {
            throw "Incorrect index";
        }
        this._arr[index] = value;
    }
    push(value) {
        this._arr.push(value);
        this.length++;
    }
    pop() {
        if (this.length <= 0) {
            throw "Empty vector!";
        }
        this.length--;
        return this._arr.pop();
    }
    insert(index, value) {
        if (index < 0 || index > this.length - 1) {
            throw "Incorrect index";
        }
        this.length++;
        this._arr.splice(index, 0, value);
    }
    *[Symbol.iterator]() {
        for (let i of this._arr) {
            yield i;
        }
    }
}
let vector = new FakeVector(3);
vector.set(0, 1);
vector.set(1, 2);
vector.set(2, 4);
vector.insert(1, 10);
vector.push(99);
for (let i of vector) {
    console.log(i);
}
console.log(vector.pop());
