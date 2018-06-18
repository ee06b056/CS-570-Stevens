import * as fs from 'fs';
import * as promptSync from 'prompt-sync';
const prompt = promptSync();

//the node class to store each character and its properties
class Nodee {
    public value: string;
    public frequency: number;
    public frequencyPer: number;
    public huffmanCode: string;
    public leftNode: Nodee;
    public rightNode: Nodee;
    
    constructor (char: string) {
        this.value = char;
        this.huffmanCode = '';
        this.frequency = 0;
        this.frequencyPer = 0.00;
    }
}
//the huffman tree class to store the huffman tree properties and output all the leaves in the tree
class HuffmanTree {
    public root: Nodee;
    private current: Nodee;
    private leafArr: Nodee[];
    public totalBits: number;
    
    constructor (charNodes: Nodee[]) {
        //create the huffman tree based on the node array passed into the constructer
        while (charNodes.length > 1) {
            let leftNode = charNodes.pop();
            addCode(leftNode, '0');
            let rightNode = charNodes.pop();
            addCode(rightNode, '1');
            let mergeNode = new Nodee(leftNode.value + rightNode.value);
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
    private createLeafArr (current: Nodee){
        if (current == null) return;
        if (current.leftNode == null && current.rightNode == null) {
            this.leafArr.push(current);
            this.totalBits = this.totalBits + current.frequency * current.huffmanCode.length;
        }
        this.createLeafArr(current.leftNode);
        this.createLeafArr(current.rightNode);
    }


    public leaves () {
        sortByFreq(this.leafArr);
        return this.leafArr;
    }
}

//add 0 or 1 to the huffman code of all nodes in the tree 
function addCode (node: Nodee, code: string) {
    if (node == null) return;
    node.huffmanCode = code + node.huffmanCode;
    addCode(node.leftNode, code);
    addCode(node.rightNode, code);
}

//function for sort, made the sort function to sort the node from highest frequency to lowest
function forSort (a:Nodee, b:Nodee) {
    return b.frequency - a.frequency;
}
function sortByFreq (charNodes: Nodee[]) {
    charNodes.sort(forSort);
}
//function count frequency of each character except all the blanks, all punctuations marks and all special symbols.
//create node class for each character appears in the text and calculate the frequency and the percentage of it in text in the same time
function countFreq (charArr: string): Nodee[] {
    let charNodes: Nodee[] = new Array();
    let charCountArr: number[] = new Array(75);
    let index = -1;
    let total = 0;
    for (let i = 0; i < charCountArr.length; i++) {
        charCountArr[i] = 0;
    }
    for (let i = 0; i < charArr.length; i++) {
        index = charArr.charCodeAt(i) - 48;
        charCountArr[index]++;
        total++;
    }
    for(let i = 0; i < 10; i++) {
        if (charCountArr[i] != 0) {
            let tempChar = String.fromCharCode(i+48);
            let tempNode = new Nodee(tempChar);
            tempNode.frequency = charCountArr[i];
            tempNode.frequencyPer = tempNode.frequency/total;
            charNodes.push(tempNode);
        }
    }
    for (let i = 17; i < 43; i++) {
        if (charCountArr[i] != 0) {
            let tempChar = String.fromCharCode(i+48);
            let tempNode = new Nodee(tempChar);
            tempNode.frequency = charCountArr[i];
            tempNode.frequencyPer = tempNode.frequency/total;
            charNodes.push(tempNode);
        }
    }
    for (let i = 49; i < 75; i++) {
        if (charCountArr[i] != 0) {
            let tempChar = String.fromCharCode(i+48);
            let tempNode = new Nodee(tempChar);
            tempNode.frequency = charCountArr[i];
            tempNode.frequencyPer = tempNode.frequency/total;
            charNodes.push(tempNode);
        }
    }
    sortByFreq(charNodes);
    return charNodes;
}

//the main funciton do the reading file, manipulating data and writing file work
function main () {

    let readFile = prompt('Please input the file name to read, default name: \'infile.dat\':');
    let outFile = prompt('Please input the file name to output, default name: \'outfile.dat\':');
    if (!readFile) {
        readFile = __dirname + '/infile.dat';
    }
    if (!outFile) {
        outFile = __dirname + '/outfile.dat';
    }


    let text: string = fs.readFileSync(readFile).toString();
    let charNodes: Nodee[] = countFreq(text);
    let huffmanTree = new HuffmanTree(charNodes);
    let leaves = huffmanTree.leaves();
    let outputData: string = '';
    outputData = outputData + 'Symbol  frequency\n';
    for (let i = 0; i < leaves.length - 1; i++) {
        outputData = outputData + '  ' + leaves[i].value + ',     ' + (leaves[i].frequencyPer*100).toFixed(3) + '%\n';
    }
    outputData = outputData + 'Symbol Huffman Codes\n';
    for (let i = 0; i < leaves.length - 1; i++) {
        outputData = outputData + '  ' + leaves[i].value + ',    ' + leaves[i].huffmanCode + '\n';
    }
    outputData = outputData + 'The total bits: ' + huffmanTree.totalBits.toString();
    fs.writeFile(outFile, outputData, function(err) {
        if (err) {
            return console.error (err);
        }
        console.log('Writing file successfully!');
    });
}

//entrance of the programme
main();
