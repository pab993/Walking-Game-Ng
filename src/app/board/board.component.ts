import { ErrorModalService } from './../services/error-modal.service';
import { GenericModalService } from './../services/generic-modal.service';
import { Component } from '@angular/core';
import { WalkgameService } from '../services/walkgame.service';
import { CommonModule } from '@angular/common';
import { CharacterListComponent } from "../character-list/character-list.component";
import { CreateCharacterComponent } from '../forms/create-character/create-character.component';
import { catchError, EMPTY } from 'rxjs';

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
  blockMoves: boolean = false;
  rows: number[] = [];
  cols: number[] = [];

  constructor(private walkgameService: WalkgameService, private genericModalService: GenericModalService, private errorModalService: ErrorModalService){}

  ngOnInit(): void {
    this.walkgameService.gameData$.subscribe({
      next: (gameData) => {
        this.currentGame = gameData;
        this.generateTable();
      }
    });

    this.walkgameService.playerData$.subscribe({
      next: (playerData) => {
        this.currentCharacter = playerData ? {
          ...playerData,
          selected: false 
        } : null;
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

  isCellMatchingPosition(row: number, col: number): boolean {
    if (!this.currentCharacter || !this.currentCharacter.character || !this.currentCharacter.character.positions) {
      return false;
    }
    
    return this.currentCharacter.character.positions.some(
      (position: any) => 
        position.row === (row - 1) && position.column === (col - 1)
    );
  }

  currentPlayerPosition(row: number, col: number): boolean {
    if (!this.currentCharacter || !this.currentCharacter.character || !this.currentCharacter.character.position) {
      return false;
    }
    
    return this.currentCharacter.character.position.row === (row - 1) && this.currentCharacter.character.position.column === (col - 1);
  }

  moveOrSelect(event: Event): void{
    const element = event.target as HTMLElement;

    if (element.classList.contains('current-pos')) {
      console.log('El elemento tiene la clase "current-pos"');
      this.currentCharacter = {
        ...this.currentCharacter,
        selected: true
      };
    } else if(!element.classList.contains('current-pos') && !this.blockMoves){
      const dataRow = element.getAttribute('data-row');
      const dataCol = element.getAttribute('data-col');

      const row = dataRow ? parseInt(dataRow) : 0;
      const col = dataCol ? parseInt(dataCol) : 0;
      let moveData = [
        {
          "operationType": 0,
          "path": "/Position",
          "op": "replace",
          "from": "string",
          "value": {"Row": (row - 1), "Column": (col - 1)}
        }
      ];

      this.blockMoves = true;

      this.walkgameService.movePlayerGame(moveData, this.currentCharacter.character.username).pipe(
        catchError((err) => {
          this.errorModalService.openModal("Movimiento inválido, debe ser una posición colindante.");
          this.blockMoves = false;
          return EMPTY;
        })
      ).subscribe({
        next: () => {this.blockMoves = false},
        error: () => {
          this.errorModalService.openModal("Algo ha falldo al intentar mover de posición.");
          this.blockMoves = false;
        }
      });
    }
  }

  onCloseSelected(): void{
    this.currentCharacter = {
      ...this.currentCharacter,
      selected: false
    };
  }

  getRowLetter(rowIndex: number): string {
    return String.fromCharCode(64 + rowIndex);
  }

  getPositions(): string {
    const getRowLetter = (row: number): string => {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      return alphabet[row] || '?';
    };
  
    if(this.currentCharacter){
      const positions = this.currentCharacter.character.positions.map((position: any) => {
        const rowLetter = getRowLetter(position.row);
        return `${rowLetter}${position.column + 1}`;
      });
    
      return `Movimientos: ${positions.join('-')}`;
    }else{
      return "";
    }
    
  }

}
