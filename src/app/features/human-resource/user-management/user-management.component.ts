import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent,
  SelectComponent, SelectItemComponent,
  TooltipDirective, DropdownTriggerDirective, DropdownMenuComponent,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  LabelComponent, ModalService,
  DataTableComponent, TolleCellDirective, TableColumn,
  AlertDialogService, ToastService
} from '@tolle_/tolle-ui';

interface User {
  id: string;
  name: string;
  role: 'HR Admin' | 'Security Supervisor' | 'Operations Manager';
  permissions: 'Full Access' | 'View-only, Approval-rights' | 'View-only';
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent,
    SelectComponent, SelectItemComponent,
    TooltipDirective, DropdownTriggerDirective, DropdownMenuComponent,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    LabelComponent,
    DataTableComponent, TolleCellDirective,
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  modalService = inject(ModalService);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);
  @ViewChild('assignRoleModal') assignRoleModal!: TemplateRef<any>;

  newRoleForm: { userId: string; role: User['role'] | ''; permissions: User['permissions'] | '' } = {
    userId: '',
    role: '',
    permissions: ''
  };

  columns: TableColumn[] = [
    { key: 'user', label: 'User' },
    { key: 'role', label: 'Designated Role' },
    { key: 'permissions', label: 'Permissions' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '' },
  ];

  users: User[] = [
    { id: 'USR001', name: 'Ama Boateng',      role: 'HR Admin',            permissions: 'Full Access',               status: 'Active' },
    { id: 'USR002', name: 'Kwame Mensah',     role: 'Security Supervisor', permissions: 'View-only, Approval-rights', status: 'Active' },
    { id: 'USR003', name: 'Abena Frimpong',   role: 'Operations Manager',  permissions: 'View-only',                 status: 'Inactive' },
    { id: 'USR004', name: 'Kofi Acheampong',  role: 'Operations Manager',  permissions: 'View-only',                 status: 'Active' },
    { id: 'USR005', name: 'Yaw Darko',        role: 'Operations Manager',  permissions: 'Full Access',               status: 'Inactive' },
    { id: 'USR006', name: 'Akosua Frimpong',  role: 'HR Admin',            permissions: 'Full Access',               status: 'Active' },
    { id: 'USR007', name: 'Nana Acheampong',  role: 'Security Supervisor', permissions: 'View-only, Approval-rights', status: 'Inactive' },
  ];

  filteredUsers: User[] = [];
  showFilterPanel = false;

  selectedRole = 'all';
  selectedStatus = 'all';
  selectedPermission = 'all';

  roleOptions = ['HR Admin', 'Security Supervisor', 'Operations Manager'];
  permissionOptions = ['Full Access', 'View-only, Approval-rights', 'View-only'];
  statusOptions = ['Active', 'Inactive'];

  get activeFilterCount(): number {
    let count = 0;
    if (this.selectedRole !== 'all') count++;
    if (this.selectedStatus !== 'all') count++;
    if (this.selectedPermission !== 'all') count++;
    return count;
  }

  ngOnInit(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    let result = [...this.users];
    if (this.selectedRole !== 'all') result = result.filter(u => u.role === this.selectedRole);
    if (this.selectedStatus !== 'all') result = result.filter(u => u.status === this.selectedStatus);
    if (this.selectedPermission !== 'all') result = result.filter(u => u.permissions === this.selectedPermission);
    this.filteredUsers = result;
  }

  toggleFilterPanel(): void { this.showFilterPanel = !this.showFilterPanel; }

  clearFilters(): void {
    this.selectedRole = 'all';
    this.selectedStatus = 'all';
    this.selectedPermission = 'all';
    this.applyFilter();
  }

  getPermissionBg(permission: string): string {
    const map: Record<string, string> = {
      'Full Access':               'rgba(76, 175, 80, 0.2)',
      'View-only, Approval-rights': 'rgba(233, 30, 99, 0.2)',
      'View-only':                  'rgba(255, 152, 0, 0.2)'
    };
    return map[permission] ?? 'rgba(158, 158, 158, 0.2)';
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  getPermissionFg(permission: string): string {
    const map: Record<string, string> = {
      'Full Access':               '#4CAF50',
      'View-only, Approval-rights': '#E91E63',
      'View-only':                  '#FF9800'
    };
    return map[permission] ?? '#9E9E9E';
  }

  openAssignRoleDialog(): void {
    this.newRoleForm = { userId: '', role: '', permissions: '' };
    this.modalService.open({
      title: 'Assign New Role',
      content: this.assignRoleModal,
      size: 'default'
    });
  }

  submitAssignRole(): void {
    if (!this.newRoleForm.userId || !this.newRoleForm.role || !this.newRoleForm.permissions) return;
    const user = this.users.find(u => u.id === this.newRoleForm.userId);
    if (user) {
      user.role = this.newRoleForm.role as User['role'];
      user.permissions = this.newRoleForm.permissions as User['permissions'];
      this.applyFilter();
    }
    this.modalService.closeAll();
    this.toast.show({ title: 'Role Assigned', description: `Role has been updated successfully.`, variant: 'success' });
  }

  viewAccessLogs(): void { console.log('Viewing access logs'); }
  editUser(user: User): void { console.log('Edit user:', user); }
  viewUserDetails(user: User): void { console.log('View user details:', user); }

  deleteUser(user: User) {
    const ref = this.alertDialog.open({
      title: 'Delete User?',
      description: `Delete "${user.name}"? Their access will be revoked immediately.`,
      actionText: 'Delete',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      this.users = this.users.filter(u => u.id !== user.id);
      this.applyFilter();
      this.toast.show({ title: 'User Deleted', description: `"${user.name}" has been removed.`, variant: 'destructive' });
    });
  }
}
