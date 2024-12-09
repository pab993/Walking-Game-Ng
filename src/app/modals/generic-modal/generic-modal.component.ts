import { Component, OnDestroy, OnInit } from '@angular/core';
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
  component: any;

  message: string = 'Error';

  constructor(private genericModalService: GenericModalService) {}

  ngOnInit(): void {
    const modalElement = document.getElementById('genericModal');
    if (modalElement) {
      this.modal = new Modal(modalElement);
    }

    this.subscriptions.add(
      this.genericModalService.component$.subscribe((component) => {
        this.component = component;
      })
    );

    this.subscriptions.add(
      this.genericModalService.openModal$.subscribe((message: string) => {
        this.message = message;
        this.modal?.show();
      })
    );
    this.subscriptions.add(
      this.genericModalService.closeModal$.subscribe(() => this.modal?.hide())
    );
  }

  closeModal(): void{
    this.genericModalService.closeModal();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
