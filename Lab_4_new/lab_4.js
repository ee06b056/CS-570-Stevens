// Group 4
//Lab 4: Wrapper & Iterator Lab
class FakeVector {
    constructor(length) {
        this._arr = new Array(length);
    }
    get length() {
        return this._arr.length;
    }
    get(index) {
        return this._arr[index];
    }
    set(index, value) {
        this._arr[index] = value;
    }
    push(value) {
        this._arr.push(value);
    }
    pop() {
        return this._arr.pop();
    }
    insert(index, value) {
        this._arr.splice(index, 0, value);
    }
    *[Symbol.iterator]() {
        for (let i of this._arr) {
            yield i;
        }
    }
}
let vector = new FakeVector(5);
vector.pop();
vector.pop();
vector.pop();
vector.pop();
vector.pop();
vector.pop();
for (let i of vector) {
    console.log(i);
}
console.log(vector.length);
