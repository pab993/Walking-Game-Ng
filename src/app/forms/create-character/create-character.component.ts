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

  constructor(private fb: FormBuilder, private walkgameService: WalkgameService, private errorModalService: ErrorModalService, private genericModalService: GenericModalService) {
    this.createCharacterForm = fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(26)]],
    });

  }

  onSubmit(): void {
    this.createCharacterForm.markAllAsTouched();
  
    if (!this.createCharacterForm.valid) {
      return;
    }
  
    this.isSubmitting = true;
  
    this.walkgameService.createNewPlayer(this.createCharacterForm.value).pipe(
      switchMap(() => this.walkgameService.getCurrentGame()),
      catchError((err) => {
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
  }
  
  private handleError(message: string): void {
    this.isSubmitting = false;
    this.errorModalService.openModal(message);
  }
}
