import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericModalService {
  private openModalSubject = new Subject<string>();
  private closeModalSubject = new Subject<void>();

  private componentSubject = new Subject<any>();

  openModal$ = this.openModalSubject.asObservable();
  closeModal$ = this.closeModalSubject.asObservable();

  component$ = this.componentSubject.asObservable();

  openModal(message: string): void {
    this.openModalSubject.next(message);
  }

  closeModal(): void {
    this.closeModalSubject.next();
  }

  setComponent(component: any): void {
    this.componentSubject.next(component);
  }
}
