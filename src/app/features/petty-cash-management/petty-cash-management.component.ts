import { Component } from '@angular/core';
import { ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-petty-cash-management',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './petty-cash-management.component.html',
  styleUrl: './petty-cash-management.component.css'
})
export class PettyCashManagementComponent {
  // Petty cash management logic here
}
