import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataTableComponent, TableColumn, TolleCellDirective, BadgeComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DataTableComponent,
    BadgeComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashBoardComponent implements OnInit {
  private router = inject(Router);

  // Dashboard statistics
  totalUsers = 2543;
  activeProjects = 12;
  completedTasks = 892;
  pendingReviews = 127;

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
  recentActivity = [
    {
      id: 1,
      user: 'Sarah Chen',
      action: 'joined team',
      description: 'Added as Senior Developer',
      time: '2 minutes ago',
      icon: 'ri-user-add-line',
      color: 'text-blue-600'
    },
    {
      id: 2,
      user: 'Mike Ross',
      action: 'uploaded file',
      description: 'Q4 Report uploaded',
      time: '1 hour ago',
      icon: 'ri-file-copy-line',
      color: 'text-green-600'
    },
    {
      id: 3,
      user: 'Project Alpha',
      action: 'completed',
      description: 'Mobile app development finished',
      time: '3 hours ago',
      icon: 'ri-check-line',
      color: 'text-purple-600'
    },
    {
      id: 4,
      user: 'Mike Ross',
      action: 'comment',
      description: 'New comment on Q4 report',
      time: '5 hours ago',
      icon: 'ri-chat-1-line',
      color: 'text-orange-600'
    }
  ];

  ngOnInit(): void {
    console.log('Dashboard component initialized');
  }

  viewAllProjects(): void {
    console.log('View all projects');
    // Navigate to projects page
  }

  createNewProject(): void {
    console.log('Create new project');
    // Open project creation dialog
  }

  viewAllActivity(): void {
    console.log('View all activity');
    // Navigate to activity page
  }

  generateReport(): void {
    console.log('Generate report');
    // Generate dashboard report
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'active': 'default',
      'in-review': 'secondary',
      'completed': 'default',
      'pending': 'outline'
    };
    return colorMap[status] || 'default';
  }

  getPriorityColor(priority: string): string {
    const colorMap: { [key: string]: string } = {
      'high': 'destructive',
      'medium': 'secondary',
      'low': 'outline'
    };
    return colorMap[priority] || 'default';
  }

  getProgressColor(progress: number): string {
    if (progress >= 75) return 'default';
    if (progress >= 50) return 'secondary';
    return 'outline';
  }
}
