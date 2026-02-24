import { Component } from '@angular/core';
import { ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashBoardComponent {
    // Dashboard component logic here
}
