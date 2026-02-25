import { Routes } from '@angular/router';
import { SignInComponent } from './features/auth/pages/sign-in/sign-in.component';
import { DashBoardComponent } from './features/dashboard/pages/dashboard.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { StaffManagementComponent } from './features/staff-management/staff-management.component';
import { ClientManagementComponent } from './features/client-management/pages/new-client/client-management.component';
import { LeaveManagementComponent } from './features/leave-management/leave-management.component';
import { UserManagementComponent } from './features/user-management/user-management.component';
import { ShiftManagementComponent } from './features/shift-management/shift-management.component';
import { CheckInOutComponent } from './features/check-in-out/check-in-out.component';
import { SupplierManagementComponent } from './features/supplier-management/supplier-management.component';
import { LogisticsManagementComponent } from './features/logistics-management/logistics-management.component';
import { PettyCashManagementComponent } from './features/petty-cash-management/petty-cash-management.component';
import { ResetPasswordComponent } from './features/auth/pages/reset-password/reset-password.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/sign-in' },
    { path: 'sign-in', component: SignInComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
     {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        // canActivate: [authGuard],
        path: 'dashboard', component: DashBoardComponent,
      },
      {
        // canActivate: [authGuard],
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
        // canActivate: [authGuard],
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
        // canActivate: [authGuard],
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
    //   {
    //     canActivate: [authGuard],
    //     path: 'clients',
    //     children: [
    //       {
    //         path: 'all',
    //         component: AllClientsComponent,
    //       },
    //       {
    //         path: 'new',
    //         component: ClientFormComponent
    //       },
    //       {
    //         path: 'edit/:id',
    //         component: ClientFormComponent
    //       }
    //     ]
    //   },
    //   {
    //     path: 'assets',
    //     canActivate: [authGuard],
    //     children: [
    //       {
    //         path: 'all',
    //         component: AllAssetsComponent,
    //       },
    //       {
    //         path: 'new',
    //         component: AssetFormComponent
    //       }
    //     ]
    //   },
    //   {
    //     path: 'items',
    //     canActivate: [authGuard],
    //     children: [
    //       {
    //         path: 'all',
    //         component: AllItemsComponent,
    //       },
    //       {
    //         path: 'new',
    //         component: ItemFormComponent,
    //       },
    //       {
    //         path: 'edit/:id',
    //         component: ItemFormComponent
    //       }
    //     ]
    //   },
    //   {
    //     path: 'item-movement',
    //     canActivate: [authGuard],
    //     children: [
    //       {
    //         path: 'all',
    //         component: AllItemMovementComponent,
    //       }
    //     ]
    //   },
    //   {
    //     path: 'brands',
    //     canActivate: [authGuard],
    //     children: [
    //       {
    //         path: 'all',
    //         component: AllBrandsComponent,
    //       },
    //       {
    //         path: 'new',
    //         component: BrandFormComponent,
    //       },
    //       {
    //         path: 'edit/:id',
    //         component: BrandFormComponent
    //       }
    //     ]
    //   },
    //   {
    //     path:'petty-cash',
    //     canActivate:[authGuard],
    //     children:[
    //       {
    //       path:'all',
    //       component:AllPettyCashComponent,
    //     },
    //     {
    //       path:'new',
    //       component:PettyCashFormComponent
    //     }

    //     ]


    //   },
    //   {
    //     path: 'taxes',
    //     canActivate:[authGuard],
    //     children:[
    //       {
    //         path:'all',
    //         component:AllTaxComponent,
    //       },
    //       {
    //         path:'new',
    //         component:TaxFormComponent
    //       },
    //       {
    //         path:'edit/:id',
    //         component:TaxFormComponent
    //       }
    //     ]
    //   },
    //   {
    //     path: 'suppliers',
    //     canActivate: [authGuard],
    //     children: [
    //       {
    //         path: 'all',
    //         component: AllSuppliersComponent,
    //       },
    //       {
    //         path: 'new',
    //         component: SupplierFormComponent,
    //       },
    //       {
    //         path: 'edit/:id',
    //         component: SupplierFormComponent,
    //       }
    //     ]
    //   },
    //   {
    //     path: 'purchase-orders',
    //     canActivate: [authGuard],
    //     children: [
    //       {
    //         path: 'new',
    //         component: NewPurchaseOrdersComponent,
    //       },
    //       {
    //         path: 'all',
    //         component: AllPurchaseOrdersComponent,
    //       },
    //       {
    //       path: 'view/:purchaseOrderId',
    //       component: ViewPurchaseOrderComponent,
    //     }
    //     ]
    //   },
    //   {
    //     path: 'api-keys',
    //     canActivate: [authGuard],
    //     children: [
    //       {
    //         path: 'all',
    //         component: AllKeysComponent,
    //       }
    //     ]
    //   },
    //   {
    //     path: 'asset-types',
    //     canActivate: [authGuard],
    //     children: [
    //       {
    //         path: 'all',
    //         component: AllAssetTypesComponent,
    //       },
    //       {
    //         path: 'edit/:id',
    //         component: AssetTypeFormComponent,
    //       }
    //     ]
    //   }
    ]
  },


];
