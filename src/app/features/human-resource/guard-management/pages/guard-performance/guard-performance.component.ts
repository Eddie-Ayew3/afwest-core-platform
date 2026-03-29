import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { GuardActions } from '../../stores/guard.actions';
import { selectGuards, selectGuardLoading, selectGuardError, selectPerformance } from '../../stores/guard.selectors';
import { GuardPerformanceDto, GuardDto } from '../../models/guard.model';
import { GuardService } from '../../services/guard.service';

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
  private store = inject(Store);
  private guardService = inject(GuardService);
  private modal = inject(ModalService);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);
  permissions = inject(PermissionsService);

  showFilterPanel = false;
  showReviewSheet = false;
  isLoading = false;
  searchQuery = '';
  selectedGrade = 'all';
  selectedSite = 'all';

  gradeOptions = ['Excellent', 'Good', 'Average', 'Poor'];
  siteOptions: string[] = [];

  reviewForm = {
    guardId: '',
    notes: '',
    disciplinaryAction: 'none',
  };

  selectedGuard: GuardPerformanceDto | null = null;

  columns: TableColumn[] = [
    { key: 'guard', label: 'Guard' },
    { key: 'site', label: 'Site' },
    { key: 'shiftsCompleted', label: 'Shifts' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'patrolCompliance', label: 'Patrol %' },
    { key: 'clientRating', label: 'Client Rating' },
    { key: 'performanceScore', label: 'Score' },
    { key: 'grade', label: 'Grade' },
    { key: 'actions', label: 'Action', class:'text-right' },
  ];

  guards: GuardPerformanceDto[] = [];
  filteredGuards: GuardPerformanceDto[] = [];

  get excellentCount(): number { return this.guards.filter(g => g.grade === 'Excellent').length; }
  get goodCount(): number { return this.guards.filter(g => g.grade === 'Good').length; }
  get poorCount(): number { return this.guards.filter(g => g.grade === 'Poor' || g.grade === 'Average').length; }
  get avgScore(): number {
    if (!this.guards.length) return 0;
    return Math.round(this.guards.reduce((s, g) => s + g.performanceScore, 0) / this.guards.length);
  }

  get activeFilterCount(): number {
    let c = 0;
    if (this.selectedGrade !== 'all') c++;
    if (this.selectedSite !== 'all') c++;
    return c;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.store.dispatch(GuardActions.loadGuards({ params: { pageNumber: 1, pageSize: 100 } }));
    
    this.store.select(selectGuards).subscribe(guards => {
      this.loadPerformanceData(guards);
    });
  }

  private loadPerformanceData(guards: GuardDto[]): void {
    if (guards.length === 0) {
      this.isLoading = false;
      return;
    }

    const performanceRequests = guards.map(g => 
      this.guardService.getPerformance(g.id)
    );

    Promise.all(performanceRequests.map(o => o.toPromise())).then(results => {
      this.guards = results.filter(p => !!p);
      this.siteOptions = [...new Set(this.guards.map(g => g.siteName).filter((s): s is string => !!s))];
      this.applyFilter();
      this.isLoading = false;
    }).catch(() => {
      this.toast.show({ title: 'Error', description: 'Failed to load performance data', variant: 'destructive' });
      this.isLoading = false;
    });
  }

  viewGuard(guard: GuardPerformanceDto): void {
    this.store.dispatch(GuardActions.loadGuardPerformance({ id: guard.guardId }));
    
    this.store.select(selectPerformance).subscribe(performance => {
      if (performance) {
        this.modal.open({
          title: `${performance.fullName} — Performance Review`,
          content: `
            <div class="space-y-4 text-sm">
              <div class="grid grid-cols-2 gap-3">
                <div><p class="text-xs text-muted-foreground mb-0.5">Guard ID</p><p class="font-medium">${performance.employeeId}</p></div>
                <div><p class="text-xs text-muted-foreground mb-0.5">Site</p><p class="font-medium">${performance.siteName || 'N/A'}</p></div>
                <div><p class="text-xs text-muted-foreground mb-0.5">Region</p><p class="font-medium">${performance.regionName || 'N/A'}</p></div>
                <div><p class="text-xs text-muted-foreground mb-0.5">Grade</p><p class="font-bold">${performance.grade}</p></div>
              </div>
              <div class="border-t border-border pt-3 grid grid-cols-3 gap-3">
                <div class="text-center p-3 bg-muted/30 rounded-lg">
                  <p class="text-xs text-muted-foreground mb-1">Shifts Done</p>
                  <p class="font-bold">${performance.completedShifts}</p>
                </div>
                <div class="text-center p-3 bg-muted/30 rounded-lg">
                  <p class="text-xs text-muted-foreground mb-1">Absences</p>
                  <p class="font-bold">${performance.absences}</p>
                </div>
                <div class="text-center p-3 bg-muted/30 rounded-lg">
                  <p class="text-xs text-muted-foreground mb-1">Late Arrivals</p>
                  <p class="font-bold">${performance.lateArrivals}</p>
                </div>
                <div class="text-center p-3 bg-muted/30 rounded-lg">
                  <p class="text-xs text-muted-foreground mb-1">Patrol %</p>
                  <p class="font-bold">${performance.patrolCompliancePct}%</p>
                </div>
                <div class="text-center p-3 bg-muted/30 rounded-lg">
                  <p class="text-xs text-muted-foreground mb-1">Client Rating</p>
                  <p class="font-bold">${performance.clientRating}/5</p>
                </div>
                <div class="text-center p-3 bg-muted/30 rounded-lg">
                  <p class="text-xs text-muted-foreground mb-1">Disciplinary</p>
                  <p class="font-bold">${performance.disciplinaryActions}</p>
                </div>
              </div>
              <div class="border-t border-border pt-3">
                <p class="text-xs text-muted-foreground mb-1">Notes</p>
                <p>${performance.notes || 'No notes recorded.'}</p>
              </div>
            </div>
          `,
          size: 'lg',
        });
      }
    });
  }

  applyFilter(): void {
    let result = [...this.guards];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(g =>
        g.fullName.toLowerCase().includes(q) ||
        g.employeeId.toLowerCase().includes(q) ||
        (g.siteName?.toLowerCase() ?? '').includes(q)
      );
    }
    if (this.selectedGrade !== 'all') result = result.filter(g => g.grade === this.selectedGrade);
    if (this.selectedSite !== 'all') result = result.filter(g => g.siteName === this.selectedSite);
    this.filteredGuards = result;
  }

  onSearch(): void { this.applyFilter(); }
  toggleFilterPanel(): void { this.showFilterPanel = !this.showFilterPanel; }
  clearFilters(): void {
    this.selectedGrade = 'all';
    this.selectedSite = 'all';
    this.applyFilter();
  }

  openReviewSheet(guard: GuardPerformanceDto): void {
    this.selectedGuard = guard;
    this.reviewForm = { guardId: guard.employeeId, notes: guard.notes || '', disciplinaryAction: 'none' };
    this.showReviewSheet = true;
  }

  submitReview(): void {
    if (!this.selectedGuard || !this.reviewForm.notes) return;
    
    this.store.dispatch(GuardActions.submitPerformanceReview({
      id: this.selectedGuard.guardId,
      dto: {
        notes: this.reviewForm.notes,
        disciplinaryActions: this.reviewForm.disciplinaryAction !== 'none' ? 1 : 0
      }
    }));
    
    this.toast.show({ title: 'Review Saved', description: `Performance review for ${this.selectedGuard?.fullName} has been recorded.`, variant: 'success' });
    this.showReviewSheet = false;
    this.selectedGuard = null;
  }

  getGradeBg(grade: string): string {
    const map: Record<string, string> = {
      'Excellent': 'rgba(34,197,94,0.15)',
      'Good': 'rgba(59,130,246,0.15)',
      'Average': 'rgba(234,179,8,0.15)',
      'Poor': 'rgba(239,68,68,0.15)',
    };
    return map[grade] ?? 'rgba(148,163,184,0.15)';
  }

  getGradeFg(grade: string): string {
    const map: Record<string, string> = {
      'Excellent': '#16a34a',
      'Good': '#2563eb',
      'Average': '#ca8a04',
      'Poor': '#dc2626',
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
