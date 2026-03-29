import { Component, OnInit, inject, ViewChild, TemplateRef, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ButtonComponent, BadgeComponent,
  SelectComponent, SelectItemComponent,
  TooltipDirective, DropdownTriggerDirective, DropdownMenuComponent,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  DataTableComponent, TolleCellDirective, TableColumn,
  ModalService, AlertDialogService, ToastService
} from '@tolle_/tolle-ui';
import { PermissionsService } from '../../../../../core/services/permissions.service';
import { ClientActions } from '../../stores/client.actions';
import { selectClients, selectClientLoading, selectClientTotalCount } from '../../stores/client.selectors';
import { ClientDto } from '../../models/client.model';

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, 
    SelectComponent, SelectItemComponent,
     DropdownTriggerDirective, DropdownMenuComponent,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    DataTableComponent, TolleCellDirective,
  ],
  templateUrl: './client-management.component.html',
  styleUrls: ['./client-management.component.css']
})
export class ClientManagementComponent implements OnInit {
  private store = inject(Store);
  private permissions = inject(PermissionsService);
  private router = inject(Router);
  readonly modalService = inject(ModalService);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  @ViewChild('approvalModal') approvalModal!: TemplateRef<any>;
  @ViewChild('rejectionModal') rejectionModal!: TemplateRef<any>;

  public isHrSection = false;

  approvingClient: ClientDto | null = null;
  rejectingClient: ClientDto | null = null;
  rejectionReason = '';

  columns: TableColumn[] = [
    { key: 'name',        label: 'Client Name' },
    { key: 'contact',     label: 'Contact' },
    { key: 'status',      label: 'Status' },
    { key: 'contractEnd', label: 'Contract End' },
    { key: 'actions',     label: 'Actions', class: 'text-right' },
  ];

  clients: ClientDto[] = [];
  filteredClients: ClientDto[] = [];
  loading = false;
  totalCount = 0;
  showFilterPanel = false;
  selectedStatus = 'all';
  searchQuery = '';

  get activeFilterCount(): number {
    let c = 0;
    if (this.selectedStatus !== 'all') c++;
    if (this.searchQuery.trim()) c++;
    return c;
  }

  get activeCount()    { return this.clients.filter(c => c.status === 'Active').length; }
  get pendingCount()   { return this.clients.filter(c => c.status === 'Pending').length; }
  get suspendedCount() { return this.clients.filter(c => c.status === 'Suspended').length; }

  ngOnInit(): void {
    this.isHrSection = this.router.url.startsWith('/hr/');

    this.store.select(selectClients)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(clients => { this.clients = clients; this.applyFilter(); });

    this.store.select(selectClientLoading)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(loading => this.loading = loading);

    this.store.select(selectClientTotalCount)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(total => this.totalCount = total);

    this.store.dispatch(ClientActions.loadClients({ params: { pageNumber: 1, pageSize: 100 } }));
  }

  applyFilter(): void {
    let result = [...this.clients];
    if (this.selectedStatus !== 'all') result = result.filter(c => c.status === this.selectedStatus);
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.contactPersonName?.toLowerCase() ?? '').includes(q) ||
        c.email.toLowerCase().includes(q)
      );
    }
    this.filteredClients = result;
  }

  onSearch(): void { this.applyFilter(); }
  toggleFilterPanel(): void { this.showFilterPanel = !this.showFilterPanel; }
  clearFilters(): void { this.selectedStatus = 'all'; this.searchQuery = ''; this.applyFilter(); }

  isContractEndingSoon(endDate: string | undefined): boolean {
    if (!endDate) return false;
    const end = new Date(endDate);
    const today = new Date();
    const thirtyDays = new Date(today);
    thirtyDays.setDate(today.getDate() + 30);
    return end <= thirtyDays && end >= today;
  }

  navigateToClient(client: ClientDto): void {
    this.router.navigate(['/client/dashboard', client.id]);
  }

  navigateToViewClient(client: ClientDto): void {
    this.router.navigate(['/hr/client-management/view-client', client.id]);
  }

  navigateToNewClient(): void {
    if (this.isHrSection) this.router.navigate(['/hr/client-management/new-client']);
  }

  canApproveClients(): boolean {
    return ['Admin', 'GeneralManager', 'ManagingDirector', 'OperationsDirector'].includes(this.permissions.role);
  }

  isPendingApproval(client: ClientDto): boolean { return client.status === 'Pending'; }
  canNavigateToClient(client: ClientDto): boolean { return client.status === 'Active'; }

  openApprovalModal(client: ClientDto): void {
    this.approvingClient = client;
    this.modalService.open({ title: `Approve Client — ${client.name}`, content: this.approvalModal, size: 'default', showCloseButton: true, backdropClose: true });
  }

  openRejectionModal(client: ClientDto): void {
    this.rejectingClient = client;
    this.rejectionReason = '';
    this.modalService.open({ title: `Reject Client — ${client.name}`, content: this.rejectionModal, size: 'default', showCloseButton: true, backdropClose: true });
  }

  approveClient(): void {
    if (!this.approvingClient) return;
    this.store.dispatch(ClientActions.approveClient({ id: this.approvingClient.id }));
    this.approvingClient = null;
    this.modalService.closeAll();
  }

  rejectClient(): void {
    if (!this.rejectingClient || !this.rejectionReason.trim()) return;
    this.store.dispatch(ClientActions.terminateClient({ id: this.rejectingClient.id, dto: { reason: this.rejectionReason.trim() } }));
    this.rejectingClient = null;
    this.rejectionReason = '';
    this.modalService.closeAll();
  }

  deleteClient(client: ClientDto): void {
    const ref = this.alertDialog.open({
      title: 'Delete Client?',
      description: `Delete "${client.name}"? All associated records will be removed.`,
      actionText: 'Delete',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      this.store.dispatch(ClientActions.deleteClient({ id: client.id }));
    });
  }

  viewClientInvoices(clientId: string): void {
    this.router.navigate(['/finance/invoice-management'], { queryParams: { clientId } });
  }

  getStatusColor(status: string): { bg: string; fg: string } {
    switch (status) {
      case 'Active':     return { bg: 'rgba(34,197,94,0.15)',   fg: '#16a34a' };
      case 'Pending':    return { bg: 'rgba(249,115,22,0.15)',  fg: '#ea580c' };
      case 'Terminated': return { bg: 'rgba(239,68,68,0.15)',   fg: '#dc2626' };
      case 'Suspended':  return { bg: 'rgba(113,113,122,0.15)', fg: '#71717a' };
      default:           return { bg: 'rgba(113,113,122,0.15)', fg: '#71717a' };
    }
  }
}
