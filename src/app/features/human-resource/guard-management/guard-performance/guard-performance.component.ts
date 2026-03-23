import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, BadgeComponent, InputComponent, LabelComponent,
  SelectComponent, SelectItemComponent, TextareaComponent,
  TooltipDirective, DropdownTriggerDirective, DropdownMenuComponent,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  DataTableComponent, TolleCellDirective, TableColumn,
  SheetComponent, SheetContentComponent,
  ModalService, AlertDialogService, ToastService
} from '@tolle_/tolle-ui';
import { PermissionsService } from '../../../../../core/services/permissions.service';

interface GuardRecord {
  id: string;
  name: string;
  guardId: string;
  site: string;
  region: string;
  shiftsCompleted: number;
  absences: number;
  lateArrivals: number;
  incidentsInvolved: number;
  patrolCompliancePct: number;
  clientRating: number;
  performanceScore: number;
  grade: 'Excellent' | 'Good' | 'Average' | 'Poor';
  disciplinaryActions: number;
  lastReviewDate: string;
  notes: string;
}

@Component({
  selector: 'app-guard-performance',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, InputComponent, LabelComponent,
    SelectComponent, SelectItemComponent, TextareaComponent,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    DataTableComponent, TolleCellDirective,
    SheetComponent, SheetContentComponent,
  ],
  templateUrl: './guard-performance.component.html',
  styleUrls: ['./guard-performance.component.css'],
})
export class GuardPerformanceComponent implements OnInit {
  private modal       = inject(ModalService);
  private alertDialog = inject(AlertDialogService);
  private toast       = inject(ToastService);
  permissions = inject(PermissionsService);

  showFilterPanel  = false;
  showReviewSheet  = false;
  searchQuery      = '';
  selectedGrade    = 'all';
  selectedSite     = 'all';

  gradeOptions = ['Excellent', 'Good', 'Average', 'Poor'];
  siteOptions  = ['Head Office – Accra', 'Kumasi Branch', 'Takoradi Branch', 'Tema Industrial', 'Cape Coast Post'];

  reviewForm = {
    guardId: '',
    notes: '',
    disciplinaryAction: 'none',
  };

  selectedGuard: GuardRecord | null = null;

  columns: TableColumn[] = [
    { key: 'guard',               label: 'Guard' },
    { key: 'site',                label: 'Site' },
    { key: 'shiftsCompleted',     label: 'Shifts' },
    { key: 'attendance',          label: 'Attendance' },
    { key: 'patrolCompliance',    label: 'Patrol %' },
    { key: 'clientRating',        label: 'Client Rating' },
    { key: 'performanceScore',    label: 'Score' },
    { key: 'grade',               label: 'Grade' },
    { key: 'actions',             label: '' },
  ];

  guards: GuardRecord[] = [
    {
      id: 'GD-001', name: 'Kwame Asante',    guardId: 'GD-001', site: 'Head Office – Accra', region: 'Greater Accra',
      shiftsCompleted: 22, absences: 0, lateArrivals: 1, incidentsInvolved: 0,
      patrolCompliancePct: 98, clientRating: 4.8, performanceScore: 96,
      grade: 'Excellent', disciplinaryActions: 0, lastReviewDate: '01 Mar 2025',
      notes: 'Consistently exemplary. Top performer for Q1 2025.'
    },
    {
      id: 'GD-002', name: 'Ama Boateng',     guardId: 'GD-002', site: 'Kumasi Branch',       region: 'Ashanti',
      shiftsCompleted: 20, absences: 1, lateArrivals: 2, incidentsInvolved: 0,
      patrolCompliancePct: 94, clientRating: 4.5, performanceScore: 88,
      grade: 'Good', disciplinaryActions: 0, lastReviewDate: '05 Mar 2025',
      notes: 'Good performance. Minor attendance issues resolved.'
    },
    {
      id: 'GD-003', name: 'Kofi Acheampong', guardId: 'GD-003', site: 'Takoradi Branch',     region: 'Western',
      shiftsCompleted: 18, absences: 3, lateArrivals: 5, incidentsInvolved: 1,
      patrolCompliancePct: 79, clientRating: 3.2, performanceScore: 64,
      grade: 'Poor', disciplinaryActions: 1, lastReviewDate: '10 Mar 2025',
      notes: 'Performance has declined. Verbal warning issued. Improvement plan in place.'
    },
    {
      id: 'GD-004', name: 'Yaw Darko',       guardId: 'GD-004', site: 'Tema Industrial',     region: 'Greater Accra',
      shiftsCompleted: 21, absences: 0, lateArrivals: 0, incidentsInvolved: 0,
      patrolCompliancePct: 100, clientRating: 5.0, performanceScore: 99,
      grade: 'Excellent', disciplinaryActions: 0, lastReviewDate: '01 Mar 2025',
      notes: 'Perfect attendance. Clients frequently request by name.'
    },
    {
      id: 'GD-005', name: 'Abena Osei',      guardId: 'GD-005', site: 'Cape Coast Post',     region: 'Central',
      shiftsCompleted: 19, absences: 2, lateArrivals: 1, incidentsInvolved: 0,
      patrolCompliancePct: 91, clientRating: 4.1, performanceScore: 83,
      grade: 'Good', disciplinaryActions: 0, lastReviewDate: '08 Mar 2025',
      notes: 'Solid performer. Absences due to medical leave — acceptable.'
    },
    {
      id: 'GD-006', name: 'Nana Acheampong', guardId: 'GD-006', site: 'Kumasi Branch',       region: 'Ashanti',
      shiftsCompleted: 15, absences: 5, lateArrivals: 7, incidentsInvolved: 2,
      patrolCompliancePct: 71, clientRating: 2.8, performanceScore: 55,
      grade: 'Poor', disciplinaryActions: 2, lastReviewDate: '12 Mar 2025',
      notes: 'Two written warnings issued. Client has complained. Under close supervision.'
    },
    {
      id: 'GD-007', name: 'Efua Mensah',     guardId: 'GD-007', site: 'Head Office – Accra', region: 'Greater Accra',
      shiftsCompleted: 20, absences: 1, lateArrivals: 3, incidentsInvolved: 0,
      patrolCompliancePct: 87, clientRating: 4.0, performanceScore: 79,
      grade: 'Average', disciplinaryActions: 0, lastReviewDate: '03 Mar 2025',
      notes: 'Meets minimum expectations. Encouragement given to improve patrol compliance.'
    },
    {
      id: 'GD-008', name: 'Kwabena Ofori',   guardId: 'GD-008', site: 'Takoradi Branch',     region: 'Western',
      shiftsCompleted: 22, absences: 0, lateArrivals: 0, incidentsInvolved: 0,
      patrolCompliancePct: 97, clientRating: 4.7, performanceScore: 95,
      grade: 'Excellent', disciplinaryActions: 0, lastReviewDate: '01 Mar 2025',
      notes: 'Reliable and professional. Nominated for Guard of the Month.'
    },
    {
      id: 'GD-009', name: 'Adwoa Amponsah',  guardId: 'GD-009', site: 'Tema Industrial',     region: 'Greater Accra',
      shiftsCompleted: 17, absences: 3, lateArrivals: 4, incidentsInvolved: 1,
      patrolCompliancePct: 80, clientRating: 3.5, performanceScore: 68,
      grade: 'Average', disciplinaryActions: 1, lastReviewDate: '15 Mar 2025',
      notes: 'Performance is declining. Meeting scheduled for next week.'
    },
    {
      id: 'GD-010', name: 'Akosua Frimpong', guardId: 'GD-010', site: 'Cape Coast Post',     region: 'Central',
      shiftsCompleted: 21, absences: 1, lateArrivals: 2, incidentsInvolved: 0,
      patrolCompliancePct: 93, clientRating: 4.3, performanceScore: 86,
      grade: 'Good', disciplinaryActions: 0, lastReviewDate: '04 Mar 2025',
      notes: 'Strong improvement from last quarter. Commendation noted.'
    },
  ];

  filteredGuards: GuardRecord[] = [];

  get excellentCount(): number { return this.guards.filter(g => g.grade === 'Excellent').length; }
  get goodCount():      number { return this.guards.filter(g => g.grade === 'Good').length; }
  get poorCount():      number { return this.guards.filter(g => g.grade === 'Poor' || g.grade === 'Average').length; }
  get avgScore():       number {
    if (!this.guards.length) return 0;
    return Math.round(this.guards.reduce((s, g) => s + g.performanceScore, 0) / this.guards.length);
  }

  get activeFilterCount(): number {
    let c = 0;
    if (this.selectedGrade !== 'all') c++;
    if (this.selectedSite  !== 'all') c++;
    return c;
  }

  ngOnInit(): void { this.applyFilter(); }

  applyFilter(): void {
    let result = [...this.guards];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(g =>
        g.name.toLowerCase().includes(q) ||
        g.guardId.toLowerCase().includes(q) ||
        g.site.toLowerCase().includes(q)
      );
    }
    if (this.selectedGrade !== 'all') result = result.filter(g => g.grade === this.selectedGrade);
    if (this.selectedSite  !== 'all') result = result.filter(g => g.site  === this.selectedSite);
    this.filteredGuards = result;
  }

  onSearch(): void { this.applyFilter(); }
  toggleFilterPanel(): void { this.showFilterPanel = !this.showFilterPanel; }
  clearFilters(): void {
    this.selectedGrade = 'all';
    this.selectedSite  = 'all';
    this.applyFilter();
  }

  viewGuard(guard: GuardRecord): void {
    this.modal.open({
      title: `${guard.name} — Performance Review`,
      content: `
        <div class="space-y-4 text-sm">
          <div class="grid grid-cols-2 gap-3">
            <div><p class="text-xs text-muted-foreground mb-0.5">Guard ID</p><p class="font-medium">${guard.guardId}</p></div>
            <div><p class="text-xs text-muted-foreground mb-0.5">Site</p><p class="font-medium">${guard.site}</p></div>
            <div><p class="text-xs text-muted-foreground mb-0.5">Last Review</p><p class="font-medium">${guard.lastReviewDate}</p></div>
            <div><p class="text-xs text-muted-foreground mb-0.5">Grade</p><p class="font-bold">${guard.grade}</p></div>
          </div>
          <div class="border-t border-border pt-3 grid grid-cols-3 gap-3">
            <div class="text-center p-3 bg-muted/30 rounded-lg">
              <p class="text-xs text-muted-foreground mb-1">Shifts Done</p>
              <p class="font-bold">${guard.shiftsCompleted}</p>
            </div>
            <div class="text-center p-3 bg-muted/30 rounded-lg">
              <p class="text-xs text-muted-foreground mb-1">Absences</p>
              <p class="font-bold">${guard.absences}</p>
            </div>
            <div class="text-center p-3 bg-muted/30 rounded-lg">
              <p class="text-xs text-muted-foreground mb-1">Late Arrivals</p>
              <p class="font-bold">${guard.lateArrivals}</p>
            </div>
            <div class="text-center p-3 bg-muted/30 rounded-lg">
              <p class="text-xs text-muted-foreground mb-1">Patrol %</p>
              <p class="font-bold">${guard.patrolCompliancePct}%</p>
            </div>
            <div class="text-center p-3 bg-muted/30 rounded-lg">
              <p class="text-xs text-muted-foreground mb-1">Client Rating</p>
              <p class="font-bold">${guard.clientRating}/5</p>
            </div>
            <div class="text-center p-3 bg-muted/30 rounded-lg">
              <p class="text-xs text-muted-foreground mb-1">Disciplinary</p>
              <p class="font-bold">${guard.disciplinaryActions}</p>
            </div>
          </div>
          <div class="border-t border-border pt-3">
            <p class="text-xs text-muted-foreground mb-1">Notes</p>
            <p>${guard.notes}</p>
          </div>
        </div>
      `,
      size: 'lg',
    });
  }

  openReviewSheet(guard: GuardRecord): void {
    this.selectedGuard = guard;
    this.reviewForm = { guardId: guard.guardId, notes: '', disciplinaryAction: 'none' };
    this.showReviewSheet = true;
  }

  submitReview(): void {
    if (!this.selectedGuard || !this.reviewForm.notes) return;
    this.selectedGuard.notes = this.reviewForm.notes;
    if (this.reviewForm.disciplinaryAction !== 'none') {
      this.selectedGuard.disciplinaryActions += 1;
    }
    this.applyFilter();
    this.showReviewSheet = false;
    this.toast.show({ title: 'Review Saved', description: `Performance review for ${this.selectedGuard.name} has been recorded.`, variant: 'success' });
    this.selectedGuard = null;
  }

  getGradeBg(grade: string): string {
    const map: Record<string, string> = {
      'Excellent': 'rgba(34,197,94,0.15)',
      'Good':      'rgba(59,130,246,0.15)',
      'Average':   'rgba(234,179,8,0.15)',
      'Poor':      'rgba(239,68,68,0.15)',
    };
    return map[grade] ?? 'rgba(148,163,184,0.15)';
  }

  getGradeFg(grade: string): string {
    const map: Record<string, string> = {
      'Excellent': '#16a34a',
      'Good':      '#2563eb',
      'Average':   '#ca8a04',
      'Poor':      '#dc2626',
    };
    return map[grade] ?? '#64748b';
  }

  getScoreColor(score: number): string {
    if (score >= 85) return '#16a34a';
    if (score >= 70) return '#ca8a04';
    return '#dc2626';
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }
}
