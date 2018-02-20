"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var Node = /** @class */ (function () {
    function Node(value) {
        this.value = value;
        this.bfn = -1;
    }
    return Node;
}());
var Queue = /** @class */ (function () {
    function Queue() {
        this.queue = [];
    }
    ;
    Object.defineProperty(Queue.prototype, "size", {
        get: function () {
            return this.queue.length;
        },
        enumerable: true,
        configurable: true
    });
    Queue.prototype.enqueue = function (node) {
        this.queue.push(node);
    };
    Queue.prototype.dequeue = function () {
        return this.queue.shift();
    };
    Queue.prototype.peek = function () {
        return this.queue[0];
    };
    return Queue;
}());
var Graph = /** @class */ (function () {
    function Graph() {
        this.nodes = [];
        this.adjacencyMatrix = [];
    }
    Graph.prototype.createGraph = function (nodeNum, edgeNum, map) {
        for (var i = 0; i < nodeNum; i++) {
            this.nodes[i] = new Node(i);
            this.adjacencyMatrix[i] = [];
            for (var j = 0; j < nodeNum; j++) {
                this.adjacencyMatrix[i][j] = -1;
            }
        }
        for (var i = 0; i < map.length; i++) {
            var tailIn = map[i][0], headIn = map[i][1];
            this.adjacencyMatrix[tailIn][headIn] = 1;
            this.adjacencyMatrix[headIn][tailIn] = 1;
        }
    };
    Graph.prototype.BFS = function (startIn) {
        var S_Prime = new Queue;
        var node = this.nodes[startIn];
        S_Prime.enqueue(node);
        S_Prime.peek().bfn = startIn;
        var tempBnf = 0;
        node.bfn = tempBnf;
        var adjacencyMatrix_copy = this.adjacencyMatrix.slice();
        while (S_Prime.size > 0) {
            var node_1 = S_Prime.peek();
            var n_index = node_1.value;
            var edges_node = adjacencyMatrix_copy[n_index];
            for (var i = 0; i < edges_node.length; i++) {
                if (edges_node[i] === 1) {
                    if (this.nodes[i].bfn === -1) {
                        tempBnf++;
                        this.nodes[i].bfn = tempBnf;
                        S_Prime.enqueue(this.nodes[i]);
                    }
                    adjacencyMatrix_copy[n_index][i] = 0;
                    adjacencyMatrix_copy[i][n_index] = 0;
                }
            }
            S_Prime.dequeue();
        }
    };
    Graph.prototype.output_BFN = function () {
        console.log('The adjacency matrix:');
        console.log(this.adjacencyMatrix);
        console.log('the BFN of each valid node:');
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var i = _a[_i];
            if (i.bfn >= 0)
                console.log(i.value, i.bfn);
        }
    };
    return Graph;
}());
function formatReadFile(path) {
    var rawText = fs.readFileSync(path, 'utf-8').replace(/\r+/g, '').split(/\n+/g);
    var node_edge_num = rawText[0].split(' ');
    var nodeNum = Number(node_edge_num[0]);
    var edgeNum = Number(node_edge_num[1]);
    rawText.shift();
    var map = [];
    for (var i = 0; i < rawText.length; i++) {
        var tail = Number(rawText[i].split(' ')[0]);
        var head = Number(rawText[i].split(' ')[1]);
        map[i] = new Array();
        map[i].push(tail);
        map[i].push(head);
    }
    return {
        nodeNum: nodeNum,
        edgeNum: edgeNum,
        map: map
    };
}
function main() {
    var a = formatReadFile('infile.dat');
    var g = new Graph();
    g.createGraph(a.nodeNum, a.edgeNum, a.map);
    g.BFS(0);
    g.output_BFN();
}
main();
