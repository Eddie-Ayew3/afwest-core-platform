import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, BadgeComponent, InputComponent,
  SelectComponent, SelectItemComponent,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  DataTableComponent, TolleCellDirective, TableColumn,
  ModalService, ToastService
} from '@tolle_/tolle-ui';
import { PermissionsService } from '../../../../core/services/permissions.service';

interface SlaRecord {
  id: string;
  client: string;
  site: string;
  period: string;
  guardHoursAgreed: number;
  guardHoursDelivered: number;
  incidentResponseTarget: number;
  incidentResponseAvg: number;
  patrolCompliancePct: number;
  slaScore: number;
  status: 'Compliant' | 'At Risk' | 'Breached';
  notes: string;
}

@Component({
  selector: 'app-sla-report',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, InputComponent,
    SelectComponent, SelectItemComponent,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    DataTableComponent, TolleCellDirective,
  ],
  templateUrl: './sla-report.component.html',
  styleUrls: ['./sla-report.component.css']
})
export class SlaReportComponent implements OnInit {
  private modal  = inject(ModalService);
  private toast  = inject(ToastService);
  permissions = inject(PermissionsService);

  showFilterPanel  = false;
  searchQuery      = '';
  selectedStatus   = 'all';
  selectedPeriod   = 'all';

  statusOptions = ['Compliant', 'At Risk', 'Breached'];
  periodOptions = ['Mar 2025', 'Feb 2025', 'Jan 2025', 'Dec 2024'];

  columns: TableColumn[] = [
    { key: 'client',              label: 'Client' },
    { key: 'site',                label: 'Site' },
    { key: 'period',              label: 'Period' },
    { key: 'hoursDelivery',       label: 'Guard Hours' },
    { key: 'responseTime',        label: 'Response Time' },
    { key: 'patrolCompliance',    label: 'Patrol %' },
    { key: 'slaScore',            label: 'SLA Score' },
    { key: 'status',              label: 'Status' },
    { key: 'actions',             label: '' },
  ];

  records: SlaRecord[] = [
    {
      id: 'SLA-2025-015', client: 'GoldFields Ghana Ltd.',     site: 'Tarkwa Mine',            period: 'Mar 2025',
      guardHoursAgreed: 720, guardHoursDelivered: 718, incidentResponseTarget: 5, incidentResponseAvg: 4.2,
      patrolCompliancePct: 98, slaScore: 97,
      status: 'Compliant', notes: 'Excellent performance this month. Minor shortfall of 2 hours due to guard illness.'
    },
    {
      id: 'SLA-2025-014', client: 'Accra Mall Management',    site: 'Accra Mall',              period: 'Mar 2025',
      guardHoursAgreed: 480, guardHoursDelivered: 480, incidentResponseTarget: 3, incidentResponseAvg: 2.8,
      patrolCompliancePct: 100, slaScore: 99,
      status: 'Compliant', notes: 'Full compliance achieved. Response time consistently under target.'
    },
    {
      id: 'SLA-2025-013', client: 'Takoradi Harbour Authority', site: 'Takoradi Port',          period: 'Mar 2025',
      guardHoursAgreed: 960, guardHoursDelivered: 910, incidentResponseTarget: 5, incidentResponseAvg: 7.1,
      patrolCompliancePct: 82, slaScore: 74,
      status: 'Breached', notes: 'Significant shortfall in guard hours. Response time above target. Corrective plan initiated.'
    },
    {
      id: 'SLA-2025-012', client: 'KNUST Research Institute',  site: 'KNUST Main Gate',        period: 'Mar 2025',
      guardHoursAgreed: 360, guardHoursDelivered: 348, incidentResponseTarget: 5, incidentResponseAvg: 5.5,
      patrolCompliancePct: 88, slaScore: 84,
      status: 'At Risk', notes: '12 hours shortfall. Response time slightly above target. Monitoring closely.'
    },
    {
      id: 'SLA-2025-011', client: 'Kumasi Hive Ventures',      site: 'Kumasi Hive HQ',         period: 'Mar 2025',
      guardHoursAgreed: 240, guardHoursDelivered: 240, incidentResponseTarget: 5, incidentResponseAvg: 3.9,
      patrolCompliancePct: 95, slaScore: 96,
      status: 'Compliant', notes: 'Full hours delivered. Patrol compliance strong.'
    },
    {
      id: 'SLA-2025-010', client: 'Cape Coast Teaching Hospital', site: 'CCH Main Campus',     period: 'Mar 2025',
      guardHoursAgreed: 600, guardHoursDelivered: 585, incidentResponseTarget: 4, incidentResponseAvg: 4.3,
      patrolCompliancePct: 91, slaScore: 88,
      status: 'At Risk', notes: '15 hours short. Response target slightly missed. Follow-up scheduled.'
    },
    {
      id: 'SLA-2025-009', client: 'GoldFields Ghana Ltd.',     site: 'Tarkwa Mine',            period: 'Feb 2025',
      guardHoursAgreed: 672, guardHoursDelivered: 672, incidentResponseTarget: 5, incidentResponseAvg: 4.0,
      patrolCompliancePct: 97, slaScore: 98,
      status: 'Compliant', notes: 'Outstanding performance. No SLA issues recorded.'
    },
    {
      id: 'SLA-2025-008', client: 'Accra Mall Management',    site: 'Accra Mall',              period: 'Feb 2025',
      guardHoursAgreed: 448, guardHoursDelivered: 440, incidentResponseTarget: 3, incidentResponseAvg: 3.2,
      patrolCompliancePct: 96, slaScore: 93,
      status: 'Compliant', notes: 'Minor hours shortfall. All other metrics within target.'
    },
    {
      id: 'SLA-2025-007', client: 'Takoradi Harbour Authority', site: 'Takoradi Port',         period: 'Feb 2025',
      guardHoursAgreed: 896, guardHoursDelivered: 850, incidentResponseTarget: 5, incidentResponseAvg: 6.5,
      patrolCompliancePct: 79, slaScore: 71,
      status: 'Breached', notes: 'Persistent compliance issues. Management review meeting held on 28 Feb.'
    },
    {
      id: 'SLA-2025-006', client: 'Volta River Authority',    site: 'VRA Akosombo Dam',        period: 'Feb 2025',
      guardHoursAgreed: 720, guardHoursDelivered: 715, incidentResponseTarget: 5, incidentResponseAvg: 4.7,
      patrolCompliancePct: 93, slaScore: 92,
      status: 'Compliant', notes: 'Good overall compliance. Minor shortfall in hours only.'
    },
  ];

  filteredRecords: SlaRecord[] = [];

  get compliantCount(): number { return this.records.filter(r => r.status === 'Compliant').length; }
  get atRiskCount():    number { return this.records.filter(r => r.status === 'At Risk').length; }
  get breachedCount():  number { return this.records.filter(r => r.status === 'Breached').length; }
  get avgSlaScore():    number {
    if (!this.records.length) return 0;
    return Math.round(this.records.reduce((s, r) => s + r.slaScore, 0) / this.records.length);
  }

  get activeFilterCount(): number {
    let c = 0;
    if (this.selectedStatus !== 'all') c++;
    if (this.selectedPeriod !== 'all') c++;
    return c;
  }

  ngOnInit(): void { this.applyFilter(); }

  applyFilter(): void {
    let result = [...this.records];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(r =>
        r.client.toLowerCase().includes(q) ||
        r.site.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    }
    if (this.selectedStatus !== 'all') result = result.filter(r => r.status === this.selectedStatus);
    if (this.selectedPeriod !== 'all') result = result.filter(r => r.period === this.selectedPeriod);
    this.filteredRecords = result;
  }

  onSearch(): void { this.applyFilter(); }
  toggleFilterPanel(): void { this.showFilterPanel = !this.showFilterPanel; }
  clearFilters(): void {
    this.selectedStatus = 'all';
    this.selectedPeriod = 'all';
    this.applyFilter();
  }

  viewRecord(record: SlaRecord): void {
    const hoursPct = Math.round((record.guardHoursDelivered / record.guardHoursAgreed) * 100);
    this.modal.open({
      title: `${record.id} — ${record.client}`,
      content: `
        <div class="space-y-4 text-sm">
          <div class="grid grid-cols-2 gap-3">
            <div><p class="text-xs text-muted-foreground mb-0.5">Client</p><p class="font-medium">${record.client}</p></div>
            <div><p class="text-xs text-muted-foreground mb-0.5">Site</p><p class="font-medium">${record.site}</p></div>
            <div><p class="text-xs text-muted-foreground mb-0.5">Period</p><p class="font-medium">${record.period}</p></div>
            <div><p class="text-xs text-muted-foreground mb-0.5">SLA Score</p><p class="font-bold text-base">${record.slaScore}%</p></div>
          </div>
          <div class="border-t border-border pt-3 grid grid-cols-3 gap-3">
            <div class="text-center p-3 bg-muted/30 rounded-lg">
              <p class="text-xs text-muted-foreground mb-1">Guard Hours</p>
              <p class="font-bold">${record.guardHoursDelivered}/${record.guardHoursAgreed}</p>
              <p class="text-xs text-muted-foreground">${hoursPct}% delivered</p>
            </div>
            <div class="text-center p-3 bg-muted/30 rounded-lg">
              <p class="text-xs text-muted-foreground mb-1">Response Time</p>
              <p class="font-bold">${record.incidentResponseAvg} min avg</p>
              <p class="text-xs text-muted-foreground">Target: ${record.incidentResponseTarget} min</p>
            </div>
            <div class="text-center p-3 bg-muted/30 rounded-lg">
              <p class="text-xs text-muted-foreground mb-1">Patrol Compliance</p>
              <p class="font-bold">${record.patrolCompliancePct}%</p>
            </div>
          </div>
          <div class="border-t border-border pt-3">
            <p class="text-xs text-muted-foreground mb-1">Notes</p>
            <p>${record.notes}</p>
          </div>
        </div>
      `,
      size: 'lg',
    });
  }

  exportReport(): void {
    this.toast.show({ title: 'Export Initiated', description: 'SLA report is being prepared for download.', variant: 'success' });
  }

  getStatusBg(status: string): string {
    const map: Record<string, string> = {
      'Compliant': 'rgba(34,197,94,0.15)',
      'At Risk':   'rgba(234,179,8,0.15)',
      'Breached':  'rgba(239,68,68,0.15)',
    };
    return map[status] ?? 'rgba(148,163,184,0.15)';
  }

  getStatusFg(status: string): string {
    const map: Record<string, string> = { 'Compliant': '#16a34a', 'At Risk': '#ca8a04', 'Breached': '#dc2626' };
    return map[status] ?? '#64748b';
  }

  getSlaScoreColor(score: number): string {
    if (score >= 90) return '#16a34a';
    if (score >= 75) return '#ca8a04';
    return '#dc2626';
  }

  getSlaScoreClass(score: number): string {
    if (score >= 90) return 'sla-score-excellent';
    if (score >= 75) return 'sla-score-good';
    return 'sla-score-poor';
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Compliant': 'status-compliant',
      'At Risk':   'status-at-risk',
      'Breached':  'status-breached',
    };
    return map[status] ?? 'status-compliant';
  }

  getResponseTimeClass(record: SlaRecord): string {
    return record.incidentResponseAvg > record.incidentResponseTarget ? 'sla-breached' : 'sla-compliant';
  }

  getHoursDeliveryDisplay(record: SlaRecord): string {
    return `${record.guardHoursDelivered}/${record.guardHoursAgreed}`;
  }

  getResponseTimeDisplay(record: SlaRecord): string {
    return `${record.incidentResponseAvg} / ${record.incidentResponseTarget} min`;
  }
}
