"use strict";
exports.__esModule = true;
var RBTree = require("red-black-tree-js");
var RBTREE = /** @class */ (function () {
    function RBTREE() {
        this.RBTree = new RBTree;
        this.keyArr = new Array();
    }
    RBTREE.prototype.insert = function (key, value) {
        this.keyArr.push(key);
        this.RBTree.insert(key, value);
    };
    RBTREE.prototype.retrieve = function (key) {
        return this.RBTree.find(key);
    };
    RBTREE.prototype["delete"] = function (key) {
        var index = this.keyArr.indexOf(key);
        if (index < 0)
            throw Error;
        this.keyArr.splice(index, 1, key);
        this.RBTree.remove(key);
    };
    RBTREE.prototype.find = function (key) {
        if (this.keyArr.indexOf(key) >= 0)
            return true;
        else
            return false;
    };
    RBTREE.prototype.sort = function () {
        this.keyArr.sort();
        // console.log('Key      Value');
        for (var _i = 0, _a = this.keyArr; _i < _a.length; _i++) {
            var element = _a[_i];
            console.log(element, '     ', this.retrieve(element));
        }
    };
    return RBTREE;
}());
var rbTree = new RBTREE();
rbTree.insert('hello', 'world');
rbTree.insert('goodbye', 'everyone');
rbTree.insert('name', 'student');
rbTree.insert('occupation', 'student');
rbTree.insert('year', '2016');
rbTree.insert('gpa', '4.0');
rbTree.insert('lab', 'yes');
rbTree.insert('assignment', 'no');
rbTree.insert('department', 'cs');
console.log('The value of gpa retrive from the tree is:  ', rbTree.retrieve('gpa'));
console.log('The value of department retrived from the tree is:  ', rbTree.retrieve('department'));
