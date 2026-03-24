import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, BadgeComponent, InputComponent,
  SelectComponent, SelectItemComponent,
  DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  LabelComponent, ModalService,
  DataTableComponent, TolleCellDirective, TableColumn
} from '@tolle_/tolle-ui';

export interface Payroll {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  position: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  overtime: number;
  netSalary: number;
  payPeriod: string;
  status: 'pending' | 'processed' | 'paid';
  paymentDate: string;
  bankAccount: string;
}

@Component({
  selector: 'app-payroll-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, BadgeComponent, InputComponent,
    SelectComponent, SelectItemComponent,
    DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    DataTableComponent, TolleCellDirective
  ],
  templateUrl: './payroll-management.component.html',
  styleUrl: './payroll-management.component.css'
})
export class PayrollManagementComponent implements OnInit {
  private modalService = inject(ModalService);
  @ViewChild('payrollModal') payrollModal!: TemplateRef<any>;

  columns: TableColumn[] = [
    { key: 'staff',      label: 'Staff Member'  },
    { key: 'department', label: 'Department'     },
    { key: 'baseSalary', label: 'Base Salary'    },
    { key: 'breakdown',  label: 'Allowances / Deductions' },
    { key: 'netSalary',  label: 'Net Salary'     },
    { key: 'payPeriod',  label: 'Pay Period'     },
    { key: 'status',     label: 'Status'         },
    { key: 'actions',    label: ''               },
  ];

  payrollData: Payroll[] = [
    {
      id: 'PR-001', staffId: 'GD-011', staffName: 'Kwame Mensah',
      department: 'Security', position: 'Senior Guard',
      baseSalary: 3200, allowances: 450, deductions: 180, overtime: 280,
      netSalary: 3750, payPeriod: 'March 2025',
      status: 'paid', paymentDate: '2025-03-28', bankAccount: '0012345678'
    },
    {
      id: 'PR-002', staffId: 'GD-022', staffName: 'Ama Asante',
      department: 'Operations', position: 'Operations Supervisor',
      baseSalary: 4800, allowances: 600, deductions: 240, overtime: 0,
      netSalary: 5160, payPeriod: 'March 2025',
      status: 'processed', paymentDate: '', bankAccount: '0098765432'
    },
    {
      id: 'PR-003', staffId: 'GD-033', staffName: 'Kofi Boateng',
      department: 'Security', position: 'Guard',
      baseSalary: 2600, allowances: 300, deductions: 130, overtime: 195,
      netSalary: 2965, payPeriod: 'March 2025',
      status: 'pending', paymentDate: '', bankAccount: '0011223344'
    },
    {
      id: 'PR-004', staffId: 'GD-015', staffName: 'Abena Owusu',
      department: 'HR', position: 'HR Officer',
      baseSalary: 3800, allowances: 500, deductions: 190, overtime: 0,
      netSalary: 4110, payPeriod: 'March 2025',
      status: 'processed', paymentDate: '', bankAccount: '0033445566'
    },
    {
      id: 'PR-005', staffId: 'GD-041', staffName: 'Yaw Darko',
      department: 'Security', position: 'Guard',
      baseSalary: 2600, allowances: 300, deductions: 350, overtime: 130,
      netSalary: 2680, payPeriod: 'March 2025',
      status: 'pending', paymentDate: '', bankAccount: '0055667788'
    },
    {
      id: 'PR-006', staffId: 'GD-008', staffName: 'Nana Frimpong',
      department: 'Finance', position: 'Finance Manager',
      baseSalary: 5500, allowances: 750, deductions: 275, overtime: 0,
      netSalary: 5975, payPeriod: 'March 2025',
      status: 'paid', paymentDate: '2025-03-28', bankAccount: '0077889900'
    },
    {
      id: 'PR-007', staffId: 'GD-055', staffName: 'Efua Mensah',
      department: 'Logistics', position: 'Logistics Officer',
      baseSalary: 3100, allowances: 400, deductions: 155, overtime: 240,
      netSalary: 3585, payPeriod: 'March 2025',
      status: 'paid', paymentDate: '2025-03-28', bankAccount: '0044556677'
    },
    {
      id: 'PR-008', staffId: 'GD-062', staffName: 'Akosua Sarpong',
      department: 'Security', position: 'Senior Guard',
      baseSalary: 3200, allowances: 450, deductions: 160, overtime: 320,
      netSalary: 3810, payPeriod: 'March 2025',
      status: 'pending', paymentDate: '', bankAccount: '0022334455'
    },
  ];

  filteredPayroll: Payroll[] = [];
  searchTerm        = '';
  filterDepartment  = 'All';
  filterStatus      = 'All';
  filterPayPeriod   = 'All';
  showFilterPanel   = false;

  readonly departments = ['Security', 'Operations', 'HR', 'Finance', 'Logistics'];
  readonly statuses    = ['pending', 'processed', 'paid'];
  readonly payPeriods  = ['March 2025', 'February 2025', 'January 2025'];

  get totalPayroll():    number { return this.filteredPayroll.reduce((s, p) => s + p.netSalary, 0); }
  get pendingCount():    number { return this.filteredPayroll.filter(p => p.status === 'pending').length; }
  get processedCount():  number { return this.filteredPayroll.filter(p => p.status === 'processed').length; }
  get paidCount():       number { return this.filteredPayroll.filter(p => p.status === 'paid').length; }

  get activeFilterCount(): number {
    let n = 0;
    if (this.filterDepartment !== 'All') n++;
    if (this.filterStatus !== 'All')     n++;
    if (this.filterPayPeriod !== 'All')  n++;
    return n;
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    const q = this.searchTerm.toLowerCase().trim();
    this.filteredPayroll = this.payrollData.filter(p => {
      const matchesSearch = !q ||
        p.staffName.toLowerCase().includes(q) ||
        p.staffId.toLowerCase().includes(q) ||
        p.position.toLowerCase().includes(q);
      const matchesDept      = this.filterDepartment === 'All' || p.department === this.filterDepartment;
      const matchesStatus    = this.filterStatus === 'All'     || p.status     === this.filterStatus;
      const matchesPeriod    = this.filterPayPeriod === 'All'  || p.payPeriod  === this.filterPayPeriod;
      return matchesSearch && matchesDept && matchesStatus && matchesPeriod;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterDepartment = 'All';
    this.filterStatus = 'All';
    this.filterPayPeriod = 'All';
    this.applyFilters();
  }

  toggleFilterPanel(): void { this.showFilterPanel = !this.showFilterPanel; }

  viewPayroll(payroll: Payroll): void {
    this.modalService.open({
      title: `Payslip — ${payroll.staffName}`,
      backdropClose: true,
      size: 'default',
      showCloseButton: true,
      content: this.payrollModal,
      context: { payroll }
    });
  }

  getStatusBg(status: string): string {
    const map: Record<string, string> = {
      paid:       'rgba(34,197,94,0.15)',
      processed:  'rgba(59,130,246,0.15)',
      pending:    'rgba(249,115,22,0.15)',
    };
    return map[status] ?? 'rgba(113,113,122,0.15)';
  }

  getStatusFg(status: string): string {
    const map: Record<string, string> = {
      paid:       '#16a34a',
      processed:  '#2563eb',
      pending:    '#ea580c',
    };
    return map[status] ?? '#71717a';
  }

  getDeptBg(dept: string): string {
    const map: Record<string, string> = {
      Security:   'rgba(239,68,68,0.12)',
      Operations: 'rgba(99,102,241,0.12)',
      HR:         'rgba(168,85,247,0.12)',
      Finance:    'rgba(34,197,94,0.12)',
      Logistics:  'rgba(234,179,8,0.15)',
    };
    return map[dept] ?? 'rgba(113,113,122,0.12)';
  }

  getDeptFg(dept: string): string {
    const map: Record<string, string> = {
      Security:   '#dc2626',
      Operations: '#4f46e5',
      HR:         '#7c3aed',
      Finance:    '#16a34a',
      Logistics:  '#ca8a04',
    };
    return map[dept] ?? '#71717a';
  }

  getInitials(name: string): string {
    const parts = name.trim().split(' ').filter(p => p.length > 1);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }
}
