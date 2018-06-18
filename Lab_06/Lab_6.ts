import * as fs from 'fs';
import * as promptSync from 'prompt-sync';
let prompt = promptSync({});

//create the node class
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

//create the binary search tree class
class BinarySearchTree {
    private root: Nodee;
    constructor () {
        this.root = null;
    }

    //insert function
    public insert (value: number) {
        let node = new Nodee(value);
        //if the root is null insert it here
        if (this.root == null) {
            this.root = node;
            return;
        }
        let current = this.root;
        while(current){
            if (value < current.value) {
                if (current.left == null) {
                    current.left = node;
                    //console.log('save \$value to the left of ', current.value);
                    return;
                } else {
                    current = current.left;
                }
            } else if (value > current.value) {
                if (current.right == null){
                    current.right = node;
                    //console.log('save to the right of ', current.value);
                    return;
                } else {
                    current = current.right;
                }
            } else {
                throw "incorrect value!";
            }
        }
    }

    //search function
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
        //can not find, return false
        return false;
    }
}

let arrS: string[] = fs.readFileSync('infile.dat').toString().split(","); //get the input from file and parse by ","
let arr: number[] = new Array;
let bst = new BinarySearchTree;
//create the binary search tree and insert all the numbers to it
for (let i = 0; i < arrS.length; i++)  {
    arr[i] = parseInt(arrS[i]);
    console.log(arr[i]);
    bst.insert(arr[i]);
}

//prompt the user to enter a number 
let inputS: string = prompt ('Please input the number you want to find: ');

//find if the number is in the tree
let answer = bst.search(parseInt(inputS));
switch (answer) {
    case true: console.log('Yes'); break;
    case false: console.log('No'); break;
}
