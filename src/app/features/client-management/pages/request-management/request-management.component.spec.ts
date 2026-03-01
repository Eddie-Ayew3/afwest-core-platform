import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RequestManagementComponent } from './request-management.component';

describe('RequestManagementComponent', () => {
  let component: RequestManagementComponent;
  let fixture: ComponentFixture<RequestManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have requests array defined', () => {
    expect(component.requests).toBeDefined();
    expect(component.requests.length).toBeGreaterThan(0);
  });

  it('should have filtered requests array defined', () => {
    expect(component.filteredRequests).toBeDefined();
  });

  it('should have displayed requests array defined', () => {
    expect(component.displayedRequests).toBeDefined();
  });

  it('should have search query property', () => {
    expect(component.searchQuery).toBeDefined();
    expect(typeof component.searchQuery).toBe('string');
  });

  it('should have filter properties', () => {
    expect(component.selectedStatus).toBeDefined();
    expect(component.selectedType).toBeDefined();
    expect(component.selectedUrgency).toBeDefined();
  });

  it('should have pagination properties', () => {
    expect(component.currentPage).toBeDefined();
    expect(component.pageSize).toBeDefined();
    expect(component.startIndex).toBeDefined();
    expect(component.endIndex).toBeDefined();
  });

  it('should render breadcrumb navigation', () => {
    const breadcrumb = fixture.debugElement.query(By.css('tolle-breadcrumb'));
    expect(breadcrumb).toBeTruthy();
  });

  it('should render header with title and description', () => {
    const header = fixture.debugElement.query(By.css('.header-section'));
    expect(header).toBeTruthy();
    
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title).toBeTruthy();
    expect(title.nativeElement.textContent).toContain('Request Management');
  });

  it('should render search input', () => {
    const searchInput = fixture.debugElement.query(By.css('tolle-input[placeholder*="Search requests"]'));
    expect(searchInput).toBeTruthy();
  });

  it('should render filter buttons', () => {
    const filterButtons = fixture.debugElement.queryAll(By.css('tolle-button'));
    expect(filterButtons.length).toBeGreaterThan(0);
  });

  it('should render new request button', () => {
    const newRequestBtn = fixture.debugElement.query(By.css('tolle-button[contains(., "New Request")]'));
    expect(newRequestBtn).toBeTruthy();
  });

  it('should render request table when there are requests', () => {
    const table = fixture.debugElement.query(By.css('table'));
    expect(table).toBeTruthy();
  });

  it('should render table headers', () => {
    const headers = fixture.debugElement.queryAll(By.css('thead th'));
    expect(headers.length).toBeGreaterThan(0);
    
    const requestIdHeader = fixture.debugElement.query(By.css('thead th:contains("Request ID")'));
    expect(requestIdHeader).toBeTruthy();
  });

  it('should render request rows', () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBeGreaterThan(0);
  });

  it('should render pagination component', () => {
    const pagination = fixture.debugElement.query(By.css('tolle-pagination'));
    expect(pagination).toBeTruthy();
  });

  it('should apply filters correctly', () => {
    const initialCount = component.filteredRequests.length;
    
    component.selectedStatus = 'pending';
    component.applyFilters();
    
    expect(component.filteredRequests.length).toBeLessThanOrEqual(initialCount);
  });

  it('should search requests correctly', () => {
    const initialCount = component.filteredRequests.length;
    
    component.searchQuery = 'John';
    component.onSearch();
    
    expect(component.filteredRequests.length).toBeLessThanOrEqual(initialCount);
  });

  it('should clear filters correctly', () => {
    component.selectedStatus = 'pending';
    component.selectedType = 'uniform';
    component.searchQuery = 'test';
    
    component.clearFilters();
    
    expect(component.selectedStatus).toBe('all');
    expect(component.selectedType).toBe('all');
    expect(component.selectedUrgency).toBe('all');
    expect(component.searchQuery).toBe('');
  });

  it('should toggle filter panel', () => {
    const initialState = component.showFilterPanel;
    
    component.toggleFilterPanel();
    expect(component.showFilterPanel).toBe(!initialState);
    
    component.toggleFilterPanel();
    expect(component.showFilterPanel).toBe(initialState);
  });

  it('should calculate pagination indices correctly', () => {
    component.currentPage = 1;
    component.pageSize = 10;
    
    expect(component.startIndex).toBe(0);
    expect(component.endIndex).toBeGreaterThanOrEqual(0);
  });

  it('should update displayed requests', () => {
    const initialDisplayedCount = component.displayedRequests.length;
    
    component.currentPage = 2;
    component.updateDisplayedRequests();
    
    expect(component.displayedRequests.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle page size change', () => {
    component.pageSize = 5;
    component.onPageSizeChange();
    
    expect(component.currentPage).toBe(1);
  });

  it('should handle page change', () => {
    const newPage = 2;
    component.onPageChange(newPage);
    
    expect(component.currentPage).toBe(newPage);
  });

  it('should get request type icon correctly', () => {
    expect(component.getRequestTypeIcon('uniform')).toBe('ri-t-shirt-line');
    expect(component.getRequestTypeIcon('petty-cash')).toBe('ri-money-dollar-circle-line');
    expect(component.getRequestTypeIcon('equipment')).toBe('ri-tools-line');
    expect(component.getRequestTypeIcon('transportation')).toBe('ri-car-line');
    expect(component.getRequestTypeIcon('other')).toBe('ri-file-line');
  });

  it('should get urgency color correctly', () => {
    expect(component.getUrgencyColor('low')).toBe('secondary');
    expect(component.getUrgencyColor('medium')).toBe('default');
    expect(component.getUrgencyColor('high')).toBe('secondary');
    expect(component.getUrgencyColor('urgent')).toBe('destructive');
  });

  it('should get status color correctly', () => {
    expect(component.getStatusColor('pending')).toBe('secondary');
    expect(component.getStatusColor('approved')).toBe('default');
    expect(component.getStatusColor('rejected')).toBe('destructive');
    expect(component.getStatusColor('completed')).toBe('default');
  });

  it('should approve request correctly', () => {
    const request = component.requests[0];
    const initialStatus = request.status;
    
    component.approveRequest(request);
    
    expect(request.status).toBe('approved');
  });

  it('should reject request correctly', () => {
    const request = component.requests[0];
    
    component.rejectRequest(request);
    
    expect(request.status).toBe('rejected');
  });

  it('should complete request correctly', () => {
    const request = component.requests[0];
    
    component.completeRequest(request);
    
    expect(request.status).toBe('completed');
    expect(request.completedDate).toBeDefined();
  });

  it('should update active filter count correctly', () => {
    component.selectedStatus = 'pending';
    component.selectedType = 'all';
    component.selectedUrgency = 'high';
    
    component.updateActiveFilterCount();
    
    expect(component.activeFilterCount).toBe(2);
  });

  it('should render empty state when no requests', () => {
    component.filteredRequests = [];
    fixture.detectChanges();
    
    const emptyState = fixture.debugElement.query(By.css('tolle-empty-state'));
    expect(emptyState).toBeTruthy();
  });

  it('should have correct request structure', () => {
    const request = component.requests[0];
    
    expect(request.id).toBeDefined();
    expect(request.guardName).toBeDefined();
    expect(request.guardId).toBeDefined();
    expect(request.requestType).toBeDefined();
    expect(request.title).toBeDefined();
    expect(request.description).toBeDefined();
    expect(request.urgency).toBeDefined();
    expect(request.status).toBeDefined();
    expect(request.requestedDate).toBeDefined();
  });

  it('should handle request details view', () => {
    const request = component.requests[0];
    spyOn(console, 'log');
    
    component.viewRequestDetails(request);
    
    expect(console.log).toHaveBeenCalledWith('View request details:', request);
  });

  it('should handle new request dialog', () => {
    spyOn(component, 'openNewRequestDialog');
    
    const newRequestBtn = fixture.debugElement.query(By.css('tolle-button[contains(., "New Request")]'));
    newRequestBtn.triggerEventHandler('click', null);
    
    expect(component.openNewRequestDialog).toHaveBeenCalled();
  });
});
