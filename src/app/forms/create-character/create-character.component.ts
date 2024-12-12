import { WalkgameService } from './../../services/walkgame.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorModalService } from '../../services/error-modal.service';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { GenericModalService } from '../../services/generic-modal.service';

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
  usernameInUse: boolean = false;
  useravatars: string[] = [
    'assets/player_avatars/player1.svg',
    'assets/player_avatars/player2.svg',
    'assets/player_avatars/player3.svg',
    'assets/player_avatars/player4.svg'
  ];

  constructor(private fb: FormBuilder, private walkgameService: WalkgameService, private errorModalService: ErrorModalService, private genericModalService: GenericModalService) {
    this.createCharacterForm = fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(26)]],
      useravatar: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.createCharacterForm.get('username')?.valueChanges.subscribe(() => {
      this.usernameInUse = false;
    });
  }

  onSubmit(): void {
    this.createCharacterForm.markAllAsTouched();
  
    if (!this.createCharacterForm.valid) {
      return;
    }
  
    this.isSubmitting = true;
    this.usernameInUse = false;
  
    this.walkgameService.createNewPlayer(this.createCharacterForm.value).pipe(
      switchMap(() => this.walkgameService.getCurrentGame()),
      catchError((err) => {
        if (err.status === 500 && err.error.includes('UsernameInUseException')) {
          this.usernameInUse = true;
          this.isSubmitting = false;
          return EMPTY;
        }
        this.handleError("Algo ha ido mal durante la creación del usuario");
        return EMPTY;
      })
    ).subscribe({
      next: () => this.handleSuccess(),
      error: () => this.handleError("Error actualizando la lista de personajes")
    });
  }

  private handleSuccess(): void {
    this.genericModalService.closeModal();
    this.isSubmitting = false;
    this.createCharacterForm.reset();
  }
  
  private handleError(message: string): void {
    this.isSubmitting = false;
    this.errorModalService.openModal(message);
  }

  reset(): void {
    this.createCharacterForm.reset();
  }

}
