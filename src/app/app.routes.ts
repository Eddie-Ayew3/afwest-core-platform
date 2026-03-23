import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { globalOnlyGuard, notGuardRoleGuard } from './core/guards/role.guard';
import { loadingGuard } from './core/guards/loading.guard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/sign-in' },
    {
        path: 'sign-in',
        loadComponent: () => import('./features/auth/pages/sign-in/sign-in.component').then(m => m.SignInComponent)
    },
    {
        path: 'reset-password',
        loadComponent: () => import('./features/auth/pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
    },

    // Client-specific routes (more specific, must come first)
    {
        path: 'client',
        loadComponent: () => import('./layout/client-dashboard-layout/client-dashboard-layout.component').then(m => m.ClientDashboardLayoutComponent),
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard/:id',
                loadComponent: () => import('./features/client-management/pages/client-dashboard/client-dashboard.component').then(m => m.ClientDashboardComponent),
                canActivate: [authGuard, loadingGuard]
            },
            {
                path: 'request/:id',
                loadComponent: () => import('./features/client-management/pages/request-management/request-management.component').then(m => m.RequestManagementComponent)
            },
            {
                path: 'site/:id',
                loadComponent: () => import('./features/client-management/pages/site-management/site-management.component').then(m => m.SiteManagementComponent)
            },
            {
                path: 'shift/:id',
                loadComponent: () => import('./features/operations/shift-management/shift-management.component').then(m => m.ShiftManagementComponent)
            },
            {
                path: 'guard/:id',
                loadComponent: () => import('./features/client-management/pages/guard-management/all-guards/guard-management.component').then(m => m.GuardManagementComponent)
            }
        ]
    },

    // Main dashboard routes (more general)
    {
        path: '',
        loadComponent: () => import('./layout/main-dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/pages/dashboard.component').then(m => m.DashBoardComponent)
            },
            {
                path: 'client-management',
                loadComponent: () => import('./features/client-management/pages/client-management/all-clients/client-management.component').then(m => m.ClientManagementComponent)
            },
            {
                path: 'zone-management',
                loadComponent: () => import('./features/zone-management/pages/all-zones/zone-management.component').then(m => m.ZoneManagementComponent)
            },
            {
                path: 'finance',
                children: [
                    {
                        path: 'payroll-management',
                        loadComponent: () => import('./features/finance-management/payroll-management/payroll-management.component').then(m => m.PayrollManagementComponent)
                    },
                    {
                        path: 'payment-management',
                        loadComponent: () => import('./features/finance-management/payment-management/payment-management.component').then(m => m.PaymentManagementComponent)
                    },
                    {
                        path: 'invoice-management',
                        loadComponent: () => import('./features/finance-management/pages/invoice-management/invoice-management.component').then(m => m.InvoiceManagementComponent)
                    },
                    {
                        path: 'invoice-management/:id',
                        loadComponent: () => import('./features/finance-management/pages/invoice-management/invoice-detail/invoice-detail.component').then(m => m.InvoiceDetailComponent)
                    },
                    {
                        path: 'sla-report',
                        loadComponent: () => import('./features/finance-management/sla-report/sla-report.component').then(m => m.SlaReportComponent)
                    }
                ]
            },
            {
                path: 'hr',
                children: [
                    {
                        path: 'staff-management',
                        loadComponent: () => import('./features/staff-management/pages/all-staff/staff-management.component').then(m => m.StaffManagementComponent)
                    },
                    {
                        path: 'staff-management/new-staff',
                        loadComponent: () => import('./features/staff-management/pages/new-staff/new-staff-management.component').then(m => m.NewStaffManagementComponent)
                    },
                    {
                        path: 'staff-management/view-staff/:id',
                        loadComponent: () => import('./features/staff-management/pages/view-staff/view-staff.component').then(m => m.ViewStaffComponent),
                        canActivate: [authGuard, loadingGuard]
                    },
                    {
                        path: 'guard-management',
                        loadComponent: () => import('./features/client-management/pages/guard-management/all-guards/guard-management.component').then(m => m.GuardManagementComponent)
                    },
                    {
                        path: 'guard-management/new-guard',
                        loadComponent: () => import('./features/client-management/pages/guard-management/new-guard/new-guard.component').then(m => m.NewGuardComponent)
                    },
                    {
                        path: 'guard-management/view-guard/:id',
                        loadComponent: () => import('./features/client-management/pages/guard-management/view-guard/view-guard.component').then(m => m.ViewGuardComponent),
                        canActivate: [authGuard, loadingGuard]
                    },
                    {
                        path: 'guard-performance',
                        loadComponent: () => import('./features/client-management/pages/guard-management/guard-performance/guard-performance.component').then(m => m.GuardPerformanceComponent)
                    },
                    {
                        path: 'client-management',
                        loadComponent: () => import('./features/client-management/pages/client-management/all-clients/client-management.component').then(m => m.ClientManagementComponent)
                    },
                    {
                        path: 'client-management/new-client',
                        loadComponent: () => import('./features/client-management/pages/client-management/new-client/new-client-management.component').then(m => m.NewClientManagementComponent)
                    },
                    {
                        path: 'leave-management',
                        loadComponent: () => import('./features/leave-management/pages/all-leaves/leave-management.component').then(m => m.LeaveManagementComponent)
                    },
                    {
                        path: 'user-management',
                        loadComponent: () => import('./features/user-management/user-management.component').then(m => m.UserManagementComponent),
                        canActivate: [globalOnlyGuard]
                    },
                    {
                        path: 'permissions-management',
                        loadComponent: () => import('./features/permissions-management/permissions-management.component').then(m => m.PermissionsManagementComponent),
                        canActivate: [globalOnlyGuard]
                    }
                ]
            },
            {
                path: 'control-unit',
                children: [
                    {
                        path: 'shift-management',
                        loadComponent: () => import('./features/operations/shift-management/shift-management.component').then(m => m.ShiftManagementComponent),
                        canActivate: [notGuardRoleGuard]
                    },
                    {
                        path: 'check-in-out',
                        loadComponent: () => import('./features/operations/check-in-out/check-in-out.component').then(m => m.CheckInOutComponent)
                    },
                    {
                        path: 'incidents',
                        loadComponent: () => import('./features/operations/incidents/incidents-management.component').then(m => m.IncidentsManagementComponent)
                    },
                    {
                        path: 'site-inspections',
                        loadComponent: () => import('./features/operations/site-inspections/site-inspections.component').then(m => m.SiteInspectionsComponent)
                    }
                ]
            },
            {
                path: 'procurement',
                canActivate: [globalOnlyGuard],
                children: [
                    {
                        path: 'supplier-management',
                        loadComponent: () => import('./features/procurement/supplier-management/pages/all-suppliers/supplier-management.component').then(m => m.SupplierManagementComponent)
                    },
                    {
                        path: 'logistics-management',
                        loadComponent: () => import('./features/procurement/logistics-management/pages/all-logistics/logistics-management.component').then(m => m.LogisticsManagementComponent)
                    },
                    {
                        path: 'petty-cash-management',
                        loadComponent: () => import('./features/procurement/petty-cash-management/pages/all-petty-cash/petty-cash-management.component').then(m => m.PettyCashManagementComponent)
                    }
                ]
            },
        ]
    }
];
