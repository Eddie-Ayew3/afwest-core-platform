import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [
    CommonModule,
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

  // Projects data
  projects = [
    {
      id: 1,
      name: 'Design System',
      status: 'active',
      progress: 75,
      team: ['Sarah Chen', 'Mike Ross', 'David Kim'],
      dueDate: new Date('2024-03-15'),
      priority: 'high'
    },
    {
      id: 2,
      name: 'Mobile App',
      status: 'in-review',
      progress: 45,
      team: ['John Doe', 'Jane Smith'],
      dueDate: new Date('2024-03-20'),
      priority: 'medium'
    },
    {
      id: 3,
      name: 'Marketing Website',
      status: 'completed',
      progress: 100,
      team: ['Alice Johnson', 'Bob Wilson'],
      dueDate: new Date('2024-02-28'),
      priority: 'low'
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
