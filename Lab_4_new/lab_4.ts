// Group 4
//Lab 4: Wrapper & Iterator Lab

interface IVector<T> extends Iterable<T> {
    // length: number;
    get (index: number): T;
    set (index: number, value: T): void;
    push (value: T): void;
    pop (): T | undefined;
    insert (index: number, value: T): void;
}

class FakeVector<T> implements IVector<T> {
    constructor (length: number) {
        this._arr = new Array(length);
    }
    private _arr: T[];
    public get length (): number {
        return this._arr.length;
    }

    public get (index: number): T {
        return this._arr[index];
    }

    public set (index: number, value: T): void {
        this._arr[index] = value;
    }

    public push (value: T): void {
        this._arr.push(value);
    }

    public pop (): T | undefined {
        return this._arr.pop();
    }
    
    public insert (index: number, value: T) {
        this._arr.splice(index, 0, value);
    }

    public* [Symbol.iterator] () {
        for (let i of this._arr) {
            yield i;
        }
    }
}
