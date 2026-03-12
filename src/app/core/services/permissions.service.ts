import { Injectable } from '@angular/core';
import { SidebarGroup } from '@tolle_/tolle-ui';
import { GhanaRegion, GhanaSite, LS, REGION_SITES, UserRole, UserScope } from '../models/rbac.models';

export type NavFeature =
  | 'overview'
  | 'hr_staff'
  | 'hr_guard'
  | 'hr_client'
  | 'hr_leave'
  | 'hr_user'
  | 'hr_permissions'
  | 'control_shift'
  | 'control_checkin'
  | 'procurement'
  | 'zone_management'
  | 'finance_payroll'
  | 'finance_payment';

const NAV_PERMISSIONS: Record<UserScope, NavFeature[]> = {
  global:   ['overview', 'hr_staff', 'hr_guard', 'hr_client', 'hr_leave', 'hr_user', 'hr_permissions', 'control_shift', 'control_checkin', 'procurement', 'zone_management', 'finance_payroll', 'finance_payment'],
  regional: ['overview', 'hr_staff', 'hr_guard', 'hr_client', 'hr_leave', 'control_shift', 'control_checkin', 'zone_management', 'finance_payroll'],
  site:     ['overview', 'hr_staff', 'hr_guard', 'control_shift', 'control_checkin']
};

const GUARD_FEATURES: NavFeature[] = ['overview', 'control_checkin'];

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  readonly role: UserRole;
  readonly scope: UserScope;
  readonly region: GhanaRegion | null;
  readonly site: GhanaSite | null;
  readonly displayName: string;
  readonly staffId: string;

  constructor() {
    this.role        = (localStorage.getItem(LS.userRole)        as UserRole)   ?? 'Guard';
    this.scope       = (localStorage.getItem(LS.userScope)       as UserScope)  ?? 'site';
    this.region      = (localStorage.getItem(LS.userRegion)      as GhanaRegion) || null;
    this.site        = (localStorage.getItem(LS.userSite)        as GhanaSite)  || null;
    this.displayName = localStorage.getItem(LS.userDisplayName) ?? 'User';
    this.staffId     = localStorage.getItem(LS.userStaffId)     ?? '';
  }

  isGlobal():   boolean { return this.scope === 'global'; }
  isRegional(): boolean { return this.scope === 'regional'; }
  isSite():     boolean { return this.scope === 'site'; }

  getAllowedSites(): GhanaSite[] {
    if (this.isGlobal()) return Object.values(REGION_SITES).flat() as GhanaSite[];
    if (this.isRegional() && this.region) return REGION_SITES[this.region] ?? [];
    if (this.site) return [this.site];
    return [];
  }

  filterBySite<T extends { site: string }>(items: T[]): T[] {
    if (this.isGlobal()) return items;
    const allowed = this.getAllowedSites();
    return items.filter(item => allowed.includes(item.site as GhanaSite));
  }

  filterByRegion<T extends { region: string }>(items: T[]): T[] {
    if (this.isSite()) return [];
    if (this.isGlobal()) return items;
    if (this.region) return items.filter(item => item.region === this.region);
    return items;
  }

  canSee(feature: NavFeature): boolean {
    if (this.role === 'Guard') return GUARD_FEATURES.includes(feature);
    return (NAV_PERMISSIONS[this.scope] ?? []).includes(feature);
  }

  buildSidebarItems(): SidebarGroup[] {
    const groups: SidebarGroup[] = [];

    // ── Main ──────────────────────────────────────────────────
    const mainItems: any[] = [];
    if (this.canSee('overview'))   mainItems.push({ title: 'Overview',          icon: 'ri-dashboard-line', url: '/dashboard' });
    if (this.canSee('hr_client')) mainItems.push({ title: 'Client Management', icon: 'ri-building-line',  url: '/client-management' });
    if (mainItems.length) groups.push({ title: 'Main', items: mainItems });

    // ── Platform ──────────────────────────────────────────────
    const platformItems: any[] = [];

    // HR
    const hrItems: any[] = [];
    if (this.canSee('hr_staff'))  hrItems.push({ title: 'Staff Management', url: '/hr/staff-management' });
    if (this.canSee('hr_guard'))  hrItems.push({ title: 'Guard Management',  url: '/hr/guard-management' });
    if (this.canSee('hr_client')) hrItems.push({ title: 'Client Management',       url: '/hr/client-management' });
    if (this.canSee('hr_leave'))  hrItems.push({ title: 'Leave Management',        url: '/hr/leave-management' });
    if (this.canSee('hr_user'))        hrItems.push({ title: 'User Management',        url: '/hr/user-management' });
    if (this.canSee('hr_permissions')) hrItems.push({ title: 'Permissions',            url: '/hr/permissions-management' });
    if (hrItems.length) platformItems.push({ title: 'HR', icon: 'ri-team-line', expanded: false, items: hrItems });

    // Control Unit
    const controlItems: any[] = [];
    if (this.canSee('control_shift'))    controlItems.push({ title: 'Shift Management',  url: '/control-unit/shift-management' });
    if (this.canSee('control_checkin')) controlItems.push({ title: 'Check In/Check Out', url: '/control-unit/check-in-out' });
    if (this.canSee('zone_management')) controlItems.push({ title: 'Zone Management',    url: '/zone-management' });
    if (controlItems.length) platformItems.push({ title: 'Control Unit', icon: 'ri-shield-check-line', expanded: false, items: controlItems });

    // Finance
    const financeItems: any[] = [];
    if (this.canSee('finance_payroll')) financeItems.push({ title: 'Payroll Management', url: '/finance/payroll-management' });
    if (this.canSee('finance_payment')) financeItems.push({ title: 'Payment Management', url: '/finance/payment-management' });
    if (financeItems.length) platformItems.push({ title: 'Finance', icon: 'ri-money-dollar-circle-line', expanded: false, items: financeItems });

    // Procurement (global only)
    if (this.canSee('procurement')) {
      platformItems.push({
        title: 'Procurement', icon: 'ri-shopping-cart-line', expanded: false,
        items: [
          { title: 'Supplier Management',    url: '/procurement/supplier-management' },
          { title: 'Logistics Management',   url: '/procurement/logistics-management' },
          { title: 'Petty Cash Management',  url: '/procurement/petty-cash-management' }
        ]
      });
    }

    if (platformItems.length) groups.push({ title: 'Platform', items: platformItems });

    return groups;
  }
}
