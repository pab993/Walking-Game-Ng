import { CommonModule } from '@angular/common';
import { WalkgameService } from './../services/walkgame.service';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, Subscription, switchMap } from 'rxjs';
import { ErrorModalService } from '../services/error-modal.service';
import { BoardComponent } from "../board/board.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, BoardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnDestroy {

  isSubmitting: boolean = false;
  gameData: any = null;
  createGameForm: FormGroup;
  private subscriptions: Subscription = new Subscription();

  constructor(private walkgameService: WalkgameService, private fb: FormBuilder, private errorModalService: ErrorModalService) {
    this.createGameForm = fb.group({
      gamerows: ['', [Validators.required, Validators.min(1), Validators.max(26)]],
      gamecols: ['', [Validators.required, Validators.min(1), Validators.max(26)]],
    });

    this.loadGameData();
  }

  private loadGameData(): void {

    this.gameData = this.walkgameService.getGameData();

    if (!this.gameData) {
      const gameSubscription = this.walkgameService.getCurrentGame().pipe(
        catchError(() => {
          return [];
        }),
      ).subscribe({
        next: (value) => {
          this.gameData = value;
        }
      });
      
      this.subscriptions.add(gameSubscription);
    } else {
      //DO nothing
    }
  }

  onSubmit(): void {
    this.createGameForm.markAllAsTouched();

    if (this.createGameForm.valid) {
      this.isSubmitting = true;

      const dataForm = {
        width: this.createGameForm.value.gamerows,
        height: this.createGameForm.value.gamecols
      };

      const submitSubscription = this.walkgameService.createNewGame(dataForm).pipe(
        switchMap(() => this.walkgameService.getCurrentGame()),
        catchError((err) => {
          this.isSubmitting = false;
          this.errorModalService.openModal("Algo ha ido mal durante la creación del juego.");
          return [];
        })
      ).subscribe({
        next: (response) => {
          this.gameData = response;
          this.isSubmitting = false;
        }
      });

      this.subscriptions.add(submitSubscription);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}










/*export class HomeComponent {

  isLoading: boolean = true;
  isSubmitting: boolean = false;
  gameData: any = null;
  createGameForm: FormGroup;
  private subscriptions: Subscription = new Subscription();

  constructor(private walkgameService : WalkgameService, private fb: FormBuilder){

    this.createGameForm = fb.group({
      gamerows: ['', [Validators.required, Validators.min(1), Validators.max(26)]],
      gamecols: ['', [Validators.required, Validators.min(1), Validators.max(26)]],
    });

    this.gameData = walkgameService.getGameData();
    if(!this.gameData){
      this.walkgameService.getCurrentGame().subscribe({
        next: (value) => {
          this.isLoading = false;
          this.gameData = value;
        },
        error: (err) => {
          this.isLoading = false;
        }
      });
    }else{
      this.isLoading = false;
    }
  }

  onSubmit(): void {
    this.createGameForm.markAllAsTouched();

    if(this.createGameForm.valid){
      this.isSubmitting = true;

      const dataForm = {
        width: this.createGameForm.value.gamerows,
        height: this.createGameForm.value.gamecols
      };

      this.walkgameService.createNewGame(dataForm).subscribe({
        next: (response) => {
          this.walkgameService.getCurrentGame().subscribe({
            next: (value) => {
              this.isLoading = false;
              this.gameData = value;
            },
            error: (err) => {
              this.isLoading = false;
            }
          });
          this.isSubmitting = false;
        },
        error: (err) => {
          this.isSubmitting = false;
        }
      });
    }
  }

}*/