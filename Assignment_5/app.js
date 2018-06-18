"use strict";
exports.__esModule = true;
//Link State Routing by Bo Li
var prompts = require("prompt-sync");
var fs = require("fs");
var prompt = prompts();
var path = 'infile.dat';
var Nodee = /** @class */ (function () {
    function Nodee(routerID, cost) {
        this.routerID = routerID;
        if (cost != undefined) {
            this.cost = cost;
        }
        else {
            this.cost = 1;
        }
        this.next = null;
    }
    return Nodee;
}());
var List = /** @class */ (function () {
    function List(oriRouterID, networkName) {
        this.networkName = networkName;
        this.header = new Nodee(oriRouterID, 0);
    }
    ;
    List.prototype.addLink = function (routerID, cost) {
        var current = this.header;
        while (current.next != null) {
            current = current.next;
        }
        current.next = new Nodee(routerID, cost);
    };
    List.prototype.setCostbyID = function (routerID, cost) {
        var current = this.header.next;
        while (current != null) {
            if (current.routerID == routerID) {
                current.cost = cost;
                return true;
            }
            else {
                current = current.next;
            }
        }
        return false;
    };
    List.prototype.getLinkNodeID = function () {
        var ID = [];
        var current = this.header.next;
        while (current != null) {
            ID.push(current.routerID);
            current = current.next;
        }
        return ID;
    };
    List.prototype.getCostbyID = function (ID) {
        var current = this.header;
        while (current.next != null) {
            current = current.next;
            if (current.routerID === ID) {
                return current.cost;
            }
            else {
                continue;
            }
        }
        return Infinity;
    };
    List.prototype.clone = function () {
        var listClone = new List(this.header.routerID, this.networkName);
        var current1 = this.header;
        var current2 = listClone.header;
        while (current1.next != null) {
            current2.next = new Nodee(current1.next.routerID, current1.next.cost);
            current1 = current1.next;
            current2 = current2.next;
        }
        return listClone;
    };
    return List;
}());
var Router = /** @class */ (function () {
    function Router(ID, network) {
        this.ID = ID;
        this.networkName = network;
        this.drlinkList = new List(ID, network);
        this.lspSequenceNum = 1;
        this.drlinkTick = [];
        this.routerSequenceRecord = [];
        this.drLinkRouters = [];
        this.graph = [];
    }
    Router.prototype.addDirectLink = function (routerID, cost) {
        this.drlinkList.addLink(routerID, cost);
        this.drlinkTick.push([routerID, 0]);
    };
    Router.prototype.getDrRouterClass = function (routers) {
        this.drLinkRouters = [];
        var drlinkRID = this.drlinkList.getLinkNodeID();
        for (var _i = 0, routers_1 = routers; _i < routers_1.length; _i++) {
            var eachrouter = routers_1[_i];
            if (drlinkRID.indexOf(eachrouter.ID) >= 0) {
                this.drLinkRouters.push(eachrouter);
            }
        }
    };
    Router.prototype.originatePacket = function () {
        if (this.state == false)
            return false;
        for (var _i = 0, _a = this.drlinkTick; _i < _a.length; _i++) {
            var each = _a[_i];
            if (++each[1] >= 2) {
                this.drlinkList.setCostbyID(each[0], Infinity);
            }
        }
        var lsp = new LSP(this.ID, this.lspSequenceNum, this.drlinkList, 10);
        this.lspSequenceNum++;
        for (var _b = 0, _c = this.drLinkRouters; _b < _c.length; _b++) {
            var each = _c[_b];
            each.receivePacket(lsp, this.ID);
        }
        return true;
    };
    Router.prototype.receivePacket = function (lsp, forwardRouterID) {
        if (this.state == false)
            return false;
        lsp.TTL -= 1;
        for (var _i = 0, _a = this.drlinkTick; _i < _a.length; _i++) {
            var each = _a[_i];
            if (forwardRouterID === each[0]) {
                each[1] = 0;
                break;
            }
        }
        if (lsp.TTL === 0)
            return true;
        if (this.lspSequenceCheck(lsp.origRouter, lsp.sequence)) {
            var tempList = lsp.list.clone();
            this.updategraph(tempList);
            for (var _b = 0, _c = this.drLinkRouters; _b < _c.length; _b++) {
                var each = _c[_b];
                if (each.ID != forwardRouterID && each.ID != lsp.origRouter) {
                    each.receivePacket(lsp.clone(), this.ID);
                }
            }
        }
        else {
            return true;
        }
        return true;
    };
    Router.prototype.updategraph = function (list) {
        for (var i = 0; i < this.graph.length; i++) {
            if (this.graph[i].header.routerID === list.header.routerID) {
                this.graph[i] = list;
                return true;
            }
        }
        this.graph.push(list);
        return true;
    };
    Router.prototype.lspSequenceCheck = function (origRouterID, sequence) {
        for (var _i = 0, _a = this.routerSequenceRecord; _i < _a.length; _i++) {
            var each = _a[_i];
            if (each[0] === origRouterID && each[1] < sequence) {
                each[1] = sequence;
                return true;
            }
            else if (each[0] === origRouterID && each[1] >= sequence) {
                return false;
            }
            else {
                continue;
            }
        }
        this.routerSequenceRecord.push([origRouterID, sequence]);
        return true;
    };
    Router.prototype.shutDown = function () {
        this.state = false;
    };
    Router.prototype.resume = function () {
        this.state = true;
    };
    Router.prototype.findlistbyID = function (ID) {
        for (var _i = 0, _a = this.graph; _i < _a.length; _i++) {
            var each = _a[_i];
            if (each.header.routerID === ID) {
                return each;
            }
        }
        throw 'find list by ID error';
    };
    Router.prototype.getTableArrbyID = function (routingTable, ID) {
        for (var _i = 0, routingTable_1 = routingTable; _i < routingTable_1.length; _i++) {
            var each = routingTable_1[_i];
            if (each[0] === ID) {
                return each;
            }
        }
        throw 'get table arr by ID err';
    };
    Router.prototype.updateRoutingTable = function () {
        var start = this.ID;
        var tempRoutingTable = [];
        this.networkNameMap = [[this.drlinkList.header.routerID, this.drlinkList.networkName]];
        tempRoutingTable.push([this.drlinkList.header.routerID, this.drlinkList.header.routerID, this.drlinkList.header.cost]);
        for (var _i = 0, _a = this.graph; _i < _a.length; _i++) {
            var each = _a[_i];
            this.networkNameMap.push([each.header.routerID, each.networkName]);
            tempRoutingTable.push([each.header.routerID, null, Infinity]);
        }
        var drlinkRID = this.drlinkList.getLinkNodeID();
        for (var _b = 0, drlinkRID_1 = drlinkRID; _b < drlinkRID_1.length; _b++) {
            var each = drlinkRID_1[_b];
            var tempArr1 = this.getTableArrbyID(tempRoutingTable, each);
            tempArr1[1] = each;
            tempArr1[2] = this.drlinkList.getCostbyID(each);
            var S1 = [start,];
            var S2 = [each,];
            var cost1 = this.drlinkList.getCostbyID(each);
            // console.log(cost1);
            do {
                var tempID = S2.shift();
                S1.push(tempID);
                var tempList = this.findlistbyID(tempID);
                var cost2 = this.getCostFromTablebyID(tempRoutingTable, tempID);
                var current = tempList.header;
                while (current != null) {
                    var tempTotalCost = cost2 + current.cost;
                    var tempArr2 = this.getTableArrbyID(tempRoutingTable, current.routerID);
                    if (tempArr2[2] > tempTotalCost) {
                        tempArr2[2] = tempTotalCost;
                        tempArr2[1] = each;
                    }
                    if (S2.indexOf(current.routerID) === -1 && S1.indexOf(current.routerID) === -1) {
                        S2.push(current.routerID);
                    }
                    current = current.next;
                }
            } while (S2.length > 0);
        }
        this.temptable = tempRoutingTable;
    };
    Router.prototype.getCostFromTablebyID = function (tempRoutingTable, ID) {
        for (var _i = 0, tempRoutingTable_1 = tempRoutingTable; _i < tempRoutingTable_1.length; _i++) {
            var each = tempRoutingTable_1[_i];
            if (each[0] === ID) {
                return each[2];
            }
        }
        throw 'err';
    };
    Router.prototype.getnetworknamebyID = function (ID) {
        for (var _i = 0, _a = this.networkNameMap; _i < _a.length; _i++) {
            var each = _a[_i];
            if (each[0] === ID) {
                return each[1];
            }
        }
        throw 'getnetworknamebyID err';
    };
    Router.prototype.printRoutingTable = function () {
        for (var _i = 0, _a = this.temptable; _i < _a.length; _i++) {
            var each = _a[_i];
            var destination_network = this.getnetworknamebyID(each[0]);
            var outgoinglink_network = this.getnetworknamebyID(each[1]);
            console.log(destination_network + ',  ' + outgoinglink_network);
        }
    };
    return Router;
}());
var LSP = /** @class */ (function () {
    function LSP(oriRouter, sequence, list, TTL) {
        this.TTL = TTL;
        this.origRouter = oriRouter;
        this.sequence = sequence;
        this.list = list.clone();
    }
    LSP.prototype.clone = function () {
        var lspClone = new LSP(this.origRouter, this.sequence, this.list, this.TTL);
        return lspClone;
    };
    return LSP;
}());
function readFromInfile() {
    var routers = [];
    var st = fs.readFileSync(path, 'utf8').replace(/\r/g, '').split('\n');
    var sr = [];
    for (var _i = 0, st_1 = st; _i < st_1.length; _i++) {
        var each = st_1[_i];
        var sn = each.replace(/\s+/g, ' ').split(' ');
        sr.push(sn);
    }
    for (var i = 0; i < sr.length; i++) {
        if (sr[i][0] != '') {
            // console.log('readFromFile');
            var tempRouter = new Router(parseInt(sr[i][0]), sr[i][1]);
            routers.push(tempRouter);
        }
        else if (sr[i][0] == '') {
            var tempRouter = routers[routers.length - 1];
            if (sr[i].length === 2) {
                tempRouter.addDirectLink(parseInt(sr[i][1]));
            }
            else if (sr[i].length === 3) {
                tempRouter.addDirectLink(parseInt(sr[i][1]), parseInt(sr[i][2]));
            }
            else {
                throw 'wrong numbers of parameter';
            }
        }
        else {
            throw 'wrong format of infile.dat';
        }
    }
    return routers;
}
function initiateBoradcast(routers) {
    for (var _i = 0, routers_2 = routers; _i < routers_2.length; _i++) {
        var eachrouter = routers_2[_i];
        eachrouter.getDrRouterClass(routers);
    }
    for (var _a = 0, routers_3 = routers; _a < routers_3.length; _a++) {
        var eachrouter = routers_3[_a];
        eachrouter.originatePacket();
    }
    for (var _b = 0, routers_4 = routers; _b < routers_4.length; _b++) {
        var eachrouter = routers_4[_b];
        eachrouter.updateRoutingTable();
    }
}
function printRoutingTable(routers, input) {
    console.log('printRT' + input);
    var inputArr = input.split(' ');
    var router = findrouterbyname(routers, inputArr[1]);
    router.printRoutingTable();
}
function shutdownRouter(routers, input) {
    console.log('shutdown' + input);
    var inputArr = input.split(' ');
    var router = findrouterbyname(routers, inputArr[1]);
    router.shutDown();
}
function startUpRouter(routers, input) {
    console.log('start up' + input);
    var inputArr = input.split(' ');
    var router = findrouterbyname(routers, inputArr[1]);
    router.resume();
}
function findrouterbyname(routers, name) {
    // console.log(routers,name);
    for (var _i = 0, routers_5 = routers; _i < routers_5.length; _i++) {
        var each = routers_5[_i];
        if (each.networkName == name) {
            return each;
        }
    }
    throw 'findrouterbyname err';
}
function main() {
    var routers = readFromInfile();
    var notQuit = true;
    do {
        console.log('Enter "C" to continue;');
        console.log('Enter "Q" to quit this program;');
        console.log('Enter "P" followed by the router ID with a blank between to print the routing tableof a router;');
        console.log('Enter "S" followed by the router ID with a blank between to shut down the router;');
        console.log('Enter "T" followed by the router ID with a blank between to start up a router.');
        var input = prompt('>>');
        input = input.trim().replace(/\s+/g, ' ');
        switch (input[0]) {
            case 'Q':
                console.log('Goodbye!');
                notQuit = false;
                break;
            case 'C':
                initiateBoradcast(routers);
                break;
            case 'P':
                printRoutingTable(routers, input);
                break;
            case 'S':
                shutdownRouter(routers, input);
                break;
            case 'T':
                startUpRouter(routers, input);
                break;
            default:
                console.log('Can not find commond, please input the correct commond.');
        }
    } while (notQuit);
}
main();
