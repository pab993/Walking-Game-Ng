import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericModalService {
  private openModalSubject = new Subject<string>();
  private closeModalSubject = new Subject<void>();
  private componentSubject = new Subject<ComponentRef<any>>();

  openModal$ = this.openModalSubject.asObservable();
  closeModal$ = this.closeModalSubject.asObservable();
  component$ = this.componentSubject.asObservable();

  private viewContainerRef!: ViewContainerRef;

  setViewContainerRef(viewContainerRef: ViewContainerRef): void {
    this.viewContainerRef = viewContainerRef;
  }

  openModal(message: string): void {
    this.openModalSubject.next(message);
  }

  closeModal(): void {
    this.closeModalSubject.next();
  }

  setComponent(component: any): void {
    if (!this.viewContainerRef) {
      throw new Error('ViewContainerRef no está inicializado. Usa setViewContainerRef primero.');
    }

    this.viewContainerRef.clear();
    const componentRef = this.viewContainerRef.createComponent(component);
    this.componentSubject.next(componentRef);
  }
}
