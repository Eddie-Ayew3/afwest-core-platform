import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideTolleConfig } from '@tolle_/tolle-ui';
import { routes } from './app.routes';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { shiftReducer } from './features/operations/shift-management/stores/shift.reducer';
import { ShiftEffects } from './features/operations/shift-management/stores/shift.effects';
import { invoiceReducer } from './features/finance-management/invoice-management/stores/invoice.reducer';
import { InvoiceEffects } from './features/finance-management/invoice-management/stores/invoice.effects';
import { payrollReducer } from './features/finance-management/payroll-management/stores/payroll.reducer';
import { PayrollEffects } from './features/finance-management/payroll-management/stores/payroll.effects';
import { siteInspectionReducer } from './features/operations/site-inspections/stores/site-inspection.reducer';
import { SiteInspectionEffects } from './features/operations/site-inspections/stores/site-inspection.effects';
import { departmentReducer } from './features/human-resource/department-management/stores/department.reducer';
import { DepartmentEffects } from './features/human-resource/department-management/stores/department.effects';
import { regionReducer } from './features/operations/zone-management/stores/region.reducer';
import { RegionEffects } from './features/operations/zone-management/stores/region.effects';
import { guardReducer } from './features/human-resource/guard-management/stores/guard.reducer';
import { GuardEffects } from './features/human-resource/guard-management/stores/guard.effects';
import { clientReducer } from './features/human-resource/client-management/stores/client.reducer';
import { ClientEffects } from './features/human-resource/client-management/stores/client.effects';
import { staffReducer } from './features/human-resource/staff-management/stores/staff.reducer';
import { StaffEffects } from './features/human-resource/staff-management/stores/staff.effects';
import { leaveReducer } from './features/human-resource/leave-management/stores/leave.reducer';
import { LeaveEffects } from './features/human-resource/leave-management/stores/leave.effects';
import { userMgmtReducer } from './features/human-resource/user-management/stores/user-mgmt.reducer';
import { UserMgmtEffects } from './features/human-resource/user-management/stores/user-mgmt.effects';
import { permissionReducer } from './features/human-resource/permissions-management/stores/permission.reducer';
import { PermissionEffects } from './features/human-resource/permissions-management/stores/permission.effects';
import { roleReducer } from './features/human-resource/permissions-management/stores/role.reducer';
import { RoleEffects } from './features/human-resource/permissions-management/stores/role.effects';
import { incidentReducer } from './features/operations/incidents/stores/incident.reducer';
import { IncidentEffects } from './features/operations/incidents/stores/incident.effects';
import { supplierReducer } from './features/procurement/supplier-management/stores/supplier.reducer';
import { SupplierEffects } from './features/procurement/supplier-management/stores/supplier.effects';
import { logisticsReducer } from './features/procurement/logistics-management/stores/logistics.reducer';
import { LogisticsEffects } from './features/procurement/logistics-management/stores/logistics.effects';
import { pettyCashReducer } from './features/procurement/petty-cash-management/stores/petty-cash.reducer';
import { PettyCashEffects } from './features/procurement/petty-cash-management/stores/petty-cash.effects';
import { paymentReducer } from './features/finance-management/payment-management/stores/payment.reducer';
import { PaymentEffects } from './features/finance-management/payment-management/stores/payment.effects';
import { slaReportReducer } from './features/finance-management/sla-report/stores/sla-report.reducer';
import { SlaReportEffects } from './features/finance-management/sla-report/stores/sla-report.effects';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';



export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideStore({
      shifts: shiftReducer,
      invoices: invoiceReducer,
      payroll: payrollReducer,
      siteInspections: siteInspectionReducer,
      departments: departmentReducer,
      regions: regionReducer,
      guards: guardReducer,
      clients: clientReducer,
      staff: staffReducer,
      leave: leaveReducer,
      userMgmt: userMgmtReducer,
      permissions: permissionReducer,
      roles: roleReducer,
      incidents: incidentReducer,
      suppliers: supplierReducer,
      logistics: logisticsReducer,
      pettyCash: pettyCashReducer,
      payments: paymentReducer,
      slaReports: slaReportReducer,
    }),
    provideEffects([ShiftEffects, InvoiceEffects, PayrollEffects, SiteInspectionEffects, DepartmentEffects,RegionEffects, GuardEffects, ClientEffects, StaffEffects, LeaveEffects, UserMgmtEffects, PermissionEffects, RoleEffects, IncidentEffects, SupplierEffects, LogisticsEffects, PettyCashEffects, PaymentEffects, SlaReportEffects]),
    provideTolleConfig({
      primaryColor: '#f14444ff', // Indigo
      radius: '0.5rem',
      darkByDefault: false
    })
  ]
};