import { WalkgameService } from './../../services/walkgame.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericModalService } from '../../services/generic-modal.service';

@Component({
  selector: 'app-choose-character',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './choose-character.component.html',
  styleUrl: './choose-character.component.css'
})
export class ChooseCharacterComponent {

  chooseCharacterForm: FormGroup;
  characters: any[] = [];

  constructor(private fb: FormBuilder, private walkgameService: WalkgameService, private genericModalService: GenericModalService) {
    this.chooseCharacterForm = fb.group({
      character: ['', Validators.required]
    });

    this.walkgameService.gameData$.subscribe({
      next: (gameData) => {
        this.characters = gameData.players;
      }
    });

  }

  onSubmit(): void{
    this.chooseCharacterForm.markAllAsTouched();
    if (!this.chooseCharacterForm.valid) {
      return;
    }
    this.walkgameService.setPlayerData(this.chooseCharacterForm.value);
    this.genericModalService.closeModal();
  }

}
