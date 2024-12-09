import { WalkgameService } from './../../services/walkgame.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorModalService } from '../../services/error-modal.service';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-create-character',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-character.component.html',
  styleUrl: './create-character.component.css'
})
export class CreateCharacterComponent {

  createCharacterForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder, private walkgameService: WalkgameService, private errorModalService: ErrorModalService) {
    this.createCharacterForm = fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(26)]],
    });

  }

  onSubmit(): void{
    this.createCharacterForm.markAllAsTouched();

    if (this.createCharacterForm.valid) {
      this.isSubmitting = true;
      this.walkgameService.createNewPlayer(this.createCharacterForm.value).pipe(
        catchError((err) => {
          this.isSubmitting = false;
          this.errorModalService.openModal("Algo ha ido mal durante la creación del usuario");
          return [];
        })
      ).subscribe({
        next: (response) => {
          this.walkgameService.getCurrentGame();
          this.isSubmitting = false;
        }
      });
    }
  }
}
