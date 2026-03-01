import { Routes } from '@angular/router';
import { SignInComponent } from './features/auth/pages/sign-in/sign-in.component';
import { DashBoardComponent } from './features/dashboard/pages/dashboard.component';
import { StaffManagementComponent } from './features/staff-management/staff-management.component';
import { ClientManagementComponent } from './features/client-management/pages/all-client/client-management.component';
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
import { LeaveManagementComponent } from './features/leave-management/leave-management.component';
import { authGuard } from './guards/auth.guard';

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
                component: StaffManagementComponent
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
                        path: 'client-management',
                        component: ClientManagementComponent
                    },
                    {
                        path: 'leave-management',
                        component: LeaveManagementComponent
                    },
                    {
                        path: 'user-management',
                        component: UserManagementComponent
                    }
                ]
            },
            {
                path: 'control-unit',
                children: [
                    {
                        path: 'shift-management',
                        component: ShiftManagementComponent
                    },
                    {
                        path: 'check-in-out',
                        component: CheckInOutComponent
                    }
                ]
            },
            {
                path: 'procurement',
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
