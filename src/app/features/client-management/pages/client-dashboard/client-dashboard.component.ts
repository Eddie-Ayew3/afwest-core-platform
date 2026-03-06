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
  BreadcrumbSeparatorComponent,
  DataTableComponent,
  TableColumn
} from '@tolle_/tolle-ui';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DataTableComponent,
    BadgeComponent,
  ],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.css'
})
export class ClientDashboardComponent {
    clientId: string = '';
    
    // Projects data for table
    projects = [
      {
        name: 'Design System',
        status: 'Active',
        progress: 75,
        team: [
          { initials: 'JD', color: 'bg-blue-500' },
          { initials: 'SC', color: 'bg-green-500' },
          { initials: 'MR', color: 'bg-purple-500' }
        ],
        dueDate: 'Dec 15, 2023'
      },
      {
        name: 'Mobile App',
        status: 'In Review',
        progress: 45,
        team: [
          { initials: 'AK', color: 'bg-red-500' },
          { initials: 'PL', color: 'bg-indigo-500' }
        ],
        dueDate: 'Jan 5, 2024'
      },
      {
        name: 'Marketing Website',
        status: 'Planning',
        progress: 20,
        team: [
          { initials: 'LN', color: 'bg-teal-500' },
          { initials: 'KW', color: 'bg-pink-500' },
          { initials: 'RJ', color: 'bg-cyan-500' }
        ],
        dueDate: 'Feb 28, 2024'
      }
    ];

    columns: TableColumn[] = [
      { key: 'name', label: 'Project Name' },
      { key: 'status', label: 'Status' },
      { key: 'progress', label: 'Progress' },
      { key: 'team', label: 'Team' },
      { key: 'dueDate', label: 'Due Date' }
    ];
    
    constructor() {
      // This would typically get the client ID from route params
      // For now, we'll use a placeholder
    }
}
