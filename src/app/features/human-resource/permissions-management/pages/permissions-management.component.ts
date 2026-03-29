import { Component, OnInit, inject, DestroyRef, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonComponent, BadgeComponent, InputComponent, LabelComponent, CardComponent, CardContentComponent, BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent, TooltipDirective, SelectComponent, SelectItemComponent, HoverCardComponent, HoverCardTriggerComponent, HoverCardContentComponent, ModalService, ToastService, AlertDialogService, SwitchComponent } from '@tolle_/tolle-ui';
import { PermissionActions } from '../stores/permission.actions';
import { selectPermissions, selectPermissionLoading } from '../stores/permission.selectors';
import { RoleActions } from '../stores/role.actions';
import { selectRoles, selectRoleLoading, selectRoleSaving } from '../stores/role.selectors';
import { PermissionDetailDto } from '../models/permission.model';
import { RoleDto, CreateRoleDto } from '../models/role.model';

interface AppPermission {
  id: string;         // permission code (used as key)
  permId: string;     // actual permission UUID
  category: string;
  action: string;
  description: string;
  type: 'view' | 'create' | 'approve';
}

@Component({
  selector: 'app-permissions-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, InputComponent, LabelComponent,
    CardComponent, CardContentComponent,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent,
    BreadcrumbSeparatorComponent,
    SelectComponent, SelectItemComponent,
    SwitchComponent
],
  templateUrl: './permissions-management.component.html',
  styleUrl: './permissions-management.component.css'
})
export class PermissionsManagementComponent implements OnInit {
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);
  private modalService = inject(ModalService);
  private toast = inject(ToastService);
  private alertDialog = inject(AlertDialogService);

  @ViewChild('createRoleModal') createRoleModal!: TemplateRef<any>;

  // ── Data from store ──────────────────────────────────────────────────────
  roles: RoleDto[] = [];
  allPermissions: AppPermission[] = [];
  permissionLoading = false;
  roleLoading = false;
  roleSaving = false;

  // ── UI state ─────────────────────────────────────────────────────────────
  selectedRoleId: string | null = null;
  pendingPermissions: Set<string> = new Set(); // codes of enabled permissions for selected role
  unsaved = false;
  savedIndicatorVisible = false;
  categories: string[] = [];
  expandedCategories: Set<string> = new Set();

  // ── Create role modal ─────────────────────────────────────────────────────
  createForm: CreateRoleDto = { name: '', description: '', scopeLevel: 'Global', approvalLevel: 'None' };
  scopeOptions = ['Global', 'Regional', 'Site'];
  approvalOptions = ['None', 'SiteLevel', 'RegionalLevel', 'GlobalLevel'];

  get selectedRole(): RoleDto | null {
    return this.roles.find(r => r.id === this.selectedRoleId) ?? null;
  }

  ngOnInit(): void {
    this.store.dispatch(PermissionActions.loadPermissions({}));
    this.store.dispatch(PermissionActions.loadPermissionCategories({}));
    this.store.dispatch(RoleActions.loadRoles({}));

    this.store.select(selectPermissionLoading)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(l => this.permissionLoading = l);

    this.store.select(selectRoleLoading)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(l => this.roleLoading = l);

    this.store.select(selectRoleSaving)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(s => this.roleSaving = s);

    this.store.select(selectPermissions)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(perms => {
        this.allPermissions = perms.map(p => ({
          id: p.code,
          permId: p.id,
          category: p.categoryName,
          action: p.name,
          description: p.description ?? '',
          type: this.inferType(p.code),
        }));
        this.categories = [...new Set(this.allPermissions.map(p => p.category))];
        this.expandedCategories = new Set(this.categories);
      });

    this.store.select(selectRoles)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(roles => {
        this.roles = roles;
        if (!this.selectedRoleId && roles.length > 0) {
          this.selectRole(roles[0].id);
        } else if (this.selectedRoleId) {
          // Refresh pending permissions if the selected role was updated
          const updated = roles.find(r => r.id === this.selectedRoleId);
          if (updated && !this.unsaved) {
            this.pendingPermissions = new Set(updated.permissions);
          }
        }
      });
  }

  selectRole(id: string): void {
    if (this.unsaved) {
      const confirmed = confirm('You have unsaved changes. Discard them?');
      if (!confirmed) return;
    }
    this.selectedRoleId = id;
    const role = this.roles.find(r => r.id === id);
    this.pendingPermissions = new Set(role?.permissions ?? []);
    this.unsaved = false;
  }

  isEnabled(code: string): boolean {
    return this.pendingPermissions.has(code);
  }

  toggle(code: string): void {
    if (this.pendingPermissions.has(code)) {
      this.pendingPermissions.delete(code);
    } else {
      this.pendingPermissions.add(code);
    }
    this.unsaved = true;
  }

  savePermissions(): void {
    if (!this.selectedRoleId) return;
    // Map codes back to UUIDs
    const permissionIds = this.allPermissions
      .filter(p => this.pendingPermissions.has(p.id))
      .map(p => p.permId);

    this.store.dispatch(RoleActions.setRolePermissions({
      id: this.selectedRoleId,
      dto: { permissionIds }
    }));

    // Listen for success
    this.store.select(selectRoleSaving)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(saving => {
        if (!saving && this.unsaved) {
          this.unsaved = false;
          this.savedIndicatorVisible = true;
          setTimeout(() => { this.savedIndicatorVisible = false; }, 3000);
          this.toast.show({ title: 'Saved', description: 'Role permissions updated.', variant: 'success' });
        }
      });
  }

  resetRole(): void {
    const role = this.selectedRole;
    if (!role) return;
    this.pendingPermissions = new Set(role.permissions);
    this.unsaved = false;
  }

  getEnabledCount(role: RoleDto): number {
    return role.permissions.length;
  }

  getEnabledBarWidth(role: RoleDto): string {
    const total = this.allPermissions.length || 1;
    return `${(role.permissions.length / total) * 100}%`;
  }

  getEnabledCountInCategory(cat: string): number {
    return this.allPermissions.filter(p => p.category === cat && this.pendingPermissions.has(p.id)).length;
  }

  getPermissionsInCategory(cat: string): AppPermission[] {
    return this.allPermissions.filter(p => p.category === cat);
  }

  toggleCategory(cat: string): void {
    if (this.expandedCategories.has(cat)) {
      this.expandedCategories.delete(cat);
    } else {
      this.expandedCategories.add(cat);
    }
  }

  isCategoryExpanded(cat: string): boolean { return this.expandedCategories.has(cat); }
  expandAllCategories(): void { this.categories.forEach(c => this.expandedCategories.add(c)); }
  collapseAllCategories(): void { this.expandedCategories.clear(); }
  trackCategory(i: number, cat: string): string { return cat; }

  openCreateRoleModal(): void {
    this.createForm = { name: '', description: '', scopeLevel: 'Global', approvalLevel: 'None' };
    this.modalService.open({ title: 'New Role', content: this.createRoleModal, size: 'default' });
  }

  closeModal(): void {
    this.modalService.closeAll();
  }

  submitCreateRole(): void {
    if (!this.createForm.name.trim()) return;
    this.store.dispatch(RoleActions.createRole({ dto: { ...this.createForm } }));
    this.modalService.closeAll();
    this.toast.show({ title: 'Role Created', description: `"${this.createForm.name}" has been created.`, variant: 'success' });
  }

  deleteRole(role: RoleDto): void {
    if (role.isSystem) {
      this.toast.show({ title: 'Not Allowed', description: 'System roles cannot be deleted.', variant: 'destructive' });
      return;
    }
    const ref = this.alertDialog.open({
      title: 'Delete Role?',
      description: `Delete "${role.name}"? This cannot be undone.`,
      actionText: 'Delete',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      this.store.dispatch(RoleActions.deleteRole({ id: role.id }));
      if (this.selectedRoleId === role.id) {
        this.selectedRoleId = null;
        this.pendingPermissions.clear();
      }
    });
  }

  getScopeBg(scope: string): string {
    const map: Record<string, string> = {
      Global:   'rgba(241,68,68,0.15)',
      Regional: 'rgba(255,152,0,0.15)',
      Site:     'rgba(96,125,139,0.15)',
    };
    return map[scope] ?? 'rgba(148,163,184,0.15)';
  }

  getScopeFg(scope: string): string {
    const map: Record<string, string> = {
      Global:   '#f14444',
      Regional: '#FF9800',
      Site:     '#607D8B',
    };
    return map[scope] ?? '#64748b';
  }

  getToggleClasses(code: string): string {
    return this.pendingPermissions.has(code) ? 'bg-primary' : 'bg-border';
  }

  getCategoryIcon(cat: string): string {
    const map: Record<string, string> = {
      'User Management':    'ri-user-settings-line',
      'Guard Management':   'ri-shield-user-line',
      'Shift & Attendance': 'ri-calendar-check-line',
      'Financial Requests': 'ri-money-dollar-circle-line',
      'Client Management':  'ri-building-2-line',
      'Reporting':          'ri-bar-chart-line',
    };
    return map[cat] ?? 'ri-list-check';
  }

  getTypeBg(type: string): string {
    const map: Record<string, string> = {
      view:    'rgba(33,150,243,0.15)',
      create:  'rgba(76,175,80,0.15)',
      approve: 'rgba(156,39,176,0.15)',
    };
    return map[type] ?? 'transparent';
  }

  getTypeFg(type: string): string {
    const map: Record<string, string> = {
      view:    '#2196F3',
      create:  '#4CAF50',
      approve: '#9C27B0',
    };
    return map[type] ?? '#000';
  }

  private inferType(code: string): 'view' | 'create' | 'approve' {
    const lower = code.toLowerCase();
    if (lower.includes('approve') || lower.includes('reject') || lower.includes('suspend') || lower.includes('deactivate')) return 'approve';
    if (lower.includes('view') || lower.includes('list') || lower.includes('read')) return 'view';
    return 'create';
  }
}
