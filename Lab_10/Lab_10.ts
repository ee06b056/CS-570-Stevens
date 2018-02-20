import * as fs from 'fs';

class Node {
    public value:any;
    public bfn: number;

    constructor (value: any) {
        this.value = value;
        this.bfn = -1;
    }
}

class Queue {
    private queue: Node[] = [];

    constructor () {};

    public get size (): number {
        return this.queue.length;
    }
    public enqueue (node: Node): void {
        this.queue.push(node);
    }
    public dequeue (): Node {
        return this.queue.shift() as Node;
    }
    public peek(): Node {
        return this.queue[0];
    }
}

class Graph {
    public nodes: Node[];
    public adjacencyMatrix: number[][];
    
    constructor () {
        this.nodes = [];
        this.adjacencyMatrix = [];
    }

    public createGraph (nodeNum: number, edgeNum: number, map: number[][]) {
        for (let i = 0; i < nodeNum; i++) {
            this.nodes[i] = new Node(i);
            this.adjacencyMatrix[i] = [];
            for (let j = 0; j < nodeNum; j++) {
                this.adjacencyMatrix[i][j] = -1;
            }
        }
        for (let i = 0; i < map.length; i++) {
            let tailIn = map[i][0], headIn = map[i][1];
            this.adjacencyMatrix[tailIn][headIn] = 1;
            this.adjacencyMatrix[headIn][tailIn] = 1;
        }
    }

    public BFS (startIn: number): void {
        let S_Prime = new Queue;
        let node = this.nodes[startIn];
        S_Prime.enqueue(node);
        S_Prime.peek().bfn = startIn;
        let tempBnf: number = 0;
        node.bfn = tempBnf;
        let adjacencyMatrix_copy = this.adjacencyMatrix.slice();
        while(S_Prime.size > 0) {
            let node: Node = S_Prime.peek();
            let n_index: number = node.value;
            let edges_node: number[] = adjacencyMatrix_copy[n_index];
            for (let i = 0; i < edges_node.length; i++) {
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
    }

    public output_BFN (): void {
        console.log('The adjacency matrix:');
        console.log(this.adjacencyMatrix);
        console.log('the BFN of each valid node:');
        for (let i of this.nodes) {
            if (i.bfn >= 0)
                console.log(i.value, i.bfn);
        }
    }
}

function formatReadFile (path: string): {nodeNum: number, edgeNum: number, map: number[][]} {
    let rawText: string[] = fs.readFileSync(path,'utf-8').replace(/\r+/g,'').split(/\n+/g);
    let node_edge_num: string[] = rawText[0].split(' ');
    let nodeNum: number = Number(node_edge_num[0]);
    let edgeNum: number = Number(node_edge_num[1]);
    rawText.shift();
    let map: number[][] = [];
    for (let i = 0; i < rawText.length; i++) {
        let tail: number = Number(rawText[i].split(' ')[0]);
        let head: number = Number(rawText[i].split(' ')[1]);
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

function main () {
    let a = formatReadFile ('infile.dat');
    let g = new Graph();
    g.createGraph(a.nodeNum, a.edgeNum, a.map);
    g.BFS(0);
    g.output_BFN();
}

main();