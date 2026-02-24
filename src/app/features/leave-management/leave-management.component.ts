import { Component } from '@angular/core';
import { ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-leave-management',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './leave-management.component.html',
  styleUrl: './leave-management.component.css'
})
export class LeaveManagementComponent {
  // Leave management logic here
}
