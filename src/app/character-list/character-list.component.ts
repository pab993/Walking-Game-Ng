import { Subscription } from 'rxjs';
import { CreateCharacterComponent } from '../forms/create-character/create-character.component';
import { GenericModalService } from '../services/generic-modal.service';
import { WalkgameService } from './../services/walkgame.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChooseCharacterComponent } from '../forms/choose-character/choose-character.component';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.css'
})
export class CharacterListComponent {

  characterList: any[] = [];
  private subscription: Subscription;

  constructor(private walkgameService: WalkgameService, private genericModalService: GenericModalService){
    const dataPlayers = walkgameService.getGameData();
    this.characterList = dataPlayers?.players;

    this.subscription = this.walkgameService.gameData$.subscribe(data => {
      if (data?.players) {
        this.characterList = data.players;
      }
    });
  }

  openModalPlayerForm(): void {
    this.genericModalService.setComponent(CreateCharacterComponent);
    this.genericModalService.openModal("Crea a tu personaje");
  }

  chooseCharacter(): void {
    this.genericModalService.setComponent(ChooseCharacterComponent);
    this.genericModalService.openModal("Elige tu personaje");
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
