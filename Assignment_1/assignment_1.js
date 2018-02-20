"use strict";
exports.__esModule = true;
var fs = require("fs");
var rls = require("readline-sync");
var Game = /** @class */ (function () {
    function Game() {
        this.symbol_table = 'XOABCDEFGHIJKLMNPQRSTUVWYZ';
        var input = rls.question('Would like to resume a saved game (Y/N)?', { limit: function (input) {
                if (input === 'Y' || input === 'N') {
                    return true;
                }
                return false;
            }, limitMessage: 'Invalid input, please input Y or N.' });
        if (input === 'Y')
            this.resume_game();
        else if (input === 'N')
            this.init_game();
    }
    ;
    Game.prototype.init_game = function () {
        var flag = false;
        do {
            var temp_input = rls.question('Please input the number of players for the game, the maximun number of players is 26: ', { limit: function (input) {
                    var temp = Number(input);
                    if (isNaN(temp))
                        return false;
                    else if (temp < 2 || temp > 26)
                        return false;
                    else
                        return true;
                }, limitMessage: 'Please input numbers between 2 and 26.' });
            this.player_num = Number(temp_input);
            temp_input = rls.question('Please input the size of the board, the maximum size is 999: ', { limit: function (input) {
                    var temp = Number(input);
                    if (isNaN(temp))
                        return false;
                    else if (temp < 2 || temp > 999)
                        return false;
                    else
                        return true;
                }, limitMessage: 'Please input number between 2 and 999.' });
            this.board_size = Number(temp_input);
            temp_input = rls.question('Please input the win sequence count should be: ', { limit: function (input) {
                    var temp = Number(input);
                    if (isNaN(temp))
                        return false;
                    else
                        return true;
                }, limitMessage: 'Please input numbers.' });
            this.win_count = Number(temp_input);
            flag = (this.board_size >= this.win_count && (this.board_size * this.board_size) >= (this.player_num * (this.win_count - 1) + 1));
            if (!flag) {
                console.log('The winning is impossible, please reinput game parameters.');
            }
        } while (!flag);
        console.log(this.player_num, this.board_size, this.win_count);
        this.board = [];
        for (var i = 0; i < this.board_size; i++) {
            this.board[i] = [];
            for (var j = 0; j < this.board_size; j++) {
                this.board[i][j] = ' ';
            }
        }
        this.current_player = 0;
        this.game_render();
    };
    Game.prototype.game_render = function () {
        var output_string = '';
        output_string += '  ';
        for (var i_1 = 0; i_1 < this.board_size; i_1++) {
            output_string = output_string + '  ' + (i_1 + 1) + ' ';
        }
        output_string += '\n';
        for (var i_2 = 0; i_2 < this.board_size - 1; i_2++) {
            output_string = output_string + (i_2 + 1) + '  ';
            for (var j_1 = 0; j_1 < this.board_size - 1; j_1++) {
                output_string = output_string + ' ' + this.board[i_2][j_1] + ' |';
            }
            output_string = output_string + ' ' + this.board[i_2][this.board_size - 1] + ' \n';
            output_string = output_string + '   ';
            for (var j_2 = 0; j_2 < this.board_size - 1; j_2++) {
                output_string = output_string + '---+';
            }
            output_string = output_string + '---\n';
        }
        var i = this.board_size - 1;
        output_string = output_string + this.board_size + '  ';
        for (var j_3 = 0; j_3 < this.board_size - 1; j_3++) {
            output_string = output_string + ' ' + this.board[i][j_3] + ' |';
        }
        var j = this.board_size - 1;
        output_string = output_string + ' ' + this.board[i][j] + ' \n';
        console.log(output_string);
    };
    Game.prototype.save_game = function () {
        var data = {
            player_num: this.player_num,
            board_size: this.board_size,
            win_count: this.win_count,
            current_player: this.current_player,
            board: this.board
        };
        var save_data = JSON.stringify(data);
        console.log(save_data);
        fs.writeFileSync('game.txt', save_data);
    };
    Game.prototype.resume_game = function () {
        var save_data = fs.readFileSync('game.txt', 'utf8');
        if (save_data === undefined) {
            console.log('No saved game. Open a new game.');
            this.init_game();
        }
        else {
            var data = JSON.parse(save_data);
            this.player_num = data.player_num;
            this.board_size = data.board_size;
            this.win_count = data.win_count;
            this.current_player = data.current_player;
            this.board = data.board;
            this.game_render();
        }
    };
    Game.prototype.game_play = function () {
        var x, y;
        do {
            console.log('Player ' + (this.current_player + 1) + ' please input the coordinate of your next move. (' + this.symbol_table[this.current_player] + '). Input quit to exit and save current game.');
            var input = rls.prompt({ limit: function (input) {
                    if (input === 'quit')
                        return true;
                    var temp = input.split(' ');
                    var x_coor = Number(temp[0]), y_coor = Number(temp[1]);
                    if (isNaN(x_coor) || isNaN(y_coor) || temp.length != 2 || x_coor <= 0 || y_coor <= 0)
                        return false;
                    else
                        return true;
                }, limitMessage: 'Invalid input. Please reinput.' });
            if (input === 'quit') {
                this.save_game();
                console.log('Saved game, goodbye !');
                process.exit();
            }
            var temp = input.split(' ');
            x = Number(temp[0]) - 1;
            y = Number(temp[1]) - 1;
            if (x > this.board_size - 1 || y > this.board_size - 1) {
                console.log('Invalid input. Please reinput.');
                continue;
            }
            else if (this.board[x][y] != ' ') {
                console.log('Already occupied. Please reinput.');
                continue;
            }
            else {
                break;
            }
        } while (true);
        this.board[x][y] = this.symbol_table[this.current_player];
        this.game_render();
        return this.check_win(x, y);
    };
    Game.prototype.check_win = function (x, y) {
        var direction = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
        for (var i = 0; i < 4; i++) {
            var count = 1;
            var x_cur = x, y_cur = y;
            do {
                x_cur += direction[i][0];
                y_cur += direction[i][1];
                if (x_cur >= 0 && x_cur <= this.board_size - 1 && y >= 0 && y <= this.board_size - 1 && this.board[x_cur][y_cur] === this.symbol_table[this.current_player]) {
                    count++;
                    continue;
                }
                else {
                    break;
                }
            } while (true);
            x_cur = x, y_cur = y;
            do {
                x_cur += direction[i + 4][0];
                y_cur += direction[i + 4][1];
                if (x_cur >= 0 && x_cur <= this.board_size - 1 && y >= 0 && y <= this.board_size - 1 && this.board[x_cur][y_cur] === this.symbol_table[this.current_player]) {
                    count++;
                    continue;
                }
                else {
                    break;
                }
            } while (true);
            if (count >= this.win_count) {
                console.log(count, this.win_count);
                return 1;
            }
        }
        for (var _i = 0, _a = this.board; _i < _a.length; _i++) {
            var i = _a[_i];
            for (var _b = 0, i_3 = i; _b < i_3.length; _b++) {
                var j = i_3[_b];
                if (j === ' ') {
                    return -1;
                }
            }
        }
        return 0;
    };
    Game.prototype.next_player = function () {
        this.current_player = (this.current_player + 1) % this.player_num;
    };
    return Game;
}());
var game = new Game();
do {
    var result = game.game_play();
    if (result === 1) {
        console.log('Congratulations! The winner is player ' + (game.current_player + 1));
        process.exit();
    }
    else if (result === 0) {
        console.log('Draw game.');
        process.exit();
    }
    else {
        game.next_player();
        continue;
    }
} while (true);
