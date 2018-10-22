import { Component, Inject } from '@angular/core';
import { GameService } from '../../game.service';
import { Player } from '../../player';
import { Block } from '../../block';
import { Http } from '@angular/http';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  lock = false;
  gameId: string = "";
  constructor(public gs: GameService, private http: Http, @Inject('BASE_URL') private baseUrl: string) {

  }

  newGame() {
    this.gs.freeBlocksRemaining = 9;
    this.gs.initBlocks();
    this.lock = false;
    this.gs.turn = 0;
    this.http.get(this.baseUrl + "api/game/new").subscribe(result => {
      this.gameId = result.text("legacy");
    });
  }

  resetGame(event: any) {
    location.reload();
    event.preventDefault();
  }

  playerClick(i: number) {
    if (this.gs.blocks[i].free === false || this.lock) { // If Block is already fill, don't Do anything
      return;
    }

    this.gs.freeBlocksRemaining -= 1; // Reduce no. of free blocks after each selection

    this.http.post(this.baseUrl + 'api/game/play',
      {
        "GameId": this.gameId,
        "Turn": this.gs.turn === 0 ? "X" : "V",
        "Cell": "C" + (i + 1)
      }).subscribe(result => {
        console.log(result.json());
      });

    if (this.gs.freeBlocksRemaining <= 0) {

      this.gs.draw += 1;
      this.lock = true;
      alert("Game Draw");
      this.newGame();
      return;
    }


    this.gs.blocks[i].free = false;
    debugger;
    if (this.gs.turn === 0) { // Player1 Turn
      this.gs.blocks[i].setValue("tick");
    } else { // Bot Turn
      this.gs.blocks[i].setValue("cross");
    }

    var complete = this.gs.blockSetComplete();

    if (complete === false) {
      this.changeTurn();
      return;

    } else {
      this.lock = true;
      this.gs.players[this.gs.turn].score += 1;

      alert("Winer: Player" + (this.gs.turn + 1));

      this.newGame();
      return;
    }

  }


  botTurn() {

    if (this.gs.freeBlocksRemaining <= 0) {
      return;
    }

    let bot_selected = this.gs.figureBotMove() - 1;

    if (this.gs.blocks[bot_selected].free === true) {
      this.playerClick(bot_selected);
    } else {
      this.botTurn();
      return;
    }

  }


  changeTurn() {
    let player = this.gs.changeTurn();

    if (player === 1) { // Bot Turn
      this.botTurn();

    }
  }
}
