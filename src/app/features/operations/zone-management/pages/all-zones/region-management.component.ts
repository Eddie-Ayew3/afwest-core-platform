import { Component, OnInit, inject, ViewChild, TemplateRef, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ButtonComponent, BadgeComponent,
  InputComponent,
  SelectComponent, SelectItemComponent,
  DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  LabelComponent, ModalService,
  DataTableComponent, TolleCellDirective, TableColumn,
  AlertDialogService, ToastService,
  TextareaComponent
} from '@tolle_/tolle-ui';

import { selectRegions, selectRegionLoading, selectRegionSaving, selectRegionError, selectTotalCount } from '../../stores/region.selectors';
import { RegionDto, CreateRegionDto, UpdateRegionDto, AssignUserToRegionDto } from '../../models/region.model';
import { RegionActions } from '../../stores/region.actions';
import { UserMgmtService } from '../../../../human-resource/user-management/services/user-mgmt.service';
import { RoleDto } from '../../../../human-resource/permissions-management/models/role.model';
import { UserAccessDto } from '../../../../human-resource/user-management/models/user-mgmt.model';
import { RoleActions } from '../../../../human-resource/permissions-management/stores/role.actions';
import { selectRoles } from '../../../../human-resource/permissions-management/stores/role.selectors';


interface RegionFormModel {
  name: string;
  code: string;
  capital: string;
  description: string;
  isActive: boolean;
}

@Component({
  selector: 'app-region-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, BadgeComponent,
    InputComponent,
    SelectComponent, SelectItemComponent,
    DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    LabelComponent,TextareaComponent,
    DataTableComponent, TolleCellDirective,
  ],
  templateUrl: './region-management.component.html',
  styleUrls: ['./region-management.component.css']
})
export class RegionManagementComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  public modalService = inject(ModalService);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);
  private destroyRef = inject(DestroyRef);
  private userMgmtService = inject(UserMgmtService);

  @ViewChild('regionModal') regionModal!: TemplateRef<any>;
  @ViewChild('assignUserModal') assignUserModal!: TemplateRef<any>;

  availableRoles: RoleDto[] = [];
  availableUsers: UserAccessDto[] = [];
  assignUserForm: { userId: string; roleId: string; isActing: boolean; actingEndDate: string } = 
    { userId: '', roleId: '', isActing: false, actingEndDate: '' };
  currentRegionId?: string;

  get minActingDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  get maxActingDate(): string {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  }

  columns: TableColumn[] = [
    { key: 'region', label: 'Region' },
    { key: 'code', label: 'Code' },
    { key: 'capital', label: 'Capital' },
    { key: 'rolesScoped', label: 'Roles Assigned' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions', class:'text-right' },
  ];

  regions: RegionDto[] = [];
  filteredRegions: RegionDto[] = [];
  loading = false;
  saving = false;
  totalCount = 0;
  showFilterPanel = false;
  filterStatus = 'All';

  // Create modal state
  showCreateModal = false;
  createStep = 0;
  step1Error = '';
  creating = false;

  newRegion: RegionFormModel = this.emptyForm();

  get activeRegions() { return this.regions.filter(r => r.isActive).length; }
  get inactiveRegions() { return this.regions.filter(r => !r.isActive).length; }

  get activeFilterCount(): number {
    let c = 0;
    if (this.filterStatus !== 'All') c++;
    return c;
  }

  ngOnInit() {
    this.store.dispatch(RegionActions.loadRegions({ params: { pageNumber: 1, pageSize: 50 } }));
    this.store.dispatch(RoleActions.loadRoles({}));
    
    this.store.select(selectRegions)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(regions => {
        this.regions = regions;
        this.applyFilter();
      });

    this.store.select(selectRoles)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(roles => this.availableRoles = roles);

    this.userMgmtService.getAccessList().subscribe(users => this.availableUsers = users);

    this.store.select(selectTotalCount)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(total => this.totalCount = total);

    this.store.select(selectRegionLoading)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(loading => this.loading = loading);

    this.store.select(selectRegionSaving)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(saving => this.saving = saving);
  }

  applyFilter() {
    let result = [...this.regions];
    if (this.filterStatus === 'Active') result = result.filter(r => r.isActive);
    if (this.filterStatus === 'Inactive') result = result.filter(r => !r.isActive);
    this.filteredRegions = result;
  }

  toggleFilterPanel() { this.showFilterPanel = !this.showFilterPanel; }

  clearFilters() {
    this.filterStatus = 'All';
    this.applyFilter();
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  openCreateModal() {
    this.createStep = 0;
    this.step1Error = '';
    this.newRegion = this.emptyForm();
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  nextCreateStep() {
    if (!this.newRegion.name.trim()) {
      this.step1Error = 'Region name is required.';
      return;
    }
    if (!this.newRegion.code.trim()) {
      this.step1Error = 'Region code is required.';
      return;
    }
    this.step1Error = '';
    this.createStep = 1;
  }

  prevCreateStep() {
    this.createStep = 0;
  }

  private editingRegionId: string | null = null;

  editRegion(region: RegionDto) {
    this.showCreateModal = true;
    this.createStep = 1;
    this.editingRegionId = region.id;
    this.newRegion = {
      name: region.name,
      code: region.code,
      capital: region.capital || '',
      description: region.description || '',
      isActive: region.isActive
    };
  }

  submitRegion() {
    const dto: CreateRegionDto = {
      name: this.newRegion.name,
      code: this.newRegion.code,
      capital: this.newRegion.capital || undefined,
      description: this.newRegion.description || undefined
    };

    const updateDto: UpdateRegionDto = {
      ...dto,
      isActive: this.newRegion.isActive
    };

    if (this.editingRegionId) {
      this.store.dispatch(RegionActions.updateRegion({ id: this.editingRegionId, dto: updateDto }));
      this.editingRegionId = null;
    } else {
      this.store.dispatch(RegionActions.createRegion({ dto }));
    }
    this.showCreateModal = false;
  }

  private emptyForm(): RegionFormModel {
    return { name: '', code: '', capital: '', description: '', isActive: true };
  }

  deleteRegion(region: RegionDto) {
    const ref = this.alertDialog.open({
      title: 'Delete Region?',
      description: `Delete region "${region.name}"? This will deactivate the region.`,
      actionText: 'Delete',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.store.dispatch(RegionActions.deleteRegion({ id: region.id }));
      }
    });
  }

  viewRegion(region: RegionDto) {
    this.modalService.open({
      title: `Region Details – ${region.name}`,
      backdropClose: true,
      size: 'default',
      showCloseButton: true,
      content: this.regionModal,
      context: { region }
    });
  }

  openAssignUserModal(region: RegionDto): void {
    this.currentRegionId = region.id;
    this.assignUserForm = { userId: '', roleId: '', isActing: false, actingEndDate: '' };
    this.modalService.open({
      title: `Assign User to ${region.name}`,
      content: this.assignUserModal,
      size: 'default'
    });
  }

  submitAssignUser(): void {
    if (!this.currentRegionId || !this.assignUserForm.userId || !this.assignUserForm.roleId) {
      this.toast.show({ title: 'Validation Error', description: 'Please fill all required fields.', variant: 'destructive' });
      return;
    }
    if (this.assignUserForm.isActing && !this.assignUserForm.actingEndDate) {
      this.toast.show({ title: 'Validation Error', description: 'Acting end date is required.', variant: 'destructive' });
      return;
    }

    const dto: AssignUserToRegionDto = {
      userId: this.assignUserForm.userId,
      roleId: this.assignUserForm.roleId,
      isActing: this.assignUserForm.isActing,
      actingEndDate: this.assignUserForm.isActing ? this.assignUserForm.actingEndDate : undefined
    };

    this.store.dispatch(RegionActions.assignUserToRegion({ id: this.currentRegionId, dto }));
    this.modalService.closeAll();
  }

  isValidActingDate(): boolean {
    if (!this.assignUserForm.isActing || !this.assignUserForm.actingEndDate) return true;
    const selectedDate = new Date(this.assignUserForm.actingEndDate);
    const minDate = new Date(this.minActingDate);
    const maxDate = new Date(this.maxActingDate);
    return selectedDate >= minDate && selectedDate <= maxDate;
  }

  navigateToAssignRole(regionId: string) {
    this.router.navigate(['/hr/user-management'], {
      queryParams: { assignRoleToRegion: regionId }
    });
  }

  getStatusBg(isActive: boolean): string {
    return isActive ? 'rgba(34,197,94,0.15)' : 'rgba(148,163,184,0.15)';
  }

  getStatusFg(isActive: boolean): string {
    return isActive ? '#16a34a' : '#9CA3AF';
  }
}
