class Nodee {
    public value: number;
    public left: Nodee;
    public right: Nodee;
    constructor (value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    private root: Nodee;
    constructor () {
        this.root = null;
    }

    public insert (value: number) {
        let node = new Nodee(value);
        if (this.root == null) {
            this.root = node;
            return;
        }
        let current = this.root;
        while(current){
            if (value < current.value) {
                if (current.left == null) {
                    current.left = node;
                    console.log('save \$value to the left of ', current.value);
                    return;
                } else {
                    current = current.left;
                }
            } else if (value > current.value) {
                if (current.right == null){
                    current.right = node;
                    console.log('save to the right of ', current.value);
                    return;
                } else {
                    current = current.right;
                }
            } else {
                throw "dulicate value";
            }
        }
    }

    public search (value: number): boolean {
        let current: Nodee = this.root;
        while (current) {
            if (current.value == value) {
                return true;
            } else if (value < current.value) {
                current = current.left;
                continue;
            } else if (value > current.value) {
                current = current.right;
                continue;
            }
        }
        return false;
    }
}

let bst = new BinarySearchTree;

bst.insert(5);
bst.insert(2);
bst.insert(1);
bst.insert(3);
bst.insert(10);
bst.insert(8);
bst.insert(12);

console.log(bst.search(12));
console.log(bst.search(13));
