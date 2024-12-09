import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorModalComponent } from "./modals/error-modal/error-modal.component";
import { GenericModalComponent } from "./modals/generic-modal/generic-modal.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ErrorModalComponent, GenericModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Walking-Game-Ng';
}
