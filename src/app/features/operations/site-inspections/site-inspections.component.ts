import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ButtonComponent, InputComponent, LabelComponent,
  SelectComponent, SelectItemComponent, TextareaComponent,
  TooltipDirective, DropdownTriggerDirective, DropdownMenuComponent,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  DataTableComponent, TolleCellDirective, TableColumn,
  SheetComponent, SheetContentComponent,
  AlertDialogService, ToastService, ModalService
} from '@tolle_/tolle-ui';
import { SiteInspectionActions } from './stores/site-inspection.actions';
import { selectSiteInspections, selectSiteInspectionLoading, selectSiteInspectionSaving } from './stores/site-inspection.selectors';
import { SiteInspectionDto, CreateSiteInspectionDto } from './models/site-inspection.model';

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
  private store = inject(Store);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);
  private modal = inject(ModalService);
  private destroyRef = inject(DestroyRef);

  showFilterPanel = false;
  showCreateSheet = false;
  searchQuery = '';
  selectedType = 'all';
  selectedResult = 'all';
  selectedSite = 'all';

  typeOptions = ['Routine', 'Surprise', 'FollowUp'];
  resultOptions = ['Scheduled', 'InProgress', 'Completed', 'Cancelled'];
  siteOptions: string[] = [];

  newForm: CreateSiteInspectionDto = {
    siteId: '',
    inspectionType: 'Routine',
    scheduledDate: '',
    inspectorName: '',
    notes: ''
  };

  inspectionTime = '';

  columns: TableColumn[] = [
    { key: 'id', label: 'Ref No.' },
    { key: 'site', label: 'Site' },
    { key: 'inspector', label: 'Inspector' },
    { key: 'date', label: 'Date' },
    { key: 'type', label: 'Type' },
    { key: 'score', label: 'Score' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '' },
  ];

  inspections: SiteInspectionDto[] = [];
  filteredInspections: SiteInspectionDto[] = [];
  loading = false;
  saving = false;

  get activeFilterCount(): number {
    let c = 0;
    if (this.selectedType !== 'all') c++;
    if (this.selectedResult !== 'all') c++;
    if (this.selectedSite !== 'all') c++;
    return c;
  }

  get passCount() { return this.inspections.filter(i => i.status === 'Completed' && (i.overallScore ?? 0) >= 70).length; }
  get failCount() { return this.inspections.filter(i => i.status === 'Completed' && (i.overallScore ?? 0) < 70).length; }
  get pendingCount() { return this.inspections.filter(i => i.status === 'Scheduled').length; }
  get avgScore() {
    const completed = this.inspections.filter(i => i.status === 'Completed' && i.overallScore);
    if (!completed.length) return 0;
    return Math.round(completed.reduce((s, i) => s + (i.overallScore ?? 0), 0) / completed.length);
  }

  ngOnInit() {
    this.store.dispatch(SiteInspectionActions.loadInspections({ params: { pageNumber: 1, pageSize: 100 } }));
    
    this.store.select(selectSiteInspections)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(inspections => {
        this.inspections = inspections;
        this.siteOptions = [...new Set(inspections.map(i => i.siteName))];
        this.applyFilter();
      });

    this.store.select(selectSiteInspectionLoading)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(loading => this.loading = loading);

    this.store.select(selectSiteInspectionSaving)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(saving => this.saving = saving);
  }

  applyFilter() {
    let result = [...this.inspections];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(i =>
        i.siteName.toLowerCase().includes(q) ||
        i.inspectorName?.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q)
      );
    }
    if (this.selectedType !== 'all') result = result.filter(i => i.inspectionType === this.selectedType);
    if (this.selectedResult !== 'all') result = result.filter(i => i.status === this.selectedResult);
    if (this.selectedSite !== 'all') result = result.filter(i => i.siteName === this.selectedSite);
    this.filteredInspections = result;
  }

  onSearch() { this.applyFilter(); }

  toggleFilterPanel() { this.showFilterPanel = !this.showFilterPanel; }

  clearFilters() {
    this.selectedType = 'all';
    this.selectedResult = 'all';
    this.selectedSite = 'all';
    this.applyFilter();
  }

  openCreateSheet() {
    this.newForm = {
      siteId: '',
      inspectionType: 'Routine',
      scheduledDate: '',
      inspectorName: '',
      notes: ''
    };
    this.showCreateSheet = true;
  }

  submitInspection() {
    if (!this.newForm.siteId || !this.newForm.scheduledDate) return;
    this.store.dispatch(SiteInspectionActions.createInspection({ dto: this.newForm }));
    this.showCreateSheet = false;
  }

  deleteInspection(inspection: SiteInspectionDto) {
    const ref = this.alertDialog.open({
      title: 'Delete Inspection?',
      description: `Delete inspection "${inspection.id}"? This cannot be undone.`,
      actionText: 'Delete',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.store.dispatch(SiteInspectionActions.deleteInspection({ id: inspection.id }));
      }
    });
  }

  startInspection(inspection: SiteInspectionDto) {
    const ref = this.alertDialog.open({
      title: 'Start Inspection?',
      description: `Start inspection "${inspection.id}"?`,
      actionText: 'Start',
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.store.dispatch(SiteInspectionActions.startInspection({ id: inspection.id }));
      }
    });
  }

  completeInspection(inspection: SiteInspectionDto) {
    const ref = this.alertDialog.open({
      title: 'Complete Inspection?',
      description: `Complete inspection "${inspection.id}"?`,
      actionText: 'Complete',
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.store.dispatch(SiteInspectionActions.completeInspection({ id: inspection.id }));
      }
    });
  }

  cancelInspection(inspection: SiteInspectionDto) {
    const ref = this.alertDialog.open({
      title: 'Cancel Inspection?',
      description: `Cancel inspection "${inspection.id}"?`,
      actionText: 'Cancel',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.store.dispatch(SiteInspectionActions.cancelInspection({ id: inspection.id }));
      }
    });
  }

  viewInspection(inspection: SiteInspectionDto) {
    this.modal.open({
      title: `Inspection Details – ${inspection.id}`,
      content: `
        <div class="space-y-3 text-sm">
          <div class="grid grid-cols-2 gap-3">
            <div><p class="text-xs text-muted-foreground mb-0.5">Site</p><p class="font-medium">${inspection.siteName}</p></div>
            <div><p class="text-xs text-muted-foreground mb-0.5">Type</p><p class="font-medium">${this.formatType(inspection.inspectionType)}</p></div>
            <div><p class="text-xs text-muted-foreground mb-0.5">Inspector</p><p class="font-medium">${inspection.inspectorName || 'TBD'}</p></div>
            <div><p class="text-xs text-muted-foreground mb-0.5">Status</p><p class="font-medium">${inspection.status}</p></div>
          </div>
          ${inspection.findings ? `<div class="border-t border-border pt-3"><p class="text-xs text-muted-foreground mb-1">Findings</p><p>${inspection.findings}</p></div>` : ''}
          ${inspection.recommendations ? `<div class="border-t border-border pt-3"><p class="text-xs text-muted-foreground mb-1">Recommendations</p><p>${inspection.recommendations}</p></div>` : ''}
          ${inspection.overallScore ? `<div class="border-t border-border pt-3"><p class="text-xs text-muted-foreground mb-1">Score</p><p class="font-bold text-lg">${inspection.overallScore}/100</p></div>` : ''}
        </div>
      `,
      size: 'lg',
      showCloseButton: true,
    });
  }

  formatType(type: string): string {
    return type === 'FollowUp' ? 'Follow-up' : type;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  getStatusBg(status: string): string {
    const map: Record<string, string> = {
      'Scheduled': 'rgba(33, 150, 243, 0.15)',
      'InProgress': 'rgba(234, 179, 8, 0.15)',
      'Completed': 'rgba(34, 197, 94, 0.15)',
      'Cancelled': 'rgba(239, 68, 68, 0.15)'
    };
    return map[status] ?? '';
  }

  getStatusFg(status: string): string {
    const map: Record<string, string> = {
      'Scheduled': '#2196F3',
      'InProgress': '#ca8a04',
      'Completed': '#16a34a',
      'Cancelled': '#dc2626'
    };
    return map[status] ?? '';
  }

  getResultColor(score: number): string {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#ca8a04';
    return '#dc2626';
  }

  getScoreColor(score: number): string {
    return this.getResultColor(score ?? 0);
  }

  getTypeBg(type: string): string {
    const map: Record<string, string> = {
      'Routine': 'rgba(33, 150, 243, 0.15)',
      'Surprise': 'rgba(245, 158, 11, 0.15)',
      'FollowUp': 'rgba(139, 92, 246, 0.15)',
    };
    return map[type] ?? 'rgba(120,120,120,0.15)';
  }

  getTypeFg(type: string): string {
    const map: Record<string, string> = {
      'Routine': '#2196F3',
      'Surprise': '#D97706',
      'FollowUp': '#7C3AED',
    };
    return map[type] ?? '#555';
  }

  getResultBg(result: string): string {
    const map: Record<string, string> = {
      'Pass': 'rgba(34, 197, 94, 0.15)',
      'Fail': 'rgba(239, 68, 68, 0.15)',
      'Pending': 'rgba(234, 179, 8, 0.15)',
    };
    return map[result] ?? 'rgba(120,120,120,0.15)';
  }

  getResultFg(result: string): string {
    const map: Record<string, string> = {
      'Pass': '#16a34a',
      'Fail': '#dc2626',
      'Pending': '#ca8a04',
    };
    return map[result] ?? '#555';
  }
}
