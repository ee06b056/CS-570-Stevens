import * as readline from 'readline-sync';
import * as fs from 'fs';

//Normalize the string, remove the punctuations and remove additional spaces
function normalize (str: string): string {
    str = str.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()'"]/g,'');
    str = str.replace(/\s{1,}/g, ' ');
    return str;
}
//read file and normalize the string, remove the punctuations and remove additional spaces
function normalizeReadFile(path: string): string[][] {
    let text = fs.readFileSync(path, 'utf-8').replace(/\r+/g,'').replace(/\t+/g,'\t').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'"]/g,'').split(/\n+/g);
    let textArr: string[][] = [];
    for (let i = 0; i < text.length; i++) {
        if (text[i].match(/\S+/g)) {
            let subtext = text[i].split(/\t+/g);
            let subtextArr: string[] = [];
            for (let j = 0; j < subtext.length; j++) {
                if (subtext[j].match(/\S+/g)) {
                    subtextArr.push(subtext[j]);
                }
            }
            textArr.push(subtextArr);
        }
    }
    return textArr;
}
//single node class
class TrieNode {
    public children:{[type:string]:any} = {};
    public value: string|null;
    public prewords: string = '';
    public isWordEnd: boolean;
    public primaryIndex: number;

    constructor (value: string|null, isWordEnd: boolean) {
        this.value = value;
        this.isWordEnd = isWordEnd;
    }
}
//trie class
class Trie {
    public root: TrieNode;
    public freqTable: any[][];

    constructor () {
        this.root = new TrieNode (null, false);
        let companiesArr: string[][] = normalizeReadFile('companies.dat');
        this.createTrie(companiesArr);
    }

    //create trie from companies.dat file
    private createTrie (companiesArr: string[][]): void {
        this.freqTable = [];
        for (let i = 0; i < companiesArr.length; i++) {
            this.freqTable[i] = [];
            this.freqTable[i][0] = companiesArr[i][0];
            this.freqTable[i][1] = 0;
            let current = this.insert(companiesArr[i][0]);
            current.primaryIndex = i;
            for (let j = 1; j < companiesArr[i].length; j++) {
                let current = this.insert(companiesArr[i][j]);
                current.primaryIndex = i;
            }
        }
    }
    //add a word to the trie
    private insert (str: string):TrieNode {
        let current = this.root;
        for (let i = 0; i < str.length; i++) {
            let char = str[i];
            if (!(char in current.children) && i != str.length-1) {
                current.children[char] = new TrieNode(char, false);
                current.children[char].prewords = current.prewords + char;
            } else if (!(char in current.children) && i === str.length-1) {
                current.children[char] = new TrieNode(char, true);
                current.children[char].prewords = current.prewords + char;
            } else if (char in current.children && i === str.length - 1) {
                current.children[char].isWordEnd = true;
            }
            current = current.children[char];
        }
        return current;
    }
    //return the pointer if find the word or undefined if not
    public findNode (str: string, current: TrieNode): TrieNode {
        let returnValue: TrieNode|null;
        for (let i = 0; i < str.length; i++) {
            let char = str[i];
            if (!(char in current.children)) {
                return current.children[char];
            } else {
                current = current.children[char];
            }
        }
        return current;
    }
    //calculate the relevance of each name and the total hit and total relevance as well
    public calculateRelevance (totalWords: number): void {
        let totalHit = 0;
        for (let i = 0; i < this.freqTable.length; i++) {
            totalHit += this.freqTable[i][1];
            let rel = ((this.freqTable[i][1]/totalWords)*100).toFixed(4);
            this.freqTable[i][2] = rel;
        }
        let totalRel = ((totalHit/totalWords)*100).toFixed(4);
        this.freqTable.push(['Total',totalHit,totalRel]);
    }
}

//article class to store the article read from standard input
class Article {
    public text:string[];
    private matchMap: number[][][];

    constructor () {
        let flag = true;
        this.text = [];
        while(flag) {
            let tempText = readline.question('Please input the article: ');
            if (!this.isEnd(tempText)) {
                tempText = normalize(tempText);
                this.text = tempText.split(' ');
            } else {
                flag = false;
            }
        }
    }
    //do the main function of counting hit and discriminate the articles in or out the company names
    public matchWords (trie: Trie): void {
        this.matchMap = new Array(trie.freqTable.length);
        for (let i = 0; i < this.matchMap.length; i++) {
            this.matchMap[i] = [];
        }
        for (let i = 0; i < this.text.length; i++) {
            let currentNode = trie.root;
            let j = i;
            let temp: TrieNode;
            let hitList: number[] = [];
            do {
                temp = trie.findNode(this.text[j], currentNode);
                if (!temp) break;
                else if (temp.children[' '] != undefined && temp.isWordEnd == true) {
                    if (hitList.indexOf(temp.primaryIndex) < 0) {
                        hitList.push(temp.primaryIndex);
                    }
                    this.matchMap[temp.primaryIndex].push([i,j]);
                    j++;
                    currentNode = temp.children[' '];
                } else if (temp.children[' '] != undefined && temp.isWordEnd == false) {
                    j++;
                    currentNode = temp.children[' '];
                } else if (temp.children[' '] == undefined && temp.isWordEnd == true) {
                    if (hitList.indexOf(temp.primaryIndex) < 0) {
                        hitList.push(temp.primaryIndex);
                    }
                    this.matchMap[temp.primaryIndex].push([i,j]);
                    break;
                }else if (temp.children[' '] == undefined && temp.isWordEnd == false) {
                    break;
                }
            } while (j < this.text.length);  
            for (let k = 0; k < hitList.length; k++) {
                trie.freqTable[hitList[k]][1]++;
            }
        }
    }
    //return true if it is a string consists entirely of a period symbol
    private isEnd (text: string): boolean {
        for (let i = 0; i < text.length; i++) {
            if (text[i] == '.') {
                continue;
            } else {
                return false;
            }
        }
        return true;
    }
    //return true if it is not artcle
    private isNotArt (str: string): boolean {
        str = str.replace(/(\bA\b|\ba\b|\bAn\b|\ban\b|\bThe\b|\bthe\b|\bAnd\b|\band\b|\bOr\b|\bor\b|\bBut\b|\bbut\b)/g,'');
        if (str == '') return false;
        else return true;
    }
    //return ture if it belong to the company names
    private belongToCompanyName (index: number): boolean {
        for (let i = 0; i < this.matchMap.length; i++) {
            for (let j = 0; j < this.matchMap[i].length; j++) {
                if (index >= this.matchMap[i][j][0] && index <= this.matchMap[i][j][1]) return true;
                else continue;
            }
        }
        return false;
    }
    //count the total words ignore the article not part of the company names
    public get totalWords (): number {
        let totalWords = 0;
        for (let i = 0; i < this.text.length; i++) {
            if (this.belongToCompanyName(i)) {
                totalWords++;
            }
            else if (!this.belongToCompanyName(i) && this.isNotArt (this.text[i])) {
                totalWords++;
            } else {
                continue;
            }
        }
        return totalWords;
    }
    
}
//logical control and display
function main () {
    let artile = new Article();
    let trie = new Trie();
    artile.matchWords(trie);
    trie.calculateRelevance(artile.totalWords);
    
    console.log('Company      Hit Count     Relevance');
    for (let i of trie.freqTable) {
        console.log(i[0]+'      '+i[1]+'        '+i[2]+'%');
    }
    console.log('Total Words:  '+artile.totalWords);
}

main();
