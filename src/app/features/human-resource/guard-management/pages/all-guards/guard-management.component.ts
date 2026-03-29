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
  ModalService,
  AlertDialogService
} from '@tolle_/tolle-ui';
import { PermissionsService } from '../../../../../core/services/permissions.service';
import { GhanaSite } from '../../../../../core/models/rbac.models';
import { GuardActions } from '../../stores/guard.actions';
import { selectGuards, selectGuardLoading, selectGuardSaving, selectGuardError } from '../../stores/guard.selectors';
import { GuardDto } from '../../models/guard.model';

interface Guard {
  id: string;
  name: string;
  role: string;
  status: 'pending-approval' | 'available' | 'rejected' | 'suspended' | 'inactive';
  contact: string;
  site: GhanaSite;
  dateRegistered?: Date;
  dateApproved?: Date;
  approvedBy?: string;
  rejectionReason?: string;
  registeredBy?: string;
}

@Component({
  selector: 'app-guard-management',
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
    TolleCellDirective
  ],
  templateUrl: './guard-management.component.html',
  styleUrls: ['./guard-management.component.css']
})
export class GuardManagementComponent implements OnInit {
  private store = inject(Store);
  private permissions = inject(PermissionsService);
  private router = inject(Router);
  private modalService = inject(ModalService);
  private alertDialog = inject(AlertDialogService);

  isHrContext = false;

  get canApproveGuards(): boolean {
    return this.permissions.role === 'OperationsDirector' || 
           this.permissions.role === 'ZonalCommander' ||
           this.permissions.role === 'Admin';
  }

  get canRegisterGuards(): boolean {
    return this.permissions.role === 'HRManager' || 
           this.permissions.role === 'Admin';
  }

  columns: TableColumn[] = [
    { key: 'fullName', label: 'Guard Name' },
    { key: 'employeeId', label: 'Employee ID' },
    { key: 'status', label: 'Status' },
    { key: 'contact', label: 'Contact' },
    { key: 'actions', label: '' },
  ];

  guards$: Observable<GuardDto[]> = this.store.select(selectGuards);
  loading$: Observable<boolean> = this.store.select(selectGuardLoading);
  saving$: Observable<boolean> = this.store.select(selectGuardSaving);
  error$: Observable<string | null> = this.store.select(selectGuardError);

  guards: GuardDto[] = [];

  ngOnInit(): void {
    this.isHrContext = this.router.url.startsWith('/hr/');
    this.store.dispatch(GuardActions.loadGuards({ params: { pageNumber: 1, pageSize: 50 } }));
    
    this.guards$ = this.store.select(selectGuards);
    this.loading$ = this.store.select(selectGuardLoading);
    this.saving$ = this.store.select(selectGuardSaving);
    this.error$ = this.store.select(selectGuardError);

    this.guards$.subscribe(guards => {
      this.guards = guards;
    });
  }

  viewGuard(guard: GuardDto): void {
    if (this.isHrContext) {
      this.router.navigate(['/hr/guard-management/view-guard', guard.id]);
    }
  }

  navigateToNewGuard(): void {
    this.router.navigate(['/hr/guard-management/new-guard']);
  }

  approveGuard(guard: GuardDto): void {
    const dialogRef = this.alertDialog.open({
      title: 'Approve Guard',
      description: `Are you sure you want to approve ${guard.fullName} (${guard.employeeId}) for deployment?`,
      actionText: 'Approve',
      variant: 'default'
    });

    dialogRef.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.store.dispatch(GuardActions.approveGuard({ id: guard.id }));
      }
    });
  }

  rejectGuard(guard: GuardDto): void {
    const dialogRef = this.alertDialog.open({
      title: 'Reject Guard',
      description: `Are you sure you want to reject ${guard.fullName} (${guard.employeeId})?`,
      actionText: 'Reject',
      variant: 'destructive'
    });

    dialogRef.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.store.dispatch(GuardActions.rejectGuard({ id: guard.id }));
      }
    });
  }

  deleteGuard(guard: GuardDto): void {
    const dialogRef = this.alertDialog.open({
      title: 'Terminate Guard',
      description: `Are you sure you want to terminate ${guard.fullName}? This cannot be undone.`,
      actionText: 'Terminate',
      variant: 'destructive'
    });

    dialogRef.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.store.dispatch(GuardActions.deleteGuard({ id: guard.id }));
      }
    });
  }

  getStatusColor(status: string): 'default' | 'destructive' | 'outline' | 'secondary' {
    const colorMap: { [key: string]: 'default' | 'destructive' | 'outline' | 'secondary' } = {
      'PendingApproval': 'outline',
      'Active': 'default',
      'Rejected': 'destructive',
      'Suspended': 'secondary'
    };
    return colorMap[status] || 'secondary';
  }

  getStatusText(status: string): string {
    const textMap: { [key: string]: string } = {
      'PendingApproval': 'Pending Approval',
      'Active': 'Available',
      'Rejected': 'Rejected',
      'Suspended': 'Suspended'
    };
    return textMap[status] || status;
  }
}
