import { GenericModalService } from './../services/generic-modal.service';
import { Component } from '@angular/core';
import { WalkgameService } from '../services/walkgame.service';
import { CommonModule } from '@angular/common';
import { CharacterListComponent } from "../character-list/character-list.component";
import { CreateCharacterComponent } from '../forms/create-character/create-character.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, CharacterListComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {

  currentGame: any;
  currentCharacter: any = null;
  rows: number[] = [];
  cols: number[] = [];

  constructor(private walkgameService: WalkgameService, private genericModalService: GenericModalService){
    this.walkgameService.gameData$.subscribe({
      next: (gameData) => {
        this.currentGame = gameData;
        this.generateTable();
        console.log(this.currentGame);
      }
    });
  }

  generateTable(): void {
    this.rows = Array(this.currentGame.height).fill(0).map((_, i) => i + 1);
    this.cols = Array(this.currentGame.width).fill(0).map((_, i) => i + 1);
  }

  openModalPlayerForm(): void {
    this.genericModalService.setComponent(CreateCharacterComponent);
    this.genericModalService.openModal("Crea a tu personaje");
  }
}
