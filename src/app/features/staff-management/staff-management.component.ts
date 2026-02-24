import { Component } from '@angular/core';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent, ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent, ButtonComponent],
  templateUrl: './staff-management.component.html',
  styleUrl: './staff-management.component.css'
})
export class StaffManagementComponent {
  // Staff management logic here
}
