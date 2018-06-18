"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline-sync");
var fs = require("fs");
//Normalize the string, remove the punctuations and remove additional spaces
function normalize(str) {
    str = str.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()'"]/g, '');
    str = str.replace(/\s{1,}/g, ' ');
    return str;
}
//read file and normalize the string, remove the punctuations and remove additional spaces
function normalizeReadFile(path) {
    var text = fs.readFileSync(path, 'utf-8').replace(/\r+/g, '').replace(/\t+/g, '\t').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'"]/g, '').split(/\n+/g);
    var textArr = [];
    for (var i = 0; i < text.length; i++) {
        if (text[i].match(/\S+/g)) {
            var subtext = text[i].split(/\t+/g);
            var subtextArr = [];
            for (var j = 0; j < subtext.length; j++) {
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
var TrieNode = /** @class */ (function () {
    function TrieNode(value, isWordEnd) {
        this.children = {};
        this.prewords = '';
        this.value = value;
        this.isWordEnd = isWordEnd;
        this.primaryIndex = 0;
    }
    return TrieNode;
}());
//trie class
var Trie = /** @class */ (function () {
    function Trie() {
        this.freqTable = [];
        this.root = new TrieNode(null, false);
        var companiesArr = normalizeReadFile('companies.dat');
        this.createTrie(companiesArr);
    }
    //create trie from companies.dat file
    Trie.prototype.createTrie = function (companiesArr) {
        this.freqTable = [];
        for (var i = 0; i < companiesArr.length; i++) {
            this.freqTable[i] = [];
            this.freqTable[i][0] = companiesArr[i][0];
            this.freqTable[i][1] = 0;
            var current = this.insert(companiesArr[i][0]);
            current.primaryIndex = i;
            for (var j = 1; j < companiesArr[i].length; j++) {
                var current_1 = this.insert(companiesArr[i][j]);
                current_1.primaryIndex = i;
            }
        }
    };
    //add a word to the trie
    Trie.prototype.insert = function (str) {
        var current = this.root;
        for (var i = 0; i < str.length; i++) {
            var char = str[i];
            if (!(char in current.children) && i != str.length - 1) {
                current.children[char] = new TrieNode(char, false);
                current.children[char].prewords = current.prewords + char;
            }
            else if (!(char in current.children) && i === str.length - 1) {
                current.children[char] = new TrieNode(char, true);
                current.children[char].prewords = current.prewords + char;
            }
            else if (char in current.children && i === str.length - 1) {
                current.children[char].isWordEnd = true;
            }
            current = current.children[char];
        }
        return current;
    };
    //return the pointer if find the word or undefined if not
    Trie.prototype.findNode = function (str, current) {
        var returnValue;
        for (var i = 0; i < str.length; i++) {
            var char = str[i];
            if (!(char in current.children)) {
                return current.children[char];
            }
            else {
                current = current.children[char];
            }
        }
        return current;
    };
    //calculate the relevance of each name and the total hit and total relevance as well
    Trie.prototype.calculateRelevance = function (totalWords) {
        var totalHit = 0;
        for (var i = 0; i < this.freqTable.length; i++) {
            totalHit += this.freqTable[i][1];
            var rel = ((this.freqTable[i][1] / totalWords) * 100).toFixed(4);
            this.freqTable[i][2] = rel;
        }
        var totalRel = ((totalHit / totalWords) * 100).toFixed(4);
        this.freqTable.push(['Total', totalHit, totalRel]);
    };
    return Trie;
}());
//article class to store the article read from standard input
var Article = /** @class */ (function () {
    function Article() {
        var flag = true;
        this.text = [];
        this.matchMap = [];
        while (flag) {
            var tempText = readline.question('Please input the article: ');
            if (!this.isEnd(tempText)) {
                tempText = normalize(tempText);
                this.text = tempText.split(' ');
            }
            else {
                flag = false;
            }
        }
    }
    //do the main function of counting hit and discriminate the articles in or out the company names
    Article.prototype.matchWords = function (trie) {
        this.matchMap = new Array(trie.freqTable.length);
        for (var i = 0; i < this.matchMap.length; i++) {
            this.matchMap[i] = [];
        }
        for (var i = 0; i < this.text.length; i++) {
            var currentNode = trie.root;
            var j = i;
            var temp = void 0;
            var hitList = [];
            do {
                temp = trie.findNode(this.text[j], currentNode);
                if (!temp)
                    break;
                else if (temp.children[' '] != undefined && temp.isWordEnd == true) {
                    if (hitList.indexOf(temp.primaryIndex) < 0) {
                        hitList.push(temp.primaryIndex);
                    }
                    this.matchMap[temp.primaryIndex].push([i, j]);
                    j++;
                    currentNode = temp.children[' '];
                }
                else if (temp.children[' '] != undefined && temp.isWordEnd == false) {
                    j++;
                    currentNode = temp.children[' '];
                }
                else if (temp.children[' '] == undefined && temp.isWordEnd == true) {
                    if (hitList.indexOf(temp.primaryIndex) < 0) {
                        hitList.push(temp.primaryIndex);
                    }
                    this.matchMap[temp.primaryIndex].push([i, j]);
                    break;
                }
                else if (temp.children[' '] == undefined && temp.isWordEnd == false) {
                    break;
                }
            } while (j < this.text.length);
            for (var k = 0; k < hitList.length; k++) {
                trie.freqTable[hitList[k]][1]++;
            }
        }
    };
    //return true if it is a string consists entirely of a period symbol
    Article.prototype.isEnd = function (text) {
        for (var i = 0; i < text.length; i++) {
            if (text[i] == '.') {
                continue;
            }
            else {
                return false;
            }
        }
        return true;
    };
    //return true if it is not artcle
    Article.prototype.isNotArt = function (str) {
        str = str.replace(/(\bA\b|\ba\b|\bAn\b|\ban\b|\bThe\b|\bthe\b|\bAnd\b|\band\b|\bOr\b|\bor\b|\bBut\b|\bbut\b)/g, '');
        if (str == '')
            return false;
        else
            return true;
    };
    //return ture if it belong to the company names
    Article.prototype.belongToCompanyName = function (index) {
        for (var i = 0; i < this.matchMap.length; i++) {
            for (var j = 0; j < this.matchMap[i].length; j++) {
                if (index >= this.matchMap[i][j][0] && index <= this.matchMap[i][j][1])
                    return true;
                else
                    continue;
            }
        }
        return false;
    };
    Object.defineProperty(Article.prototype, "totalWords", {
        //count the total words ignore the article not part of the company names
        get: function () {
            var totalWords = 0;
            for (var i = 0; i < this.text.length; i++) {
                if (this.belongToCompanyName(i)) {
                    totalWords++;
                }
                else if (!this.belongToCompanyName(i) && this.isNotArt(this.text[i])) {
                    totalWords++;
                }
                else {
                    continue;
                }
            }
            return totalWords;
        },
        enumerable: true,
        configurable: true
    });
    return Article;
}());
//logical control and display
function main() {
    var artile = new Article();
    var trie = new Trie();
    artile.matchWords(trie);
    trie.calculateRelevance(artile.totalWords);
    console.log('Company      Hit Count     Relevance');
    for (var _i = 0, _a = trie.freqTable; _i < _a.length; _i++) {
        var i = _a[_i];
        console.log(i[0] + '      ' + i[1] + '        ' + i[2] + '%');
    }
    console.log('Total Words:  ' + artile.totalWords);
}
main();
