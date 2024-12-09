import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorModalService {
  private openModalSubject = new Subject<string>();
  private closeModalSubject = new Subject<void>();

  openModal$ = this.openModalSubject.asObservable();
  closeModal$ = this.closeModalSubject.asObservable();

  openModal(message: string): void {
    this.openModalSubject.next(message);
  }

  closeModal(): void {
    this.closeModalSubject.next();
  }
}