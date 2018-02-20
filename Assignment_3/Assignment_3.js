"use strict";
exports.__esModule = true;
var fs = require("fs");
var readpath = 'infile.dat';
var writepath = 'outfile.dat';
//the node class to store each character and its properties
var Nodee = /** @class */ (function () {
    function Nodee(char) {
        this.value = char;
        this.huffmanCode = '';
        this.frequency = 0;
        this.frequencyPer = 0.00;
    }
    return Nodee;
}());
//the huffman tree class to store the huffman tree properties and output all the leaves in the tree
var HuffmanTree = /** @class */ (function () {
    function HuffmanTree(charNodes) {
        //create the huffman tree based on the node array passed into the constructer
        while (charNodes.length > 1) {
            var leftNode = charNodes.pop();
            addCode(leftNode, '0');
            var rightNode = charNodes.pop();
            addCode(rightNode, '1');
            var mergeNode = new Nodee(leftNode.value + rightNode.value);
            mergeNode.frequency = leftNode.frequency + rightNode.frequency;
            mergeNode.leftNode = leftNode;
            mergeNode.rightNode = rightNode;
            charNodes.unshift(mergeNode);
            sortByFreq(charNodes);
        }
        this.root = charNodes[0];
        this.current = this.root;
        this.leafArr = new Array();
        this.totalBits = 0;
        this.createLeafArr(this.root);
    }
    //put all leaves into array and count all the bits in the same time
    HuffmanTree.prototype.createLeafArr = function (current) {
        if (current == null)
            return;
        if (current.leftNode == null && current.rightNode == null) {
            this.leafArr.push(current);
            this.totalBits = this.totalBits + current.frequency * current.huffmanCode.length;
        }
        this.createLeafArr(current.leftNode);
        this.createLeafArr(current.rightNode);
    };
    HuffmanTree.prototype.leaves = function () {
        sortByFreq(this.leafArr);
        return this.leafArr;
    };
    return HuffmanTree;
}());
//add 0 or 1 to the huffman code of all nodes in the tree 
function addCode(node, code) {
    if (node == null)
        return;
    node.huffmanCode = code + node.huffmanCode;
    addCode(node.leftNode, code);
    addCode(node.rightNode, code);
}
//function for sort, made the sort function to sort the node from highest frequency to lowest
function forSort(a, b) {
    return b.frequency - a.frequency;
}
function sortByFreq(charNodes) {
    charNodes.sort(forSort);
}
//function count frequency of each character except all the blanks, all punctuations marks and all special symbols.
//create node class for each character appears in the text and calculate the frequency and the percentage of it in text in the same time
function countFreq(charArr) {
    var charNodes = new Array();
    var charCountArr = new Array(75);
    var index = -1;
    var total = 0;
    for (var i = 0; i < charCountArr.length; i++) {
        charCountArr[i] = 0;
    }
    for (var i = 0; i < charArr.length; i++) {
        index = charArr.charCodeAt(i) - 48;
        charCountArr[index]++;
        total++;
    }
    for (var i = 0; i < 10; i++) {
        if (charCountArr[i] != 0) {
            var tempChar = String.fromCharCode(i + 48);
            var tempNode = new Nodee(tempChar);
            tempNode.frequency = charCountArr[i];
            tempNode.frequencyPer = tempNode.frequency / total;
            charNodes.push(tempNode);
        }
    }
    for (var i = 17; i < 43; i++) {
        if (charCountArr[i] != 0) {
            var tempChar = String.fromCharCode(i + 48);
            var tempNode = new Nodee(tempChar);
            tempNode.frequency = charCountArr[i];
            tempNode.frequencyPer = tempNode.frequency / total;
            charNodes.push(tempNode);
        }
    }
    for (var i = 49; i < 75; i++) {
        if (charCountArr[i] != 0) {
            var tempChar = String.fromCharCode(i + 48);
            var tempNode = new Nodee(tempChar);
            tempNode.frequency = charCountArr[i];
            tempNode.frequencyPer = tempNode.frequency / total;
            charNodes.push(tempNode);
        }
    }
    sortByFreq(charNodes);
    return charNodes;
}
//the main funciton do the reading file, manipulating data and writing file work
function main() {
    var text = fs.readFileSync(readpath).toString();
    var charNodes = countFreq(text);
    var huffmanTree = new HuffmanTree(charNodes);
    var leaves = huffmanTree.leaves();
    var outputData = '';
    outputData = outputData + 'Symbol  frequency\n';
    for (var i = 0; i < leaves.length - 1; i++) {
        outputData = outputData + '  ' + leaves[i].value + ',     ' + (leaves[i].frequencyPer * 100).toFixed(3) + '%\n';
    }
    outputData = outputData + 'Symbol Huffman Codes\n';
    for (var i = 0; i < leaves.length - 1; i++) {
        outputData = outputData + '  ' + leaves[i].value + ',    ' + leaves[i].huffmanCode + '\n';
    }
    outputData = outputData + 'The total bits: ' + huffmanTree.totalBits.toString();
    fs.writeFile(writepath, outputData, function (err) {
        if (err) {
            return console.error(err);
        }
        console.log('Writing file successfully!');
    });
}
//entrance of the programme
main();
