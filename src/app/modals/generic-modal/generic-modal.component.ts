import { Component, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { GenericModalService } from '../../services/generic-modal.service';
import { Modal } from 'bootstrap';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generic-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-modal.component.html',
  styleUrl: './generic-modal.component.css'
})
export class GenericModalComponent implements OnInit, OnDestroy{
  private modal!: Modal;
  private subscriptions = new Subscription();
  private componentRef!: ComponentRef<any>; 
  message: string = 'Error';

  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true })
  dynamicContainer!: ViewContainerRef;

  constructor(private genericModalService: GenericModalService) {}

  ngOnInit(): void {
    const modalElement = document.getElementById('genericModal');
    if (modalElement) {
      this.modal = new Modal(modalElement);

      modalElement.addEventListener('hidden.bs.modal', () => {
        this.resetComponentState();
      });
    }

    this.subscriptions.add(
      this.genericModalService.component$.subscribe((componentRef: ComponentRef<any>) => {
        this.componentRef = componentRef;
      })
    );

    this.genericModalService.setViewContainerRef(this.dynamicContainer);

    this.subscriptions.add(
      this.genericModalService.openModal$.subscribe((message: string) => {
        this.message = message;
        this.modal?.show();
      })
    );

    this.subscriptions.add(
      this.genericModalService.closeModal$.subscribe(() => {
        this.modal?.hide();
      })
    );
  }

  closeModal(): void{
    this.genericModalService.closeModal();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private resetComponentState(): void {
    if (this.componentRef?.instance && typeof this.componentRef.instance.reset === 'function') {
      this.componentRef.instance.reset();
    }
  }
}
