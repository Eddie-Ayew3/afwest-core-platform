import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ButtonComponent, InputComponent, LabelComponent,
  SelectComponent, SelectItemComponent, TextareaComponent,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  DataTableComponent, TolleCellDirective, TableColumn,
  SheetComponent, SheetContentComponent,
  AlertDialogService, ToastService, ModalService
} from '@tolle_/tolle-ui';
import { DepartmentActions } from '../stores/department.actions';
import { selectDepartments, selectDepartmentLoading, selectDepartmentSaving } from '../stores/department.selectors';
import { DepartmentDto, CreateDepartmentDto, UpdateDepartmentDto } from '../models/department.model';

@Component({
  selector: 'app-department-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent,  InputComponent, LabelComponent,
    SelectComponent, SelectItemComponent, TextareaComponent,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    DataTableComponent, TolleCellDirective,
    SheetComponent, SheetContentComponent,
  ],
  templateUrl: './department-management.component.html',
  styleUrl: './department-management.component.css'
})
export class DepartmentManagementComponent implements OnInit {
  private store = inject(Store);
  private modalService = inject(ModalService);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  columns: TableColumn[] = [
    { key: 'name', label: 'Department' },
    { key: 'code', label: 'Code' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions', class: 'text-right' },
  ];

  departments: DepartmentDto[] = [];
  filteredDepartments: DepartmentDto[] = [];
  loading = false;
  saving = false;
  showSheet = false;
  isEditing = false;
  searchQuery = '';
  filterStatus: 'all' | 'active' | 'inactive' = 'all';

  form: CreateDepartmentDto & { isActive: boolean } = {
    name: '',
    code: '',
    description: '',
    isActive: true
  };

  get activeCount() { return this.departments.filter(d => d.isActive).length; }
  get inactiveCount() { return this.departments.filter(d => !d.isActive).length; }
  get totalCount() { return this.departments.length; }

  ngOnInit() {
    this.store.dispatch(DepartmentActions.loadDepartments({}));
    
    this.store.select(selectDepartments)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(departments => {
        this.departments = departments;
        this.applyFilter();
      });

    this.store.select(selectDepartmentLoading)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(loading => this.loading = loading);

    this.store.select(selectDepartmentSaving)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(saving => this.saving = saving);
  }

  applyFilter() {
    let result = [...this.departments];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q)
      );
    }
    if (this.filterStatus === 'active') result = result.filter(d => d.isActive);
    if (this.filterStatus === 'inactive') result = result.filter(d => !d.isActive);
    this.filteredDepartments = result;
  }

  onSearch() { this.applyFilter(); }

  openCreateSheet() {
    this.isEditing = false;
    this.form = { name: '', code: '', description: '', isActive: true };
    this.showSheet = true;
  }

  openEditSheet(department: DepartmentDto) {
    this.isEditing = true;
    this.form = {
      name: department.name,
      code: department.code,
      description: department.description || '',
      isActive: department.isActive
    };
    this.showSheet = true;
  }

  closeSheet() {
    this.showSheet = false;
    this.form = { name: '', code: '', description: '', isActive: true };
  }

  submitForm() {
    if (!this.form.name.trim() || !this.form.code.trim()) return;

    if (this.isEditing) {
      const dept = this.departments.find(d => d.name === this.form.name);
      if (dept) {
        this.store.dispatch(DepartmentActions.updateDepartment({
          id: dept.id,
          dto: {
            name: this.form.name,
            code: this.form.code,
            description: this.form.description,
            isActive: this.form.isActive
          }
        }));
      }
    } else {
      this.store.dispatch(DepartmentActions.createDepartment({
        dto: {
          name: this.form.name,
          code: this.form.code,
          description: this.form.description
        }
      }));
    }
    this.closeSheet();
  }

  deleteDepartment(department: DepartmentDto) {
    const ref = this.alertDialog.open({
      title: 'Delete Department?',
      description: `Delete department "${department.name}"? This will deactivate it.`,
      actionText: 'Delete',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.store.dispatch(DepartmentActions.deleteDepartment({ id: department.id }));
      }
    });
  }

  getStatusBadge(status: boolean): { bg: string; fg: string; label: string } {
    if (status) {
      return { bg: 'rgba(34,197,94,0.15)', fg: '#16a34a', label: 'Active' };
    }
    return { bg: 'rgba(148,163,184,0.15)', fg: '#9CA3AF', label: 'Inactive' };
  }
}
