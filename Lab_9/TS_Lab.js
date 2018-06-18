let fs = require('fs');
//create graph in adjacent array
function createGraph() {
    let text = fs.readFileSync('infile.dat', 'utf8').split(/\s*/).map(Number);
    let nodes = text.shift();
    let edges = text.shift();
    let graph = [];
    // initiate arrary
    for (let i = 0; i < nodes; i++) {
        graph.push([i,]);
    }
    while (text.length > 0) {
        let edge_end_node_1 = text.shift();
        let edge_end_node_2 = text.shift();
        graph[edge_end_node_1].push(edge_end_node_2);
    }
    return graph;
}
//count the indegree store in 2-d array
function countIndegree(graph) {
    let id = [];
    for (let i = 0; i < graph.length; i++) {
        id.push([graph[i][0], 0]);
    }
    for (let i = 0; i < graph.length; i++) {
        for (let j = 1; j < graph[i].length; j++) {
            let index = id.findIndex(function (element) {
                return element[0] == graph[i][j];
            });
            id[index][1]++;
        }
    }
    return id;
}
//returen in topological sort order
function topologicalSort_1(graph) {
    let id_0 = [];
    while (graph.length > 0) {
        let id = countIndegree(graph);
        //find the index of the coresponding node from begin
        let index = id.findIndex(function (element) {
            return element[1] == 0;
        });
        id_0.push(graph[index][0]);
        graph.splice(index, 1);
    }
    return id_0;
}
//return in another topological sort order
function topologicalSort_2(graph) {
    let id_0 = [];
    while (graph.length > 0) {
        let id = countIndegree(graph);
        let index;
        //find the index of the coresponding node from end
        for (let j = id.length - 1; j >= 0; j--) {
            if (id[j][1] === 0) {
                index = j;
                break;
            }
        }
        id_0.push(graph[index][0]);
        graph.splice(index, 1);
    }
    return id_0;
}
let graph_1 = createGraph();
let graph_2 = graph_1.slice();
let output_1 = topologicalSort_1(graph_1);
let output_2 = topologicalSort_2(graph_2);
console.log(output_1);
console.log(output_2);
