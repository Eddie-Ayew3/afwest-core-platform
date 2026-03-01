import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardContentComponent,
  ButtonComponent,
  BadgeComponent,
  BreadcrumbComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkComponent,
  BreadcrumbSeparatorComponent
} from '@tolle_/tolle-ui';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.css'
})
export class ClientDashboardComponent {
    clientId: string = '';
    
    constructor() {
      // This would typically get the client ID from route params
      // For now, we'll use a placeholder
    }
}
