import { Component, OnInit, inject, ViewChild, TemplateRef, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ButtonComponent, BadgeComponent,
  SelectComponent, SelectItemComponent,
  TooltipDirective, DropdownTriggerDirective, DropdownMenuComponent,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  LabelComponent, ModalService,
  DataTableComponent, TolleCellDirective, TableColumn,
  AlertDialogService, ToastService, InputComponent
} from '@tolle_/tolle-ui';
import { UserMgmtActions } from '../stores/user-mgmt.actions';
import { selectUsers, selectUserLoading, selectUserTotalCount } from '../stores/user-mgmt.selectors';
import { UserDto } from '../models/user-mgmt.model';
import { RoleActions } from '../../permissions-management/stores/role.actions';
import { selectRoles } from '../../permissions-management/stores/role.selectors';
import { RoleDto } from '../../permissions-management/models/role.model';
import { RegionActions } from '../../../operations/zone-management/stores/region.actions';
import { selectRegions } from '../../../operations/zone-management/stores/region.selectors';
import { RegionDto } from '../../../operations/zone-management/models/region.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, InputComponent,
    SelectComponent, SelectItemComponent,
 DropdownTriggerDirective, DropdownMenuComponent,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    LabelComponent,
    DataTableComponent, TolleCellDirective,
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  modalService = inject(ModalService);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);

  availableRoles: RoleDto[] = [];
  availableRegions: RegionDto[] = [];

  @ViewChild('assignRoleModal') assignRoleModal!: TemplateRef<any>;

  assignRoleForm: {
    userId: string;
    roleId: string;
    regionId?: string;
    isActing: boolean;
    actingEndDate?: string;
  } = { userId: '', roleId: '', isActing: false };

  regionIdFromParam?: string;

  get selectedRoleForForm(): RoleDto | undefined {
    return this.availableRoles.find(r => r.id === this.assignRoleForm.roleId);
  }

  get minActingDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  get maxActingDate(): string {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  }

  getRegionName(): string {
    if (!this.regionIdFromParam) return '';
    const region = this.availableRegions.find(r => r.id === this.regionIdFromParam);
    return region?.name || this.regionIdFromParam;
  }

  columns: TableColumn[] = [
    { key: 'user',    label: 'User' },
    { key: 'role',    label: 'Designated Role' },
    { key: 'scope',   label: 'Scope' },
    { key: 'status',  label: 'Status' },
    { key: 'actions', label: '', class: 'text-right' },
  ];

  users: UserDto[] = [];
  filteredUsers: UserDto[] = [];
  loading = false;
  totalCount = 0;

  showFilterPanel = false;
  searchQuery = '';
  selectedStatus = 'all';

  get activeCount()   { return this.users.filter(u => u.isActive).length; }
  get inactiveCount() { return this.users.filter(u => !u.isActive).length; }

  get activeFilterCount(): number {
    let count = 0;
    if (this.selectedStatus !== 'all') count++;
    return count;
  }

  ngOnInit(): void {
    this.store.dispatch(UserMgmtActions.loadUsers({}));
    this.store.dispatch(RoleActions.loadRoles({}));

    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        if (params['assignRoleToRegion']) {
          this.regionIdFromParam = params['assignRoleToRegion'];
          const region = this.availableRegions.find(r => r.id === this.regionIdFromParam);
          if (region) {
            this.assignRoleForm.regionId = region.id;
          }
        }
      });

    this.store.select(selectRoles)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(roles => this.availableRoles = roles);

    this.store.select(selectUsers)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(users => {
        this.users = users;
        this.applyFilter();
        if (this.regionIdFromParam && !this.assignRoleForm.regionId) {
          const region = this.availableRegions.find(r => r.id === this.regionIdFromParam);
          if (region) {
            this.assignRoleForm.regionId = region.id;
          }
        }
      });

    this.store.select(selectUserLoading)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(loading => this.loading = loading);

    this.store.select(selectUserTotalCount)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(total => this.totalCount = total);

    this.store.dispatch(RegionActions.loadRegions({}));
    this.store.select(selectRegions)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(regions => {
        this.availableRegions = regions;
        if (this.regionIdFromParam && !this.assignRoleForm.regionId) {
          const region = regions.find(r => r.id === this.regionIdFromParam);
          if (region) {
            this.assignRoleForm.regionId = region.id;
          }
        }
      });
  }

  applyFilter(): void {
    let result = [...this.users];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(u =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.staffId?.toLowerCase() ?? '').includes(q)
      );
    }
    if (this.selectedStatus === 'active')   result = result.filter(u => u.isActive);
    if (this.selectedStatus === 'inactive') result = result.filter(u => !u.isActive);
    this.filteredUsers = result;
  }

  onSearch(): void { this.applyFilter(); }
  toggleFilterPanel(): void { this.showFilterPanel = !this.showFilterPanel; }
  clearFilters(): void { this.selectedStatus = 'all'; this.applyFilter(); }

  getPrimaryRole(user: UserDto): string {
    return user.roles?.[0]?.roleName ?? '—';
  }

  getPrimaryScope(user: UserDto): string {
    return user.roles?.[0]?.scopeLevel ?? '—';
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  openAssignRoleDialog(user?: UserDto): void {
    this.assignRoleForm = { 
      userId: user?.id || '', 
      roleId: '', 
      isActing: false,
      actingEndDate: undefined,
      regionId: this.regionIdFromParam
    };
    this.modalService.open({
      title: 'Assign Role',
      content: this.assignRoleModal,
      size: 'default'
    });
  }

  submitAssignRole(): void {
    if (!this.assignRoleForm.userId || !this.assignRoleForm.roleId) {
      this.toast.show({ title: 'Validation Error', description: 'Please select a user and role.', variant: 'destructive' });
      return;
    }

    const dto: any = { roleId: this.assignRoleForm.roleId };
    if (this.assignRoleForm.regionId) dto.regionId = this.assignRoleForm.regionId;
    if (this.assignRoleForm.isActing) {
      dto.isActing = true;
      if (this.assignRoleForm.actingEndDate) dto.actingEndDate = this.assignRoleForm.actingEndDate;
    }

    this.store.dispatch(UserMgmtActions.assignRole({
      id: this.assignRoleForm.userId,
      dto
    }));
    this.modalService.closeAll();
    this.toast.show({ title: 'Role Assigned', description: 'User role has been updated.', variant: 'success' });
  }

  activateUser(user: UserDto): void {
    const dialogRef = this.alertDialog.open({
      title: 'Activate User?',
      description: `Activate "${user.fullName}"? They will be able to access the system.`,
      actionText: 'Activate',
      variant: 'default'
    });
    dialogRef.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      this.store.dispatch(UserMgmtActions.activateUser({
        id: user.id,
        dto: { roleId: user.roles?.[0]?.roleId ?? '' }
      }));
    });
  }

  deactivateUser(user: UserDto): void {
    const dialogRef = this.alertDialog.open({
      title: 'Deactivate User?',
      description: `Deactivate "${user.fullName}"? They will lose access to the system immediately.`,
      actionText: 'Deactivate',
      variant: 'destructive'
    });
    dialogRef.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      this.store.dispatch(UserMgmtActions.deactivateUser({ id: user.id }));
    });
  }

  deleteUser(user: UserDto): void {
    const ref = this.alertDialog.open({
      title: 'Delete User?',
      description: `Delete "${user.fullName}"? Their access will be revoked immediately.`,
      actionText: 'Delete',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      this.store.dispatch(UserMgmtActions.deleteUser({ id: user.id }));
    });
  }

}
