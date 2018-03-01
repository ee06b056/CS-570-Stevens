// Group 4
//Lab 4: Wrapper & Iterator Lab

interface IVector<T> extends Iterable<T> {
    length: number;
    get (index: number): T;
    set (index: number, value: T): void;
    push (value: T): void;
    pop (): T | undefined;
    insert (index: number, value: T): void;
}

class FakeVector<T> implements IVector<T> {
    constructor (length: number) {
        this._arr = new Array(length);
        this.length = length;
    }

    private _arr: T[];
    public length: number;

    public get (index: number): T {
        if ( index < 0 || index > this.length - 1) {
            throw "Incorrect index";
        }
        return this._arr[index];
    }

    public set (index: number, value: T): void {
        if ( index < 0 || index > this.length - 1) {
            throw "Incorrect index";
        }
        this._arr[index] = value;
    }

    public push (value: T): void {
        this._arr.push(value);
        this.length++;
    }

    public pop (): T | undefined {
        if (this.length <= 0) {
            throw "Empty vector!"
        }
        this.length--;
        return this._arr.pop();
    }
    
    public insert (index: number, value: T) {
        if ( index < 0 || index > this.length - 1) {
            throw "Incorrect index";
        }
        this.length++;
        this._arr.splice(index, 0, value);
    }

    public* [Symbol.iterator] () {
        for (let i of this._arr) {
            yield i;
        }
    }
}

let vector = new FakeVector<number> (3);

vector.set(0, 1);
vector.set(1, 2);
vector.set(2, 4);
vector.insert(1,10);
vector.push(99);

for (let i of vector) {
    console.log(i);
}

console.log(vector.pop());


