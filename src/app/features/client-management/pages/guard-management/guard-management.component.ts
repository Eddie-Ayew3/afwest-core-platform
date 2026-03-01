import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardContentComponent,
  ButtonComponent,
  InputComponent,
  BadgeComponent,
  SelectComponent,
  SelectItemComponent,
  EmptyStateComponent,
  PaginationComponent,
  TooltipDirective,
  DropdownTriggerDirective,
  LabelComponent,
  DropdownMenuComponent,
  BreadcrumbComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkComponent,
  BreadcrumbSeparatorComponent,
  ModalService
} from '@tolle_/tolle-ui';

export interface Guard {
  id: string;
  staffId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  emergencyPhone: string;
  position: string;
  rank: string;
  department: string;
  siteAssignment: string;
  siteName: string;
  region: string;
  status: 'active' | 'inactive' | 'on-leave' | 'suspended' | 'terminated';
  hireDate: Date;
  lastTrainingDate?: Date;
  certificationExpiry?: Date;
  uniformSize: string;
  workingHours: {
    weekdays: string;
    weekends: string;
  };
  salary: number;
  performance: {
    rating: number;
    lastReview: Date;
    attendanceRate: number;
    punctuality: number;
  };
  skills: string[];
  certifications: {
    name: string;
    expiryDate: Date;
    status: 'valid' | 'expired' | 'pending';
  }[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    address: string;
  };
  profileImage?: string;
  nextShift?: Date;
}

export interface Site {
  id: string;
  name: string;
  code: string;
  region: string;
  city: string;
  address: string;
  manager: string;
}

@Component({
  selector: 'app-guard-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    
  ],
  templateUrl: './guard-management.component.html',
  styleUrl: './guard-management.component.css'
})
export class GuardManagementComponent implements OnInit {
  private modalService = inject(ModalService);

  // Mock data for guards
  guards: Guard[] = [
    {
      id: 'GRD001',
      staffId: 'STF001',
      firstName: 'Kwame',
      lastName: 'Asante',
      fullName: 'Kwame Asante',
      email: 'kwame.asante@ecobank.com.gh',
      phone: '+233-244-123-4567',
      emergencyPhone: '+233-244-987-6543',
      position: 'Senior Security Officer',
      rank: 'Sergeant',
      department: 'Security',
      siteAssignment: 'ECB-KUM-001',
      siteName: 'Ecobank Kumasi Main',
      region: 'Ashanti',
      status: 'active',
      hireDate: new Date('2020-03-15'),
      lastTrainingDate: new Date('2024-01-20'),
      certificationExpiry: new Date('2024-06-30'),
      uniformSize: 'L',
      workingHours: {
        weekdays: '06:00 - 18:00',
        weekends: '08:00 - 14:00'
      },
      salary: 2500,
      performance: {
        rating: 4.5,
        lastReview: new Date('2024-02-15'),
        attendanceRate: 95,
        punctuality: 92
      },
      skills: ['First Aid', 'Fire Safety', 'Customer Service', 'Emergency Response'],
      certifications: [
        { name: 'Security Guard License', expiryDate: new Date('2024-06-30'), status: 'valid' },
        { name: 'First Aid Certificate', expiryDate: new Date('2024-03-15'), status: 'valid' },
        { name: 'Fire Safety Training', expiryDate: new Date('2024-05-20'), status: 'valid' }
      ],
      emergencyContact: {
        name: 'Ama Asante',
        relationship: 'Spouse',
        phone: '+233-244-555-1234',
        address: 'Kumasi, Ashanti Region'
      },
      profileImage: 'guard-001.jpg',
      nextShift: new Date('2024-02-28T06:00:00')
    },
    {
      id: 'GRD002',
      staffId: 'STF002',
      firstName: 'Ama',
      lastName: 'Mensah',
      fullName: 'Ama Mensah',
      email: 'ama.mensah@ecobank.com.gh',
      phone: '+233-244-234-5678',
      emergencyPhone: '+233-244-876-5432',
      position: 'Security Officer',
      rank: 'Corporal',
      department: 'Security',
      siteAssignment: 'ECB-ACC-001',
      siteName: 'Ecobank Accra Central',
      region: 'Greater Accra',
      status: 'active',
      hireDate: new Date('2021-07-10'),
      lastTrainingDate: new Date('2023-11-15'),
      certificationExpiry: new Date('2024-04-30'),
      uniformSize: 'M',
      workingHours: {
        weekdays: '07:00 - 19:00',
        weekends: 'Off'
      },
      salary: 2200,
      performance: {
        rating: 4.2,
        lastReview: new Date('2024-01-20'),
        attendanceRate: 88,
        punctuality: 90
      },
      skills: ['Access Control', 'Surveillance', 'Report Writing', 'Conflict Resolution'],
      certifications: [
        { name: 'Security Guard License', expiryDate: new Date('2024-04-30'), status: 'valid' },
        { name: 'Surveillance Training', expiryDate: new Date('2023-12-15'), status: 'valid' }
      ],
      emergencyContact: {
        name: 'Kofi Mensah',
        relationship: 'Brother',
        phone: '+233-244-345-6789',
        address: 'Accra, Greater Accra'
      },
      profileImage: 'guard-002.jpg',
      nextShift: new Date('2024-02-28T07:00:00')
    },
    {
      id: 'GRD003',
      staffId: 'STF003',
      firstName: 'Yaw',
      lastName: 'Osei',
      fullName: 'Yaw Osei',
      email: 'yaw.osei@ecobank.com.gh',
      phone: '+233-244-345-6789',
      emergencyPhone: '+233-244-654-3210',
      position: 'Security Officer',
      rank: 'Corporal',
      department: 'Security',
      siteAssignment: 'ECB-CAPE-001',
      siteName: 'Ecobank Cape Coast',
      region: 'Central',
      status: 'active',
      hireDate: new Date('2022-02-20'),
      lastTrainingDate: new Date('2023-10-10'),
      certificationExpiry: new Date('2024-03-15'),
      uniformSize: 'L',
      workingHours: {
        weekdays: '06:00 - 18:00',
        weekends: '08:00 - 14:00'
      },
      salary: 2200,
      performance: {
        rating: 3.8,
        lastReview: new Date('2024-01-10'),
        attendanceRate: 92,
        punctuality: 85
      },
      skills: ['Patrol Management', 'Incident Reporting', 'Communication', 'Physical Security'],
      certifications: [
        { name: 'Security Guard License', expiryDate: new Date('2024-03-15'), status: 'valid' },
        { name: 'Patrol Training', expiryDate: new Date('2023-09-15'), status: 'valid' }
      ],
      emergencyContact: {
        name: 'Adwoa Osei',
        relationship: 'Wife',
        phone: '+233-244-456-7890',
        address: 'Cape Coast, Central Region'
      },
      profileImage: 'guard-003.jpg',
      nextShift: new Date('2024-02-28T06:00:00')
    },
    {
      id: 'GRD004',
      staffId: 'STF004',
      firstName: 'Grace',
      lastName: 'Rodriguez',
      fullName: 'Grace Rodriguez',
      email: 'grace.rodriguez@ecobank.com.gh',
      phone: '+233-244-456-7890',
      emergencyPhone: '+233-244-123-4567',
      position: 'Junior Security Officer',
      rank: 'Private',
      department: 'Security',
      siteAssignment: 'ECB-ACC-002',
      siteName: 'Ecobang Accra Central',
      region: 'Greater Accra',
      status: 'on-leave',
      hireDate: new Date('2023-05-15'),
      lastTrainingDate: new Date('2023-12-20'),
      certificationExpiry: new Date('2024-02-28'),
      uniformSize: 'S',
      workingHours: {
        weekdays: '08:00 - 20:00',
        weekends: 'Off'
      },
      salary: 1800,
      performance: {
        rating: 4.0,
        lastReview: new Date('2024-01-25'),
        attendanceRate: 90,
        punctuality: 88
      },
      skills: ['Customer Service', 'Basic Security', 'Communication', 'Documentation'],
      certifications: [
        { name: 'Security Guard License', expiryDate: new Date('2024-02-28'), status: 'expired' },
        { name: 'Basic Security Training', expiryDate: new Date('2023-08-15'), status: 'valid' }
      ],
      emergencyContact: {
        name: 'Carlos Rodriguez',
        relationship: 'Husband',
        phone: '+233-244-789-0123',
        address: 'Accra, Greater Accra'
      },
      profileImage: 'guard-004.jpg'
    },
    {
      id: 'GRD005',
      staffId: 'STF005',
      firstName: 'Mike',
      lastName: 'Chen',
      fullName: 'Mike Chen',
      email: 'mike.chen@ecobank.com.gh',
      phone: '+233-244-567-8901',
      emergencyPhone: '+233-244-234-5678',
      position: 'Security Officer',
      rank: 'Corporal',
      department: 'Security',
      siteAssignment: 'ECB-ASO-001',
      siteName: 'Ecobank Asokwa',
      region: 'Ashanti',
      status: 'active',
      hireDate: new Date('2021-11-01'),
      lastTrainingDate: new Date('2024-02-01'),
      certificationExpiry: new Date('2024-07-15'),
      uniformSize: 'L',
      workingHours: {
        weekdays: '06:00 - 18:00',
        weekends: '08:00 - 14:00'
      },
      salary: 2300,
      performance: {
        rating: 4.7,
        lastReview: new Date('2024-02-10'),
        attendanceRate: 98,
        punctuality: 96
      },
      skills: ['Advanced Security', 'Leadership', 'Training', 'Risk Assessment'],
      certifications: [
        { name: 'Security Guard License', expiryDate: new Date('2024-07-15'), status: 'valid' },
        { name: 'Advanced Security Training', expiryDate: new Date('2024-01-15'), status: 'valid' },
        { name: 'Leadership Course', expiryDate: new Date('2023-11-01'), status: 'valid' }
      ],
      emergencyContact: {
        name: 'Sarah Chen',
        relationship: 'Wife',
        phone: '+234-555-123-4567',
        address: 'Kumasi, Ashanti Region'
      },
      profileImage: 'guard-005.jpg',
      nextShift: new Date('2024-02-28T06:00:00')
    }
  ];

  // Mock sites for assignment
  sites: Site[] = [
    { id: 'ECB-KUM-001', name: 'Ecobank Kumasi Main', code: 'KUM-001', region: 'Ashanti', city: 'Kumasi', address: 'Adum Kumasi, Near Kejetia Market', manager: 'Mr. Yaw Owusu' },
    { id: 'ECB-ACC-001', name: 'Ecobank Accra Central', code: 'ACC-001', region: 'Greater Accra', city: 'Accra', address: 'High Street, Accra Central', manager: 'Mrs. Grace Ansah' },
    { id: 'ECB-ACC-002', name: 'Ecobank Accra Central', code: 'ACC-002', region: 'Greater Accra', city: 'Accra', address: 'Independence Avenue, Accra', manager: 'Mrs. Grace Ansah' },
    { id: 'ECB-CAPE-001', name: 'Ecobank Cape Coast', code: 'CAPE-001', region: 'Central', city: 'Cape Coast', address: 'Main Market Area, Cape Coast', manager: 'Mr. Kweku Annan' },
    { id: 'ECB-ASO-001', name: 'Ecobank Asokwa', code: 'ASO-001', region: 'Ashanti', city: 'Kumasi', address: 'Asokwa New Road, Kumasi', manager: 'Mrs. Akua Mensah' }
  ];

  filteredGuards: Guard[] = [];
  displayedGuards: Guard[] = [];
  currentUserRole: 'head-office' | 'zonal-commander' = 'head-office';
  currentUserRegion?: string;

  searchQuery: string = '';
  showFilterPanel: boolean = false;
  activeFilterCount: number = 0;

  // Filters
  selectedStatus: string = 'all';
  selectedSite: string = 'all';
  selectedRank: string = 'all';
  selectedDepartment: string = 'all';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;

  constructor() {
    // Simulate setting user region (in real app, this would come from auth service)
    this.currentUserRegion = 'Ashanti'; // Simulating zonal commander for Ashanti
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.filteredGuards.length);
  }

  applyFilters(): void {
    let result = [...this.guards];

    // Apply region filter based on user role
    if (this.currentUserRole === 'zonal-commander' && this.currentUserRegion) {
      result = result.filter(guard => guard.region === this.currentUserRegion);
    } else if (this.selectedSite !== 'all') {
      result = result.filter(guard => guard.siteAssignment === this.selectedSite);
    }

    // Search
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(guard =>
        guard.fullName.toLowerCase().includes(query) ||
        guard.staffId.toLowerCase().includes(query) ||
        guard.email.toLowerCase().includes(query) ||
        guard.phone.includes(query) ||
        guard.position.toLowerCase().includes(query) ||
        guard.siteName.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (this.selectedStatus !== 'all') {
      result = result.filter(guard => guard.status === this.selectedStatus);
    }

    // Rank filter
    if (this.selectedRank !== 'all') {
      result = result.filter(guard => guard.rank === this.selectedRank);
    }

    // Department filter
    if (this.selectedDepartment !== 'all') {
      result = result.filter(guard => guard.department === this.selectedDepartment);
    }

    this.filteredGuards = result;
    this.updateActiveFilterCount();
    this.currentPage = 1;
    this.updateDisplayedGuards();
  }

  updateDisplayedGuards(): void {
    this.displayedGuards = this.filteredGuards.slice(this.startIndex, this.endIndex);
  }

  updateActiveFilterCount(): void {
    let count = 0;
    if (this.selectedStatus !== 'all') count++;
    if (this.selectedSite !== 'all') count++;
    if (this.selectedRank !== 'all') count++;
    if (this.selectedDepartment !== 'all') count++;
    this.activeFilterCount = count;
  }

  onSearch(): void {
    this.applyFilters();
  }

  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = 'all';
    this.selectedSite = 'all';
    this.selectedRank = 'all';
    this.selectedDepartment = 'all';
    this.applyFilters();
  }

  getRankColor(rank: string): string {
    const colorMap: { [key: string]: string } = {
      'Sergeant': 'default',
      'Corporal': 'secondary',
      'Private': 'outline',
      'Lance Corporal': 'secondary'
    };
    return colorMap[rank] || 'default';
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'active': 'default',
      'inactive': 'secondary',
      'on-leave': 'outline',
      'suspended': 'destructive',
      'terminated': 'destructive'
    };
    return colorMap[status] || 'default';
  }

  getPerformanceColor(rating: number): string {
    if (rating >= 4.5) return 'default';
    if (rating >= 3.5) return 'secondary';
    if (rating >= 2.5) return 'outline';
    return 'destructive';
  }

  getAttendanceColor(rate: number): string {
    if (rate >= 95) return 'default';
    if (rate >= 85) return 'secondary';
    if (rate >= 75) return 'outline';
    return 'destructive';
  }

  viewGuardDetails(guard: Guard): void {
    console.log('View guard details:', guard);
  }

  editGuard(guard: Guard): void {
    console.log('Edit guard:', guard);
  }

  assignGuard(guard: Guard): void {
    console.log('Assign guard to site:', guard);
  }

  scheduleTraining(guard: Guard): void {
    console.log('Schedule training for guard:', guard);
  }

  viewGuardSchedule(guard: Guard): void {
    console.log('View guard schedule:', guard);
  }

  generateReport(): void {
    console.log('Generate guard performance report');
  }

  openNewGuardDialog(): void {
    const modalRef = this.modalService.open({
      title: 'Add New Guard',
      content: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">First Name</label>
            <input type="text" class="w-full p-2 border rounded-md" placeholder="Enter first name">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Last Name</label>
            <input type="text" class="w-full p-2 border rounded-md" placeholder="Enter last name">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Email</label>
            <input type="email" class="w-full p-2 border rounded-md" placeholder="Enter email address">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Phone</label>
            <input type="tel" class="w-full p-2 border rounded-md" placeholder="Enter phone number">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Position</label>
            <input type="text" class="w-full p-2 border rounded-md" placeholder="Enter position">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Rank</label>
            <select class="w-full p-2 border rounded-md">
              <option value="">Select rank</option>
              <option value="Private">Private</option>
              <option value="Lance Corporal">Lance Corporal</option>
              <option value="Corporal">Corporal</option>
              <option value="Sergeant">Sergeant</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Site Assignment</label>
            <select class="w-full p-2 border rounded-md">
              <option value="">Select site</option>
              <option *ngFor="let site of sites" [value]="site.id">{{site.name}} - {{site.city}}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Department</label>
            <input type="text" class="w-full p-2 border rounded-md" placeholder="Enter department">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Salary</label>
            <input type="number" class="w-full p-2 border rounded-md" placeholder="Enter salary">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Emergency Contact</label>
            <input type="text" class="w-full p-2 border rounded-md" placeholder="Enter emergency contact">
          </div>
        </div>
      `,
      size: 'default'
    });

    modalRef.afterClosed$.subscribe((result: any) => {
      if (result?.success) {
        console.log('New guard added successfully');
        // Here you would typically refresh the guard list
      }
    });
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updateDisplayedGuards();
  }

  onPageChange(event: any): void {
    this.currentPage = event;
    this.updateDisplayedGuards();
  }

  switchUserRole(): void {
    // For testing purposes - switch between head-office and zonal-commander
    this.currentUserRole = this.currentUserRole === 'head-office' ? 'zonal-commander' : 'head-office';
    this.applyFilters();
  }

  getCertificationStatus(certification: any): string {
    const status = certification.status;
    const expiryDate = certification.expiryDate;
    const today = new Date();
    
    if (status === 'expired' || (expiryDate && expiryDate < today)) {
      return 'destructive';
    } else if (status === 'pending') {
      return 'secondary';
    }
    return 'default';
  }

  isCertificationExpiringSoon(certification: any): boolean {
    if (!certification.expiryDate) return false;
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    return certification.expiryDate <= thirtyDaysFromNow && certification.expiryDate >= today;
  }
}
