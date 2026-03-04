import { Routes } from '@angular/router';
import { SignInComponent } from './features/auth/pages/sign-in/sign-in.component';
import { DashBoardComponent } from './features/dashboard/pages/dashboard.component';
import { GuardManagementComponent} from './features/client-management/pages/guard-management/all-guards/guard-management.component';
import { ClientManagementComponent } from './features/client-management/pages/client-management/all-clients/client-management.component';
import { RequestManagementComponent } from './features/client-management/pages/request-management/request-management.component';
import { SiteManagementComponent } from './features/client-management/pages/site-management/site-management.component';
import { ClientDashboardComponent } from './features/client-management/pages/client-dashboard/client-dashboard.component';
import { UserManagementComponent } from './features/user-management/user-management.component';
import { ShiftManagementComponent } from './features/shift-management/shift-management.component';
import { CheckInOutComponent } from './features/check-in-out/check-in-out.component';
import { SupplierManagementComponent } from './features/supplier-management/supplier-management.component';
import { LogisticsManagementComponent } from './features/logistics-management/logistics-management.component';
import { PettyCashManagementComponent } from './features/petty-cash-management/petty-cash-management.component';
import { ResetPasswordComponent } from './features/auth/pages/reset-password/reset-password.component';
import { ClientDashboardLayoutComponent } from './layout/client-dashboard-layout/client-dashboard-layout.component';
import { DashboardLayoutComponent } from './layout/main-dashboard-layout/dashboard-layout.component';
import { LeaveManagementComponent } from './features/leave-management/pages/all-leaves/leave-management.component';
import { PermissionsManagementComponent } from './features/permissions-management/permissions-management.component';
import { authGuard } from './guards/auth.guard';
import { globalOnlyGuard, notGuardRoleGuard } from './core/guards/role.guard';
import { PermissionsService } from './core/services/permissions.service';
import { StaffManagementComponent } from './features/staff-management/pages/all-staff/staff-management.component';
import { NewClientManagementComponent } from './features/client-management/pages/client-management/new-client/new-client-management.component';
import { NewStaffManagementComponent } from './features/staff-management/pages/new-staff/new-staff-management.component';
import { NewGuardComponent } from './features/client-management/pages/guard-management/new-guard/new-guard.component';
import { ViewGuardComponent } from './features/client-management/pages/guard-management/view-guard/view-guard.component';
import { ViewClientComponent } from './features/client-management/pages/client-management/view-client/view-client.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/sign-in' },
    { path: 'sign-in', component: SignInComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    
    // Client-specific routes (more specific, must come first)
    {
        path: 'client',
        component: ClientDashboardLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard/:id',
                component: ClientDashboardComponent,
            },
            {
                path: 'request/:id',
                component: RequestManagementComponent
            },
            {
                path: 'site/:id',
                component: SiteManagementComponent
            },
            {
                path: 'shift/:id',
                component: ShiftManagementComponent
            },
            {
                path: 'guard/:id',
                component: GuardManagementComponent
            }
        ]
    },

    // Main dashboard routes (more general)
    {
        path: '',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard', component: DashBoardComponent,
            },
            {
                path: 'client-management',
                component: ClientManagementComponent
            },
            {
                path: 'hr',
                children: [
                    {
                        path: 'staff-management',
                        component: StaffManagementComponent
                    },
                    {
                        path: 'staff-management/new-staff',
                        component: NewStaffManagementComponent
                    },
                    {
                        path: 'guard-management',
                        component: GuardManagementComponent
                    },
                    {
                        path: 'guard-management/new-guard',
                        component: NewGuardComponent
                    },
                    {
                        path: 'guard-management/view-guard/:id',
                        component: ViewGuardComponent
                    },
                    {
                        path: 'client-management',
                        component: ClientManagementComponent
                    },
                    {
                        path: 'client-management/new-client',
                        component: NewClientManagementComponent
                    },
                    {
                        path: 'leave-management',
                        component: LeaveManagementComponent
                    },
                    {
                        path: 'user-management',
                        component: UserManagementComponent,
                        canActivate: [globalOnlyGuard]
                    },
                    {
                        path: 'permissions-management',
                        component: PermissionsManagementComponent,
                        canActivate: [globalOnlyGuard]
                    }
                ]
            },
            {
                path: 'control-unit',
                children: [
                    {
                        path: 'shift-management',
                        component: ShiftManagementComponent,
                        canActivate: [notGuardRoleGuard]
                    },
                    {
                        path: 'check-in-out',
                        component: CheckInOutComponent
                    }
                ]
            },
            {
                path: 'procurement',
                canActivate: [globalOnlyGuard],
                children: [
                    {
                        path: 'supplier-management',
                        component: SupplierManagementComponent
                    },
                    {
                        path: 'logistics-management',
                        component: LogisticsManagementComponent
                    },
                    {
                        path: 'petty-cash-management',
                        component: PettyCashManagementComponent
                    }
                ]
            },
        ]
    }
];
