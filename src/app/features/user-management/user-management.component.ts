import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  CardComponent,
  CardContentComponent,
  ButtonComponent,
  InputComponent,
  SelectComponent,
  SelectItemComponent,
  EmptyStateComponent,
  PaginationComponent,
  TooltipDirective,
  DropdownTriggerDirective,
  DropdownMenuComponent,
  BreadcrumbComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkComponent,
  BreadcrumbSeparatorComponent,
  ModalService
} from '@tolle_/tolle-ui';

interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'HR Admin' | 'Security Supervisor' | 'Operations Manager';
  permissions: 'Full Access' | 'View-only, Approval-rights' | 'View-only';
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    CardContentComponent,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    SelectItemComponent,
    EmptyStateComponent,
    PaginationComponent,
    TooltipDirective,
    DropdownTriggerDirective,
    DropdownMenuComponent,
    BreadcrumbComponent,
    BreadcrumbItemComponent,
    BreadcrumbLinkComponent,
    BreadcrumbSeparatorComponent,
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  private modalService = inject(ModalService);

  users: User[] = [
    { 
      id: 'USR001', 
      name: 'Sarah Chen', 
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBd1S1u7kipsObp29PfoVdTCxmOBgsR3dTH5AinK9q38omNHOlQy_X8TmGwocbiaBei9ue_DGldaNefGwFkY_NJ8qeQBv1xXQab-Q3UDpP-01mkaVk7W0dioOehSKzQMo-3jHpfNbCn6jEc8j9UhP2DL2sFtuQVxCCBtLPJ5YTH4962MdUPZnE24HyOG83LH_pQMRos5HbKvOVO10p4dazLEDvVjr0xg3FcaBgPFrS5k4wHNQGhqqd2IwFm1xDuap32flCaH9ks5qc',
      role: 'HR Admin', 
      permissions: 'Full Access', 
      status: 'Active' 
    },
    { 
      id: 'USR002', 
      name: 'Mike Johnson', 
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVD_7igoLUoSlN6F35qumfn2rSgXGkenu4V6NBF9X4QQkaLlb-2GecpdEYo2_mZDBrkvCDqEL46gDWk9TQwGTf7f1I8m-hQUdvP0zHtHoz7A_AbN7nsuLCONYxjbtQOy0xcfx4CdSEJGX5wITCsnPI5cOlWGYqjZ33jXbEnGB2ZAhmw0_pBbi__PQ3fQj3UXSh3YQC_XU2Z0VKDqAt22qtlWA9aYv8cgJmxk06rl5je8kUN9W5i71S4VDfnF_dch0CyHX0FmoX-FY',
      role: 'Security Supervisor', 
      permissions: 'View-only, Approval-rights', 
      status: 'Active' 
    },
    { 
      id: 'USR003', 
      name: 'Emily Davis', 
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmna3QMUWcrlIKEwFt6wPHJEkGi9RyGLCFHiel3KW28WXbJoPr6xOMnsqzsUJLFUrGu8qt8GqaWZlHAXBi6eYlCpEEptdvKUYnfy967PzhAGwZQBcdrVbsSycataLtNl6rARjsi0MK86UbvvEjQ1IpESey9y8MAk9x6RjzyL0Ci2A-CbhR49q9kYncslI0gV1lkga9JEw0MYI2AsUjs7pyDefGFoL9cWZP-gKW0mp4m0g25kUKtPVSNGYpzE0lv4ymGirNvTNLa-4',
      role: 'Operations Manager', 
      permissions: 'View-only', 
      status: 'Inactive' 
    },
    { 
      id: 'USR004', 
      name: 'Emily Davis', 
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf1C32hOOKq8HflUoaJzArys8ohttC0zYnhE8tDM1i6EKpTKCafwyRABrLFpkZEQaOysNrLyyieWKQpNQWifabYWQi7iZ4QZ_k4u2daqczAAKg_RFbEESvCbKOsIdX2cN1hHdjEM2KCs1okOX1Bizn1KU8fXGlVafyedVK80OiDz3q4P1OsYy4I-IOPxWZWJfF2VejPZA4hwpLZXGBrXO4yOqgaIX7QvPocPcmPSF1lVhNftN-lk-_JD-tP2bgSXiSe3Pv_bs9Q4w',
      role: 'Operations Manager', 
      permissions: 'View-only', 
      status: 'Active' 
    },
    { 
      id: 'USR005', 
      name: 'Maile Johnson', 
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQiqkHisEjthFCHw6eynPe6LQm-oBhMikK-HpgFbWh-oAsq_CULyrIg0xZUhaKRCOs3KjVA0K0WUcGz3lO0AMUhqbTd4a7Ah_g4kb-9xM7_WOCR6fEehtAuAjJi8Xwqdu5Nn6kEHaQ709GlDe6iNU7npzp7hsdtjVZf5kSL_z7rWYr0Jax15mpZNjlVXH1EqDdCitbVnFiKR8WwCEeapAMMLTzq9Zvv8uv3vxafV9TcB6qoStosDroGTfc0GRP24tC-0C-nG9y3ow',
      role: 'Operations Manager', 
      permissions: 'Full Access', 
      status: 'Inactive' 
    },
    { 
      id: 'USR006', 
      name: 'Emily Davis', 
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyrLIVRVyMNZ1Dcyqaig8Tvf0Hu8nMee7PCstlPICABIkkw7qmR2lpxmaWsZBJGeIlHIbtxce9PTva7rlY2smX2J4OClzTBuf7tMcu9yTB3iUJq8lEhmb8YNww7aD-e13qP4k8EWrdW6oYotK5vyKWBLT0Nu9XCplETfOTxKi8dDzBc_mxgDGYYCy3ju21TFa_BEsEA5N-_OyJaM9NXl89Z7ka-_6oihKK0dBI3p4GO-Ot_Xx1zDWkg4KRARH044ZJVQe_J0mK0qY',
      role: 'Operations Manager', 
      permissions: 'Full Access', 
      status: 'Inactive' 
    },
    { 
      id: 'USR007', 
      name: 'Sarah Chen', 
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdZoGuaycPzozt4KAp1spPSV85Y7pj3RyZ_-_ED3fK5NDOCpkaYcfxRj8hLVERA-uNbvdDxqDb6bohcweclqTXTDg26pucY_ceangS2ERP7VUJ5J38w5Ps3SnBgVdVLMEaeokPfadW2Wf-oYZuQpylwvB7qZpgZ2JS-Xqc-WznjyFj1mIjy7yrSDCZ1usaBBJZOxbKknboC3m65hBUVROgMjbgDgQ-E5z3E-jq4O5RRtUtkNPKfUhL61pCd29zfNBK2uUIsNeWKrA',
      role: 'HR Admin', 
      permissions: 'Full Access', 
      status: 'Inactive' 
    }
  ];

  filteredUsers: User[] = [];
  displayedUsers: User[] = [];

  searchQuery: string = '';
  showFilterPanel: boolean = false;
  activeFilterCount: number = 0;

  // Filters
  selectedRole: string = 'all';
  selectedStatus: string = 'all';
  selectedPermission: string = 'all';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;

  // Role options for filter
  roleOptions = ['HR Admin', 'Security Supervisor', 'Operations Manager'];
  permissionOptions = ['Full Access', 'View-only, Approval-rights', 'View-only'];
  statusOptions = ['Active', 'Inactive'];

  constructor() {}

  ngOnInit(): void {
    this.applyFilters();
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.filteredUsers.length);
  }

  applyFilters(): void {
    let result = [...this.users];

    // Search
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.permissions.toLowerCase().includes(query)
      );
    }

    // Role filter
    if (this.selectedRole !== 'all') {
      result = result.filter(user => user.role === this.selectedRole);
    }

    // Status filter
    if (this.selectedStatus !== 'all') {
      result = result.filter(user => user.status === this.selectedStatus);
    }

    // Permission filter
    if (this.selectedPermission !== 'all') {
      result = result.filter(user => user.permissions === this.selectedPermission);
    }

    this.filteredUsers = result;
    this.updateActiveFilterCount();
    this.currentPage = 1;
    this.updateDisplayedUsers();
  }

  updateDisplayedUsers(): void {
    this.displayedUsers = this.filteredUsers.slice(this.startIndex, this.endIndex);
  }

  updateActiveFilterCount(): void {
    let count = 0;
    if (this.selectedRole !== 'all') count++;
    if (this.selectedStatus !== 'all') count++;
    if (this.selectedPermission !== 'all') count++;
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
    this.selectedRole = 'all';
    this.selectedStatus = 'all';
    this.selectedPermission = 'all';
    this.applyFilters();
  }

  getRoleBadgeClass(role: string): string {
    return 'bg-[#2e3440] text-[#d8dee9]';
  }

  getPermissionBadgeClass(permission: string): string {
    switch(permission) {
      case 'Full Access':
        return 'bg-[rgba(76,175,80,0.2)] text-[#4CAF50]';
      case 'View-only, Approval-rights':
        return 'bg-[rgba(233,30,99,0.2)] text-[#E91E63]';
      case 'View-only':
        return 'bg-[rgba(255,152,0,0.2)] text-[#FF9800]';
      default:
        return 'bg-[rgba(158,158,158,0.2)] text-[#9E9E9E]';
    }
  }

  getStatusBadgeClass(status: string): string {
    return status === 'Active' 
      ? 'bg-[rgba(76,175,80,0.2)] text-[#4CAF50]'
      : 'bg-[rgba(158,158,158,0.2)] text-[#9E9E9E]';
  }

  openAssignRoleDialog(): void {
    const modalRef = this.modalService.open({
      title: 'Assign New Role',
      content: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Select User</label>
            <select class="w-full p-2 border rounded-md bg-background">
              <option value="">Choose a user</option>
              <option value="USR001">Sarah Chen</option>
              <option value="USR002">Mike Johnson</option>
              <option value="USR003">Emily Davis</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Role</label>
            <select class="w-full p-2 border rounded-md bg-background">
              <option value="">Select role</option>
              <option value="HR Admin">HR Admin</option>
              <option value="Security Supervisor">Security Supervisor</option>
              <option value="Operations Manager">Operations Manager</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Permissions</label>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input type="checkbox" class="rounded border-border"> Full Access
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" class="rounded border-border"> View-only
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" class="rounded border-border"> Approval Rights
              </label>
            </div>
          </div>
        </div>
      `,
      size: 'default'
    });

    modalRef.afterClosed$.subscribe((result: any) => {
      if (result?.success) {
        console.log('Role assigned successfully');
        // Here you would typically refresh the user list
      }
    });
  }

  viewAccessLogs(): void {
    console.log('Viewing access logs');
    // Navigate to access logs or open modal
  }

  editUser(user: User): void {
    console.log('Edit user:', user);
  }

  viewUserDetails(user: User): void {
    console.log('View user details:', user);
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updateDisplayedUsers();
  }

  onPageChange(event: any): void {
    this.currentPage = event;
    this.updateDisplayedUsers();
  }
}