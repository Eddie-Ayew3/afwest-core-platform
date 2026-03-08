import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
import { LoadingService } from '../../../../core/guards/loading.guard';

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
export class ClientDashboardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private loadingService = inject(LoadingService);
  
  clientId: string = '';
  clientName: string = '';
  
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
  
  ngOnInit(): void {
    // Show loading screen
    this.loadingService.show();
    
    // Get client ID from route parameters
    this.route.paramMap.subscribe(params => {
      this.clientId = params.get('id') || '';
      this.loadClientData();
    });
  }
  
  private loadClientData(): void {
    // Simulate API call to load client data
    setTimeout(() => {
      this.clientName = this.getClientName(this.clientId);
      
      // Hide loading screen after data is loaded
      this.loadingService.hide();
    }, 2000); // Simulate 2 second loading time
  }
  
  private getClientName(clientId: string): string {
    const clientNames: { [key: string]: string } = {
      'CLT001': 'GoldFields Ghana Ltd.',
      'CLT002': 'Accra Mall Management',
      'CLT003': 'Kumasi Hive Ventures',
      'CLT004': 'KNUST Research Institute',
      'CLT005': 'Takoradi Harbour Authority',
      'CLT006': 'Ahanta West Municipal',
      'CLT007': 'Cape Coast Teaching Hospital',
      'CLT008': 'Volta River Authority'
    };
    
    return clientNames[clientId] || 'Unknown Client';
  }
}
