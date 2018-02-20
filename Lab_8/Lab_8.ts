import * as RBTree from 'red-black-tree-js';

class RBTREE {
    private RBTree: RBTree;
    private keyArr: string[];
    constructor (){
        this.RBTree = new RBTree;
        this.keyArr = new Array();
    }

    public insert (key: string, value: string): void {
        this.keyArr.push(key);
        this.RBTree.insert(key, value);
    }

    public retrieve (key:string): string {
        return this.RBTree.find(key);
    }

    public delete (key: string): void {
        let index = this.keyArr.indexOf(key);
        if (index < 0) throw Error;
        this.keyArr.splice(index, 1, key);
        this.RBTree.remove(key);
    }

    public find (key: string): boolean {
        if (this.keyArr.indexOf(key) >= 0) return true;
        else return false;
    }

    public sort () {
        this.keyArr.sort();
        // console.log('Key      Value');
        for (let element of this.keyArr) {
            console.log(element, '     ', this.retrieve(element));
        }
    }
}

let rbTree = new RBTREE();
rbTree.insert('hello', 'world');
rbTree.insert('goodbye', 'everyone');
rbTree.insert('name', 'student');
rbTree.insert('occupation', 'student');
rbTree.insert('year', '2016');
rbTree.insert('gpa', '4.0');
rbTree.insert('lab', 'yes');
rbTree.insert('assignment', 'no');
rbTree.insert('department', 'cs');


console.log('The value of gpa retrived from the tree is:  ', rbTree.retrieve('gpa'));
console.log('The value of department retrived from the tree is:  ', rbTree.retrieve('department'));
