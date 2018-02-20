//Link State Routing by Bo Li
import * as prompts from 'prompt-sync';
import * as fs from 'fs';
const prompt = prompts();
const path = 'infile.dat';

class Nodee {
    public routerID: number;
    public cost: number;
    public next: Nodee|null;

    constructor (routerID: number, cost?: number) {
        this.routerID = routerID;
        if (cost != undefined) {
            this.cost = cost;
        } else {
            this.cost = 1;
        }
        this.next = null;
    }
}

class List {
    public networkName: string;
    public header: Nodee;

    constructor (oriRouterID:number, networkName: string) {
        this.networkName = networkName;
        this.header = new Nodee(oriRouterID, 0);
    };

    public addLink (routerID: number, cost?: number): void {
        let current = this.header;
        while (current.next != null) {
            current = current.next;
        }
        current.next = new Nodee(routerID, cost);
    }
    public setCostbyID (routerID: number, cost: number): boolean {
        let current = this.header.next;
        while (current != null) {
            if (current.routerID == routerID) {
                current.cost = cost;
                return true;
            } else {
                current = current.next;
            }
        }
        return false;
    }
    public getLinkNodeID (): number[] {
        let ID: number[] = [];
        let current = this.header.next;
        while (current != null) {
            ID.push(current.routerID);
            current = current.next;
        }
        return ID;
    }
    public getCostbyID(ID: number): number {
        let current = this.header;
        while (current.next != null) {
            current = current.next;
            if (current.routerID === ID) {
                return current.cost;
            } else {
                continue;
            }
        }
        return Infinity;
    }
    public clone (): List {
        let listClone = new List(this.header.routerID, this.networkName);
        let current1 = this.header;
        let current2 = listClone.header;
        while (current1.next != null) {
            current2.next = new Nodee(current1.next.routerID, current1.next.cost);
            current1 = current1.next;
            current2 = current2.next;
        }
        return listClone;
    }
}


class Router {
    public ID: number;
    public networkName: string;
    private state: boolean;
    private lspSequenceNum: number;

    private graph: List[];
    public drlinkList: List;
    public drlinkTick: number[][];//[router ID, tick]
    public routerSequenceRecord: number[][];
    public drLinkRouters: Router[];
    public networkNameMap: any[];
    public temptable: number[][];

    constructor (ID: number, network: string) {
        this.ID = ID;
        this.networkName = network;
        this.drlinkList = new List (ID, network);
        this.lspSequenceNum = 1;
        this.drlinkTick = [];
        this.routerSequenceRecord = [];
        this.drLinkRouters = [];
        this.graph = [];
    }

    public addDirectLink (routerID: number, cost?: number) {
            this.drlinkList.addLink(routerID,cost);
            this.drlinkTick.push([routerID, 0]);
    }

    public getDrRouterClass (routers: Router[]): void{
        this.drLinkRouters = [];
        let drlinkRID = this.drlinkList.getLinkNodeID();
        for (let eachrouter of routers) {
            if (drlinkRID.indexOf(eachrouter.ID) >= 0) {
                this.drLinkRouters.push(eachrouter);
            }
        }
    }

    public originatePacket (): boolean {
        if (this.state == false) return false;

        for (let each of this.drlinkTick) {
            if (++each[1] >= 2) {
                this.drlinkList.setCostbyID(each[0], Infinity);
            }
        }
        let lsp = new LSP (this.ID, this.lspSequenceNum, this.drlinkList, 10);
        this.lspSequenceNum++;
        for (let each of this.drLinkRouters) {
            each.receivePacket(lsp, this.ID);
        }
        return true;
    }
    public receivePacket (lsp: LSP, forwardRouterID: number):boolean {
        if (this.state == false) return false;
        lsp.TTL -= 1;
        for (let each of this.drlinkTick) {
            if (forwardRouterID === each[0]) {
                each[1] = 0;
                break;
            }
        }
        if (lsp.TTL === 0) return true;
        if (this.lspSequenceCheck(lsp.origRouter, lsp.sequence)) {
            let tempList = lsp.list.clone();
            this.updategraph(tempList);
            for (let each of this.drLinkRouters) {
                if (each.ID != forwardRouterID && each.ID != lsp.origRouter) {
                    each.receivePacket(lsp.clone(), this.ID);
                }
            }
        } else {
            return true;
        }
        return true;
    }
    private updategraph (list: List): boolean {
        for (let i = 0; i < this.graph.length; i++) {
            if (this.graph[i].header.routerID === list.header.routerID) {
                this.graph[i] = list;
                return true;
            }
        }
        this.graph.push(list);
        return true;
    }
    private lspSequenceCheck (origRouterID: number, sequence: number): boolean {
        for (let each of this.routerSequenceRecord) {
            if (each[0] === origRouterID && each[1] < sequence) {
                each[1] = sequence;
                return true;
            } else if (each[0] === origRouterID && each[1] >= sequence) {
                return false;
            } else {
                continue;
            }
        }
        this.routerSequenceRecord.push([origRouterID, sequence],);
        return true;
    }
    public shutDown (): void {
        this.state = false;
    }
    public resume (): void {
        this.state = true;
    }
    private findlistbyID (ID:number): List {
        for (let each of this.graph) {
            if (each.header.routerID === ID) {
                return each;
            }
        }
        throw 'find list by ID error';
    }
    private getTableArrbyID(routingTable: any[], ID: number): any[] {
        for (let each of routingTable) {
            if (each[0] === ID) {
                return each;
            }
        }
        throw 'get table arr by ID err';
    }
    
    public updateRoutingTable () {
        let start = this.ID;
        let tempRoutingTable: any[][] = [];
        this.networkNameMap = [[this.drlinkList.header.routerID, this.drlinkList.networkName]];
        tempRoutingTable.push([this.drlinkList.header.routerID,this.drlinkList.header.routerID, this.drlinkList.header.cost]);
        for (let each of this.graph) {
            this.networkNameMap.push([each.header.routerID, each.networkName]);
            tempRoutingTable.push([each.header.routerID, null, Infinity]);
        }

        let drlinkRID = this.drlinkList.getLinkNodeID();

        for (let each of drlinkRID) {
            let tempArr1 = this.getTableArrbyID(tempRoutingTable, each);
            tempArr1[1] = each;
            tempArr1[2] = this.drlinkList.getCostbyID(each);
            let S1: number[] = [start,];
            let S2: number[] = [each,];
            let cost1 = this.drlinkList.getCostbyID(each);
            // console.log(cost1);
            do {
                let tempID = S2.shift() as number;
                S1.push(tempID);
                let tempList: List = this.findlistbyID(tempID);
                let cost2 = this.getCostFromTablebyID(tempRoutingTable, tempID);
                let current = tempList.header;
                
                while (current != null) {
                    let tempTotalCost = cost2 + current.cost;
                    let tempArr2 = this.getTableArrbyID(tempRoutingTable, current.routerID);
                    if (tempArr2[2] > tempTotalCost) {
                        tempArr2[2] = tempTotalCost;
                        tempArr2[1] = each;
                    }
                    if (S2.indexOf(current.routerID) === -1 && S1.indexOf(current.routerID) === -1 ) {
                        S2.push(current.routerID);
                    }
                    current = current.next as Nodee;
                }
            } while (S2.length > 0);
        }
        this.temptable = tempRoutingTable;
    }
    
    private getCostFromTablebyID (tempRoutingTable: any[], ID: number): number {
        for (let each of tempRoutingTable) {
            if (each[0] === ID) {
                return each[2];
            }
        }
        throw 'err';
    }

    private getnetworknamebyID (ID: number): string {
        for (let each of this.networkNameMap) {
            if (each[0] === ID) {
                return each[1];
            }
        }
        throw 'getnetworknamebyID err';
    }
    public printRoutingTable () {
        for (let each of this.temptable) {
            let destination_network = this.getnetworknamebyID(each[0]);
            let outgoinglink_network = this.getnetworknamebyID(each[1]);
            console.log(destination_network+',  '+outgoinglink_network);
        }
    }

}

class LSP {
    public TTL: number;
    public origRouter: number;
    public sequence: number;
    public list: List;
    constructor (oriRouter: number, sequence: number, list: List, TTL: number) {
        this.TTL = TTL;
        this.origRouter = oriRouter;
        this.sequence = sequence;
        this.list = list.clone();
    }
    public clone(): LSP {
        let lspClone = new LSP(this.origRouter, this.sequence, this.list, this.TTL);
        return lspClone;
    }
}

function readFromInfile (): Router[] {
    let routers: Router[] = [];
    let st = fs.readFileSync (path,'utf8').replace(/\r/g,'').split('\n');
    let sr: string[][] = [];
    for (let each of st) {
        let sn = each.replace(/\s+/g,' ').split(' ');
        sr.push(sn);
    }
    for (let i = 0; i < sr.length; i++) {
        if (sr[i][0] != '') {
            // console.log('readFromFile');
            let tempRouter = new Router(parseInt(sr[i][0]), sr[i][1]);
            routers.push(tempRouter);
        } else if (sr[i][0] == '') {
            let tempRouter = routers[routers.length-1];
            if (sr[i].length === 2) {
                tempRouter.addDirectLink(parseInt(sr[i][1]));
            } else if (sr[i].length === 3) {
                tempRouter.addDirectLink(parseInt(sr[i][1]), parseInt(sr[i][2]));
            } else {
                throw 'wrong numbers of parameter';
            }
        } else {
            throw 'wrong format of infile.dat';
        }
    }
    return routers;
}

function initiateBoradcast (routers: Router[]): void {
    for (let eachrouter of routers) {
        eachrouter.getDrRouterClass(routers);
    }
    for (let eachrouter of routers) {
        eachrouter.originatePacket();
    }
    for (let eachrouter of routers) {
        eachrouter.updateRoutingTable();
    }
}

function printRoutingTable (routers: Router[], input: string): void {
    console.log('printRT'+input);
    let inputArr = input.split(' ');
    let router = findrouterbyname(routers, inputArr[1]);
    router.printRoutingTable();
}

function shutdownRouter (routers: Router[], input: string): void {
    console.log('shutdown'+input);
    let inputArr = input.split(' ');
    let router = findrouterbyname(routers, inputArr[1]);
    router.shutDown();
}

function startUpRouter (routers: Router[], input: string): void {
    console.log('start up' + input);
    let inputArr = input.split(' ');
    let router = findrouterbyname(routers, inputArr[1]);
    router.resume();
}

function findrouterbyname (routers: Router[], name: string) : Router {
    for (let each of routers) {
        if (each.networkName == name) {
            return each;
        }
    }
    throw 'findrouterbyname err';
}

function main (): void {
    let routers = readFromInfile();
    let notQuit: boolean = true;

    do {
        console.log('Enter "C" to continue;');
        console.log('Enter "Q" to quit this program;');
        console.log('Enter "P" followed by the router ID with a blank between to print the routing tableof a router;');
        console.log('Enter "S" followed by the router ID with a blank between to shut down the router;');
        console.log('Enter "T" followed by the router ID with a blank between to start up a router.');
        let input = prompt('>>');
        input = input.trim().replace(/\s+/g, ' ');
        switch (input[0]) {
            case 'Q': 
                console.log('Goodbye!');
                notQuit = false;
                break;
            case 'C':
                initiateBoradcast (routers);
                break;
            case 'P':
                printRoutingTable (routers, input);
                break;
            case 'S':
                shutdownRouter (routers, input);
                break;
            case 'T':
                startUpRouter (routers, input);
                break;
            default:
                console.log('Can not find commond, please input the correct commond.');
        }
    } while (notQuit);

} 


main();
