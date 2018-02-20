"use strict";
exports.__esModule = true;
var fs = require("fs");
var promptSync = require("prompt-sync");
var prompt = promptSync();
//create the node class
var Nodee = /** @class */ (function () {
    function Nodee(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
    return Nodee;
}());
//create the binary search tree class
var BinarySearchTree = /** @class */ (function () {
    function BinarySearchTree() {
        this.root = null;
    }
    //insert function
    BinarySearchTree.prototype.insert = function (value) {
        var node = new Nodee(value);
        //if the root is null insert it here
        if (this.root == null) {
            this.root = node;
            return;
        }
        var current = this.root;
        while (current) {
            if (value < current.value) {
                if (current.left == null) {
                    current.left = node;
                    //console.log('save \$value to the left of ', current.value);
                    return;
                }
                else {
                    current = current.left;
                }
            }
            else if (value > current.value) {
                if (current.right == null) {
                    current.right = node;
                    //console.log('save to the right of ', current.value);
                    return;
                }
                else {
                    current = current.right;
                }
            }
            else {
                throw "incorrect value!";
            }
        }
    };
    //search function
    BinarySearchTree.prototype.search = function (value) {
        var current = this.root;
        while (current) {
            if (current.value == value) {
                return true;
            }
            else if (value < current.value) {
                current = current.left;
                continue;
            }
            else if (value > current.value) {
                current = current.right;
                continue;
            }
        }
        //can not find, return false
        return false;
    };
    return BinarySearchTree;
}());
var arrS = fs.readFileSync('infile.dat').toString().split(","); //get the input from file and parse by ,
var arr = new Array;
var bst = new BinarySearchTree;
//create the binary search tree and insert all the numbers to it
for (var i = 0; i < arrS.length; i++) {
    arr[i] = parseInt(arrS[i]);
    console.log(arr[i]);
    bst.insert(arr[i]);
}
//prompt the user to enter a number 
var inputS = prompt('Please input the number you want to find: ');
//find if the number is in the tree
var answer = bst.search(parseInt(inputS));
switch (answer) {
    case true:
        console.log('Yes');
        break;
    case false:
        console.log('No');
        break;
}
