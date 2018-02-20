import * as fs from 'fs';
import * as rls from 'readline-sync';
import * as readline from 'readline';

class Game {
    public player_num: number;
    public board_size: number;
    public win_count: number;
    private symbol_table: string = 'XOABCDEFGHIJKLMNPQRSTUVWYZ';
    
    public current_player: number;
    public board: string[][];
    

    public check_win_possible (): boolean {

        return true;
    }

    public game_render (): void {

    }

    public save_game (): void {

    }

    public resume_game () {

    }

}


// let sinput = rls.question('input', {limit:['frank', 'lee']});
// console.log(sinput);
// let ip = rls.question('player number: ',{limit: function (input) {
//         let num = parseInt(input);

//         return true;
// },limitMessage: 'please input valid number.'});
// console.log(ip);
let input;
do {
    input = rls.question('>:');
    console.log(Number(input));
} while (input != 'quit');

