import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, BadgeComponent,
  CardComponent, CardContentComponent,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent,
  BreadcrumbSeparatorComponent, TooltipDirective, ModalService
} from '@tolle_/tolle-ui';
import { UserRole, UserScope } from '../../core/models/rbac.models';

interface AppPermission {
  id: string;
  category: string;
  action: string;
  description: string;
  type: 'view' | 'create' | 'approve';
  approvalNote?: string;
}

interface RoleConfig {
  role: UserRole;
  label: string;
  scope: UserScope;
  color: string;
  description: string;
  permissions: Record<string, boolean>;
  lockedOff: Record<string, string>;
}

const LOCK_APPROVE = 'Approve actions are restricted to senior roles only';
const LOCK_REPORT  = 'System-wide reports require global scope access';
const LOCK_AUDIT   = 'Audit logs are restricted to Admin, MD, Ops, HR, or Procurement roles';
const LOCK_FINANCE = 'Financial approval requires Procurement Officer or higher authority';

const ALL_PERMISSIONS: AppPermission[] = [
  // User Management
  { id: 'um_view',       category: 'User Management',    action: 'View Users',         description: 'View user accounts and profiles',                        type: 'view' },
  { id: 'um_create',     category: 'User Management',    action: 'Create User',        description: 'Create new user accounts',                               type: 'create',  approvalNote: 'New accounts require HR or Admin approval before activation' },
  { id: 'um_approve',    category: 'User Management',    action: 'Approve User',       description: 'Approve pending user account requests',                  type: 'approve' },
  { id: 'um_edit',       category: 'User Management',    action: 'Edit User',          description: 'Edit existing user account details',                     type: 'create' },
  { id: 'um_deactivate', category: 'User Management',    action: 'Deactivate User',    description: 'Deactivate user accounts from the system',               type: 'approve' },

  // Guard Management
  { id: 'gm_view',    category: 'Guard Management', action: 'View Guards',     description: 'View guard profiles and current assignments',              type: 'view' },
  { id: 'gm_create',  category: 'Guard Management', action: 'Register Guard',  description: 'Register new guard personnel in the system',              type: 'create',  approvalNote: 'Guard registration must be countersigned by HR or Operations' },
  { id: 'gm_approve', category: 'Guard Management', action: 'Approve Guard',   description: 'Approve guard registration or reactivation requests',     type: 'approve' },
  { id: 'gm_edit',    category: 'Guard Management', action: 'Edit Guard',      description: 'Update guard profile and employment details',             type: 'create' },
  { id: 'gm_assign',  category: 'Guard Management', action: 'Assign Guard',    description: 'Assign guards to sites and shifts',                       type: 'create' },
  { id: 'gm_suspend', category: 'Guard Management', action: 'Suspend Guard',   description: 'Temporarily suspend a guard from duty',                   type: 'approve' },

  // Shift & Attendance
  { id: 'sa_view',     category: 'Shift & Attendance', action: 'View Shifts',           description: 'View shift schedules and attendance records',             type: 'view' },
  { id: 'sa_create',   category: 'Shift & Attendance', action: 'Create Shift',          description: 'Create and publish new shift schedules',                  type: 'create' },
  { id: 'sa_approve',  category: 'Shift & Attendance', action: 'Approve Shift Changes', description: 'Approve shift modification or swap requests',              type: 'approve' },
  { id: 'sa_checkin',  category: 'Shift & Attendance', action: 'Check In / Out',        description: 'Record guard check-in and check-out events',              type: 'create' },
  { id: 'sa_override', category: 'Shift & Attendance', action: 'Override Attendance',   description: 'Override or retroactively correct attendance records',     type: 'approve' },

  // Financial Requests
  { id: 'fr_view',      category: 'Financial Requests', action: 'View Requests',    description: 'View petty cash and financial request records',          type: 'view' },
  { id: 'fr_create',    category: 'Financial Requests', action: 'Submit Request',   description: 'Submit new petty cash or financial requests',            type: 'create' },
  { id: 'fr_approve',   category: 'Financial Requests', action: 'Approve Request',  description: 'Approve or reject financial requests',                   type: 'approve', approvalNote: 'Approval escalates to Procurement Officer or senior management' },
  { id: 'fr_replenish', category: 'Financial Requests', action: 'Replenish Funds',  description: 'Process petty cash replenishment transactions',          type: 'approve' },
  { id: 'fr_audit',     category: 'Financial Requests', action: 'Audit Finances',   description: 'Access financial audit trail and transaction history',   type: 'approve' },

  // Client Management
  { id: 'cm_view',    category: 'Client Management', action: 'View Clients',     description: 'View client records, contracts and site details',        type: 'view' },
  { id: 'cm_create',  category: 'Client Management', action: 'Create Client',    description: 'Register new client accounts and contracts',             type: 'create' },
  { id: 'cm_approve', category: 'Client Management', action: 'Approve Client',   description: 'Approve new client onboarding requests',                 type: 'approve' },
  { id: 'cm_edit',    category: 'Client Management', action: 'Edit Client',      description: 'Update client information and contract terms',           type: 'create' },
  { id: 'cm_suspend', category: 'Client Management', action: 'Suspend Client',   description: 'Suspend an active client account',                       type: 'approve' },

  // Reporting
  { id: 'rp_view_own',  category: 'Reporting', action: 'View Own Reports',  description: 'View reports scoped to own site or region',             type: 'view' },
  { id: 'rp_view_all',  category: 'Reporting', action: 'View All Reports',  description: 'View system-wide reports across all scopes',            type: 'view' },
  { id: 'rp_export',    category: 'Reporting', action: 'Export Reports',    description: 'Export reports to CSV or PDF format',                   type: 'create' },
  { id: 'rp_audit_log', category: 'Reporting', action: 'View Audit Log',    description: 'Access the system audit trail and activity logs',       type: 'approve' },
];

const ROLE_CONFIGS: RoleConfig[] = [
  {
    role: 'Admin',
    label: 'Admin',
    scope: 'global',
    color: '#f14444',
    description: 'Full system access with complete override authority',
    permissions: Object.fromEntries(ALL_PERMISSIONS.map(p => [p.id, true])),
    lockedOff: {}
  },
  {
    role: 'ManagingDirector',
    label: 'Managing Director',
    scope: 'global',
    color: '#9C27B0',
    description: 'Executive oversight across all operations and departments',
    permissions: Object.fromEntries(ALL_PERMISSIONS.map(p => [p.id, true])),
    lockedOff: {}
  },
  {
    role: 'OperationsDirector',
    label: 'Operations Director',
    scope: 'global',
    color: '#2196F3',
    description: 'Manages field operations, guard deployment, and shift scheduling',
    permissions: {
      um_view: true,  um_create: false, um_approve: false, um_edit: false, um_deactivate: false,
      gm_view: true,  gm_create: true,  gm_approve: true,  gm_edit: true,  gm_assign: true, gm_suspend: true,
      sa_view: true,  sa_create: true,  sa_approve: true,  sa_checkin: true, sa_override: true,
      fr_view: true,  fr_create: true,  fr_approve: false, fr_replenish: false, fr_audit: true,
      cm_view: true,  cm_create: true,  cm_approve: true,  cm_edit: true,  cm_suspend: true,
      rp_view_own: true, rp_view_all: true, rp_export: true, rp_audit_log: true
    },
    lockedOff: {}
  },
  {
    role: 'HRManager',
    label: 'HR Manager',
    scope: 'global',
    color: '#009688',
    description: 'Handles staff records, user accounts, and leave management',
    permissions: {
      um_view: true,  um_create: true,  um_approve: true,  um_edit: true,  um_deactivate: true,
      gm_view: true,  gm_create: true,  gm_approve: true,  gm_edit: true,  gm_assign: true, gm_suspend: true,
      sa_view: true,  sa_create: false, sa_approve: false, sa_checkin: false, sa_override: false,
      fr_view: true,  fr_create: true,  fr_approve: true,  fr_replenish: true, fr_audit: true,
      cm_view: true,  cm_create: true,  cm_approve: true,  cm_edit: true,  cm_suspend: true,
      rp_view_own: true, rp_view_all: true, rp_export: true, rp_audit_log: true
    },
    lockedOff: {}
  },
  {
    role: 'ProcurementOfficer',
    label: 'Procurement Officer',
    scope: 'global',
    color: '#FF9800',
    description: 'Controls procurement workflows and financial requests',
    permissions: {
      um_view: false, um_create: false, um_approve: false, um_edit: false, um_deactivate: false,
      gm_view: false, gm_create: false, gm_approve: false, gm_edit: false, gm_assign: false, gm_suspend: false,
      sa_view: false, sa_create: false, sa_approve: false, sa_checkin: false, sa_override: false,
      fr_view: true,  fr_create: true,  fr_approve: true,  fr_replenish: true, fr_audit: true,
      cm_view: false, cm_create: false, cm_approve: false, cm_edit: false, cm_suspend: false,
      rp_view_own: true, rp_view_all: true, rp_export: true, rp_audit_log: false
    },
    lockedOff: {}
  },
  {
    role: 'ZonalCommander',
    label: 'Zonal Commander',
    scope: 'regional',
    color: '#673AB7',
    description: 'Oversees guard operations across an assigned region',
    permissions: {
      um_view: false, um_create: true,  um_approve: false, um_edit: false, um_deactivate: false,
      gm_view: true,  gm_create: true,  gm_approve: false, gm_edit: true,  gm_assign: true, gm_suspend: false,
      sa_view: true,  sa_create: true,  sa_approve: true,  sa_checkin: true, sa_override: false,
      fr_view: true,  fr_create: true,  fr_approve: false, fr_replenish: false, fr_audit: false,
      cm_view: true,  cm_create: false, cm_approve: false, cm_edit: false, cm_suspend: false,
      rp_view_own: true, rp_view_all: false, rp_export: true, rp_audit_log: false
    },
    lockedOff: {
      um_approve: LOCK_APPROVE, um_deactivate: LOCK_APPROVE,
      gm_approve: LOCK_APPROVE, gm_suspend: LOCK_APPROVE,
      sa_override: LOCK_APPROVE,
      fr_approve: LOCK_FINANCE, fr_replenish: LOCK_FINANCE,
      cm_approve: LOCK_APPROVE, cm_suspend: LOCK_APPROVE,
      rp_view_all: LOCK_REPORT, rp_audit_log: LOCK_AUDIT
    }
  },
  {
    role: 'SiteSupervisor',
    label: 'Site Supervisor',
    scope: 'site',
    color: '#607D8B',
    description: 'Manages day-to-day operations at an assigned site',
    permissions: {
      um_view: false, um_create: false, um_approve: false, um_edit: false, um_deactivate: false,
      gm_view: true,  gm_create: false, gm_approve: false, gm_edit: false, gm_assign: false, gm_suspend: false,
      sa_view: true,  sa_create: true,  sa_approve: false, sa_checkin: true, sa_override: false,
      fr_view: true,  fr_create: true,  fr_approve: false, fr_replenish: false, fr_audit: false,
      cm_view: false, cm_create: false, cm_approve: false, cm_edit: false, cm_suspend: false,
      rp_view_own: true, rp_view_all: false, rp_export: false, rp_audit_log: false
    },
    lockedOff: {
      um_approve: LOCK_APPROVE, um_deactivate: LOCK_APPROVE,
      gm_approve: LOCK_APPROVE, gm_suspend: LOCK_APPROVE,
      sa_approve: LOCK_APPROVE, sa_override: LOCK_APPROVE,
      fr_approve: LOCK_FINANCE, fr_replenish: LOCK_FINANCE,
      cm_approve: LOCK_APPROVE, cm_suspend: LOCK_APPROVE,
      rp_view_all: LOCK_REPORT, rp_audit_log: LOCK_AUDIT
    }
  },
  {
    role: 'Guard',
    label: 'Guard',
    scope: 'site',
    color: '#787878',
    description: 'Field personnel with limited operational access',
    permissions: {
      um_view: false, um_create: false, um_approve: false, um_edit: false, um_deactivate: false,
      gm_view: false, gm_create: false, gm_approve: false, gm_edit: false, gm_assign: false, gm_suspend: false,
      sa_view: true,  sa_create: false, sa_approve: false, sa_checkin: true, sa_override: false,
      fr_view: false, fr_create: false, fr_approve: false, fr_replenish: false, fr_audit: false,
      cm_view: false, cm_create: false, cm_approve: false, cm_edit: false, cm_suspend: false,
      rp_view_own: false, rp_view_all: false, rp_export: false, rp_audit_log: false
    },
    lockedOff: {
      um_approve: LOCK_APPROVE, um_deactivate: LOCK_APPROVE,
      gm_approve: LOCK_APPROVE, gm_suspend: LOCK_APPROVE,
      sa_approve: LOCK_APPROVE, sa_override: LOCK_APPROVE,
      fr_view: LOCK_FINANCE, fr_create: LOCK_FINANCE, fr_approve: LOCK_FINANCE, fr_replenish: LOCK_FINANCE, fr_audit: LOCK_AUDIT,
      cm_approve: LOCK_APPROVE, cm_suspend: LOCK_APPROVE,
      rp_view_own: LOCK_REPORT, rp_view_all: LOCK_REPORT, rp_export: LOCK_REPORT, rp_audit_log: LOCK_AUDIT
    }
  }
];

@Component({
  selector: 'app-permissions-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, BadgeComponent,
    CardComponent, CardContentComponent,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent,
    BreadcrumbSeparatorComponent, TooltipDirective
  ],
  templateUrl: './permissions-management.component.html',
  styleUrl: './permissions-management.component.css'
})
export class PermissionsManagementComponent implements OnInit {
  private modalService = inject(ModalService);
  @ViewChild('permInfoModal') permInfoModal!: TemplateRef<any>;

  readonly allPermissions = ALL_PERMISSIONS;
  roleConfigs: RoleConfig[] = JSON.parse(JSON.stringify(ROLE_CONFIGS));
  selectedRole: UserRole = 'Admin';
  unsaved = false;
  savedIndicatorVisible = false;
  categories: string[] = [];

  get selectedRoleConfig(): RoleConfig {
    return this.roleConfigs.find(r => r.role === this.selectedRole)!;
  }

  ngOnInit(): void {
    this.categories = [...new Set(ALL_PERMISSIONS.map(p => p.category))];

    const saved = localStorage.getItem('rolePermissions');
    if (saved) {
      try {
        const parsed: Record<string, Record<string, boolean>> = JSON.parse(saved);
        this.roleConfigs.forEach(rc => {
          if (parsed[rc.role]) {
            Object.keys(parsed[rc.role]).forEach(permId => {
              if (!rc.lockedOff[permId] && permId in rc.permissions) {
                rc.permissions[permId] = parsed[rc.role][permId];
              }
            });
          }
        });
      } catch { /* ignore parse errors */ }
    }
  }

  selectRole(role: UserRole): void {
    this.selectedRole = role;
  }

  getPermissionsInCategory(cat: string): AppPermission[] {
    return ALL_PERMISSIONS.filter(p => p.category === cat);
  }

  getEnabledCountInCategory(cat: string): number {
    const rc = this.selectedRoleConfig;
    return ALL_PERMISSIONS.filter(p => p.category === cat && rc.permissions[p.id] && !rc.lockedOff[p.id]).length;
  }

  isEnabled(permId: string): boolean {
    return !!this.selectedRoleConfig.permissions[permId];
  }

  isLocked(perm: AppPermission): boolean {
    return !!this.selectedRoleConfig.lockedOff[perm.id];
  }

  getLockReason(permId: string): string {
    return this.selectedRoleConfig.lockedOff[permId] ?? '';
  }

  toggle(permId: string): void {
    const rc = this.selectedRoleConfig;
    if (rc.lockedOff[permId]) return;
    rc.permissions[permId] = !rc.permissions[permId];
    this.unsaved = true;
  }

  savePermissions(): void {
    const toSave: Record<string, Record<string, boolean>> = {};
    this.roleConfigs.forEach(rc => {
      toSave[rc.role] = { ...rc.permissions };
    });
    localStorage.setItem('rolePermissions', JSON.stringify(toSave));
    this.unsaved = false;
    this.savedIndicatorVisible = true;
    setTimeout(() => { this.savedIndicatorVisible = false; }, 3000);
  }

  resetRole(): void {
    const defaults = ROLE_CONFIGS.find(r => r.role === this.selectedRole)!;
    const rc = this.selectedRoleConfig;
    rc.permissions = { ...defaults.permissions };
    this.unsaved = true;
  }

  getEnabledCount(role: UserRole): number {
    const rc = this.roleConfigs.find(r => r.role === role)!;
    return Object.values(rc.permissions).filter(Boolean).length;
  }

  getEnabledBarWidth(role: UserRole): string {
    return `${(this.getEnabledCount(role) / ALL_PERMISSIONS.length) * 100}%`;
  }

  getToggleClasses(permId: string): string {
    const rc = this.selectedRoleConfig;
    if (rc.lockedOff[permId]) return 'bg-muted cursor-not-allowed opacity-50';
    return rc.permissions[permId] ? 'bg-primary' : 'bg-border';
  }

  getCategoryIcon(cat: string): string {
    const map: Record<string, string> = {
      'User Management':    'ri-user-settings-line',
      'Guard Management':   'ri-shield-user-line',
      'Shift & Attendance': 'ri-calendar-check-line',
      'Financial Requests': 'ri-money-dollar-circle-line',
      'Client Management':  'ri-building-2-line',
      'Reporting':          'ri-bar-chart-line'
    };
    return map[cat] ?? 'ri-list-check';
  }

  getTypeBg(type: string): string {
    const map: Record<string, string> = {
      view:    'rgba(33, 150, 243, 0.15)',
      create:  'rgba(76, 175, 80, 0.15)',
      approve: 'rgba(156, 39, 176, 0.15)'
    };
    return map[type] ?? 'transparent';
  }

  getTypeFg(type: string): string {
    const map: Record<string, string> = {
      view:    '#2196F3',
      create:  '#4CAF50',
      approve: '#9C27B0'
    };
    return map[type] ?? '#000';
  }

  getScopeBg(scope: UserScope): string {
    const map: Record<UserScope, string> = {
      global:   'rgba(241, 68, 68, 0.15)',
      regional: 'rgba(255, 152, 0, 0.15)',
      site:     'rgba(96, 125, 139, 0.15)'
    };
    return map[scope];
  }

  getScopeFg(scope: UserScope): string {
    const map: Record<UserScope, string> = {
      global:   '#f14444',
      regional: '#FF9800',
      site:     '#607D8B'
    };
    return map[scope];
  }

  viewPermissionInfo(perm: AppPermission): void {
    this.modalService.open({
      title: perm.action,
      backdropClose: true,
      size: 'default',
      showCloseButton: true,
      content: this.permInfoModal,
      context: { perm }
    });
  }

  trackCategory(i: number, cat: string): string {
    return cat;
  }
}
