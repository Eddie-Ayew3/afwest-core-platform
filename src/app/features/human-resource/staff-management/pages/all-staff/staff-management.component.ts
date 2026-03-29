import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  ButtonComponent,
  BadgeComponent,
  TooltipDirective,
  DropdownTriggerDirective,
  DropdownMenuComponent,
  BreadcrumbComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkComponent,
  BreadcrumbSeparatorComponent,
  DataTableComponent,
  TolleCellDirective,
  TableColumn,
  AlertDialogService,
  ToastService
} from '@tolle_/tolle-ui';
import { GhanaSite } from '../../../../../core/models/rbac.models';
import { PermissionsService } from '../../../../../core/services/permissions.service';
import { StaffActions } from '../../stores/staff.actions';
import { selectStaff, selectStaffLoading, selectStaffSaving, selectStaffError } from '../../stores/staff.selectors';
import { StaffDto } from '../../models/staff.model';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Suspended' | 'Inactive';
  contact: string;
  site: GhanaSite;
}

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    BadgeComponent,
    TooltipDirective,
    DropdownTriggerDirective,
    DropdownMenuComponent,
    BreadcrumbComponent,
    BreadcrumbItemComponent,
    BreadcrumbLinkComponent,
    BreadcrumbSeparatorComponent,
    DataTableComponent,
    TolleCellDirective,
  ],
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.css']
})
export class StaffManagementComponent implements OnInit {
  private store = inject(Store);
  private permissions = inject(PermissionsService);
  private router = inject(Router);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);

  columns: TableColumn[] = [
    { key: 'fullName', label: 'Staff Name' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'contact', label: 'Contact' },
    { key: 'actions', label: 'Action', class: 'text-right' },
  ];

  staff$: Observable<StaffDto[]> = this.store.select(selectStaff);
  loading$: Observable<boolean> = this.store.select(selectStaffLoading);
  saving$: Observable<boolean> = this.store.select(selectStaffSaving);
  error$: Observable<string | null> = this.store.select(selectStaffError);

  staff: StaffDto[] = [];

  ngOnInit(): void {
    this.store.dispatch(StaffActions.loadStaff({ params: { pageNumber: 1, pageSize: 50 } }));

    this.staff$.subscribe(staff => {
      this.staff = staff;
    });
  }

  getPrimaryRole(roles: any[]): string {
    if (!roles || roles.length === 0) return 'No Role';
    return roles[0].roleName;
  }

  getStatusText(isActive: boolean, roles: any[]): 'Active' | 'Inactive' {
    return isActive ? 'Active' : 'Inactive';
  }

  viewPerson(person: StaffDto): void {
    this.router.navigate(['/hr/staff-management/view-staff', person.id]);
  }

  navigateToNewStaff(): void {
    this.router.navigate(['/hr/staff-management/new-staff']);
  }

  deleteStaff(staff: StaffDto) {
    const ref = this.alertDialog.open({
      title: 'Delete Staff Member?',
      description: `Remove "${staff.fullName}" from the system? This cannot be undone.`,
      actionText: 'Delete',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      this.store.dispatch(StaffActions.deleteStaff({ id: staff.id }));
    });
  }

  deactivateStaff(staff: StaffDto) {
    const ref = this.alertDialog.open({
      title: 'Deactivate Staff Member?',
      description: `Revoke access for "${staff.fullName}"?`,
      actionText: 'Deactivate',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      this.store.dispatch(StaffActions.deactivateStaff({ id: staff.id }));
    });
  }
}
