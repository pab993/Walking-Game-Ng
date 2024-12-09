import { CreateCharacterComponent } from '../forms/create-character/create-character.component';
import { GenericModalService } from '../services/generic-modal.service';
import { WalkgameService } from './../services/walkgame.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.css'
})
export class CharacterListComponent {

  characterList: String[] = [];

  constructor(private walkgameService: WalkgameService, private genericModalService: GenericModalService){
    const dataPlayers = walkgameService.getGameData();
    this.characterList = dataPlayers?.players;
  }

  openModalPlayerForm(): void {
    this.genericModalService.setComponent(CreateCharacterComponent);
    this.genericModalService.openModal("Crea a tu personaje");
  }

}
