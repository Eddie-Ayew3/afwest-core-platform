import { Component } from '@angular/core';
import { ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {
  // User management logic here
}
