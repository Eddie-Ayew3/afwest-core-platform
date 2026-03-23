import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, InputComponent, LabelComponent,
  SelectComponent, SelectItemComponent, TextareaComponent,
  TooltipDirective, DropdownTriggerDirective, DropdownMenuComponent,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  DataTableComponent, TolleCellDirective, TableColumn,
  SheetComponent, SheetContentComponent,
  AlertDialogService, ToastService, ModalService
} from '@tolle_/tolle-ui';
import { PermissionsService } from '../../../core/services/permissions.service';

interface Inspection {
  id: string;
  site: string;
  region: string;
  inspector: string;
  date: string;
  time: string;
  type: 'Routine' | 'Surprise' | 'Follow-up';
  result: 'Pass' | 'Fail' | 'Pending';
  findings: string;
  score: number;
}

@Component({
  selector: 'app-site-inspections',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, InputComponent, LabelComponent,
    SelectComponent, SelectItemComponent, TextareaComponent,
    TooltipDirective, DropdownTriggerDirective, DropdownMenuComponent,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    DataTableComponent, TolleCellDirective,
    SheetComponent, SheetContentComponent,
  ],
  templateUrl: './site-inspections.component.html',
  styleUrls: ['./site-inspections.component.css'],
})
export class SiteInspectionsComponent implements OnInit {
  private alertDialog = inject(AlertDialogService);
  private toast       = inject(ToastService);
  private modal       = inject(ModalService);
  permissions = inject(PermissionsService);

  showFilterPanel   = false;
  showCreateSheet   = false;
  searchQuery       = '';
  selectedType      = 'all';
  selectedResult    = 'all';
  selectedSite      = 'all';

  typeOptions   = ['Routine', 'Surprise', 'Follow-up'];
  resultOptions = ['Pass', 'Fail', 'Pending'];
  siteOptions   = ['Head Office – Accra', 'Kumasi Branch', 'Takoradi Branch', 'Tema Industrial', 'Cape Coast Post'];

  newForm = {
    site:      '',
    inspector: '',
    date:      '',
    time:      '',
    type:      '' as 'Routine' | 'Surprise' | 'Follow-up' | '',
    findings:  '',
    score:     85,
  };

  columns: TableColumn[] = [
    { key: 'id',        label: 'Ref No.' },
    { key: 'site',      label: 'Site' },
    { key: 'inspector', label: 'Inspector' },
    { key: 'date',      label: 'Date' },
    { key: 'type',      label: 'Type' },
    { key: 'score',     label: 'Score' },
    { key: 'result',    label: 'Result' },
    { key: 'actions',   label: '' },
  ];

  inspections: Inspection[] = [
    { id: 'INS-2025-015', site: 'Head Office – Accra', region: 'Greater Accra', inspector: 'Kwame Mensah',     date: '21 Mar 2025', time: '09:00', type: 'Routine',   result: 'Pass',    findings: 'All checkpoints manned. Logs up to date. Minor issue: CCTV camera 4 offline.',                      score: 88 },
    { id: 'INS-2025-014', site: 'Takoradi Branch',     region: 'Western',       inspector: 'Ama Boateng',      date: '20 Mar 2025', time: '14:00', type: 'Surprise',  result: 'Fail',    findings: 'Guard not at post during inspection. Patrol log missing entries for 06:00–08:00.',                  score: 54 },
    { id: 'INS-2025-013', site: 'Kumasi Branch',       region: 'Ashanti',       inspector: 'Kofi Acheampong',  date: '19 Mar 2025', time: '10:30', type: 'Follow-up', result: 'Pass',    findings: 'Previous issues resolved. Equipment returned and accounted for.',                                  score: 91 },
    { id: 'INS-2025-012', site: 'Tema Industrial',     region: 'Greater Accra', inspector: 'Yaw Darko',        date: '18 Mar 2025', time: '08:00', type: 'Routine',   result: 'Pass',    findings: 'Excellent readiness. All guards properly uniformed. Patrol schedule adhered to.',                   score: 96 },
    { id: 'INS-2025-011', site: 'Cape Coast Post',     region: 'Central',       inspector: 'Abena Osei',       date: '17 Mar 2025', time: '11:00', type: 'Routine',   result: 'Pending', findings: 'Inspection in progress. Awaiting final checklist sign-off.',                                        score: 0  },
    { id: 'INS-2025-010', site: 'Head Office – Accra', region: 'Greater Accra', inspector: 'Kwame Mensah',     date: '14 Mar 2025', time: '09:00', type: 'Routine',   result: 'Pass',    findings: 'Standard inspection completed. All zones cleared.',                                                 score: 84 },
    { id: 'INS-2025-009', site: 'Kumasi Branch',       region: 'Ashanti',       inspector: 'Nana Acheampong',  date: '13 Mar 2025', time: '15:00', type: 'Surprise',  result: 'Fail',    findings: 'Two guards found out of uniform. Equipment storage room unlocked.',                                 score: 61 },
    { id: 'INS-2025-008', site: 'Takoradi Branch',     region: 'Western',       inspector: 'Ama Boateng',      date: '12 Mar 2025', time: '10:00', type: 'Follow-up', result: 'Pass',    findings: 'All corrective actions from INS-2025-007 completed satisfactorily.',                               score: 79 },
    { id: 'INS-2025-007', site: 'Takoradi Branch',     region: 'Western',       inspector: 'Ama Boateng',      date: '07 Mar 2025', time: '09:30', type: 'Routine',   result: 'Fail',    findings: 'Patrol log incomplete. Response time to alarm drill exceeded 5 minutes. Gate alarm faulty.',        score: 52 },
    { id: 'INS-2025-006', site: 'Tema Industrial',     region: 'Greater Accra', inspector: 'Kofi Acheampong',  date: '05 Mar 2025', time: '07:00', type: 'Surprise',  result: 'Pass',    findings: 'All guards on post. Perimeter check complete. Fire extinguishers within service date.',            score: 93 },
  ];

  filteredInspections: Inspection[] = [];

  get activeFilterCount(): number {
    let c = 0;
    if (this.selectedType   !== 'all') c++;
    if (this.selectedResult !== 'all') c++;
    if (this.selectedSite   !== 'all') c++;
    return c;
  }

  get passCount():    number { return this.inspections.filter(i => i.result === 'Pass').length; }
  get failCount():    number { return this.inspections.filter(i => i.result === 'Fail').length; }
  get pendingCount(): number { return this.inspections.filter(i => i.result === 'Pending').length; }
  get avgScore():     number {
    const scored = this.inspections.filter(i => i.score > 0);
    if (!scored.length) return 0;
    return Math.round(scored.reduce((sum, i) => sum + i.score, 0) / scored.length);
  }

  ngOnInit(): void { this.applyFilter(); }

  applyFilter(): void {
    let result = [...this.inspections];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(i =>
        i.id.toLowerCase().includes(q) ||
        i.site.toLowerCase().includes(q) ||
        i.inspector.toLowerCase().includes(q)
      );
    }
    if (this.selectedType   !== 'all') result = result.filter(i => i.type   === this.selectedType);
    if (this.selectedResult !== 'all') result = result.filter(i => i.result === this.selectedResult);
    if (this.selectedSite   !== 'all') result = result.filter(i => i.site   === this.selectedSite);
    this.filteredInspections = result;
  }

  onSearch(): void { this.applyFilter(); }
  toggleFilterPanel(): void { this.showFilterPanel = !this.showFilterPanel; }
  clearFilters(): void {
    this.selectedType   = 'all';
    this.selectedResult = 'all';
    this.selectedSite   = 'all';
    this.applyFilter();
  }

  openCreateSheet(): void {
    this.newForm = { site: '', inspector: '', date: '', time: '', type: '', findings: '', score: 85 };
    this.showCreateSheet = true;
  }

  submitInspection(): void {
    if (!this.newForm.site || !this.newForm.inspector || !this.newForm.type) return;
    const nextNum = this.inspections.length + 1;
    const id = `INS-2025-0${String(nextNum).padStart(2, '0')}`;
    const newItem: Inspection = {
      id,
      site:      this.newForm.site,
      region:    this.getRegionForSite(this.newForm.site),
      inspector: this.newForm.inspector,
      date:      this.newForm.date || '21 Mar 2025',
      time:      this.newForm.time || '--:--',
      type:      this.newForm.type as 'Routine' | 'Surprise' | 'Follow-up',
      result:    'Pending',
      findings:  this.newForm.findings,
      score:     0,
    };
    this.inspections.unshift(newItem);
    this.applyFilter();
    this.showCreateSheet = false;
    this.toast.show({ title: 'Inspection Logged', description: `${id} created successfully.`, variant: 'success' });
  }

  viewInspection(ins: Inspection): void {
    this.modal.open({
      title: `${ins.id} — ${ins.site}`,
      content: `
        <div class="space-y-3 text-sm">
          <div class="grid grid-cols-2 gap-3">
            <div><p class="text-xs text-muted-foreground mb-0.5">Site</p><p class="font-medium">${ins.site}</p></div>
            <div><p class="text-xs text-muted-foreground mb-0.5">Region</p><p class="font-medium">${ins.region}</p></div>
            <div><p class="text-xs text-muted-foreground mb-0.5">Inspector</p><p class="font-medium">${ins.inspector}</p></div>
            <div><p class="text-xs text-muted-foreground mb-0.5">Date & Time</p><p class="font-medium">${ins.date} · ${ins.time}</p></div>
            <div><p class="text-xs text-muted-foreground mb-0.5">Type</p><p class="font-medium">${ins.type}</p></div>
            <div><p class="text-xs text-muted-foreground mb-0.5">Score</p><p class="font-medium">${ins.score > 0 ? ins.score + '%' : 'N/A'}</p></div>
          </div>
          <div class="border-t border-border pt-3">
            <p class="text-xs text-muted-foreground mb-1">Findings</p>
            <p>${ins.findings || 'No findings recorded.'}</p>
          </div>
        </div>
      `,
      size: 'default',
    });
  }

  deleteInspection(ins: Inspection): void {
    const ref = this.alertDialog.open({
      title: 'Delete Inspection?',
      description: `Delete ${ins.id}? This cannot be undone.`,
      actionText: 'Delete',
      variant: 'destructive',
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      this.inspections = this.inspections.filter(i => i.id !== ins.id);
      this.applyFilter();
      this.toast.show({ title: 'Deleted', description: `${ins.id} removed.`, variant: 'destructive' });
    });
  }

  getResultBg(result: string): string {
    const map: Record<string, string> = {
      'Pass':    'rgba(34,197,94,0.15)',
      'Fail':    'rgba(239,68,68,0.15)',
      'Pending': 'rgba(234,179,8,0.15)',
    };
    return map[result] ?? 'rgba(148,163,184,0.15)';
  }

  getResultFg(result: string): string {
    const map: Record<string, string> = { 'Pass': '#16a34a', 'Fail': '#dc2626', 'Pending': '#ca8a04' };
    return map[result] ?? '#64748b';
  }

  getTypeBg(type: string): string {
    const map: Record<string, string> = {
      'Routine':   'rgba(59,130,246,0.15)',
      'Surprise':  'rgba(168,85,247,0.15)',
      'Follow-up': 'rgba(148,163,184,0.15)',
    };
    return map[type] ?? 'rgba(148,163,184,0.15)';
  }

  getTypeFg(type: string): string {
    const map: Record<string, string> = { 'Routine': '#2563eb', 'Surprise': '#7c3aed', 'Follow-up': '#64748b' };
    return map[type] ?? '#64748b';
  }

  getScoreColor(score: number): string {
    if (score === 0)  return '#94a3b8';
    if (score >= 85)  return '#16a34a';
    if (score >= 65)  return '#ca8a04';
    return '#dc2626';
  }

  private getRegionForSite(site: string): string {
    const map: Record<string, string> = {
      'Head Office – Accra': 'Greater Accra',
      'Tema Industrial':     'Greater Accra',
      'Kumasi Branch':       'Ashanti',
      'Takoradi Branch':     'Western',
      'Cape Coast Post':     'Central',
    };
    return map[site] ?? 'Unknown';
  }
}
