import { Component, OnDestroy, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import { Subscription } from 'rxjs';
import { ErrorModalService } from '../../services/error-modal.service';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [],
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.css'
})
export class ErrorModalComponent implements OnInit, OnDestroy{
  private modal!: Modal;
  private subscriptions = new Subscription();

  message: string = 'Error';

  constructor(private errorModalService: ErrorModalService) {}

  ngOnInit(): void {
    const modalElement = document.getElementById('errorModal');
    if (modalElement) {
      this.modal = new Modal(modalElement);
    }

    this.subscriptions.add(
      this.errorModalService.openModal$.subscribe((message: string) => {
        this.message = message;
        this.modal?.show();
      })
    );
    this.subscriptions.add(
      this.errorModalService.closeModal$.subscribe(() => this.modal?.hide())
    );
  }

  closeModal(): void{
    this.errorModalService.closeModal();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
