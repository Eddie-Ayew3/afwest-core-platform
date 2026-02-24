import { Component } from '@angular/core';
import { ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-check-in-out',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './check-in-out.component.html',
  styleUrl: './check-in-out.component.css'
})
export class CheckInOutComponent {
  // Check in/out logic here
}
