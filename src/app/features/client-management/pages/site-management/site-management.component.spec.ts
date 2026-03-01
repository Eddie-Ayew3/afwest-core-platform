import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SiteManagementComponent } from './site-management.component';

describe('SiteManagementComponent', () => {
  let component: SiteManagementComponent;
  let fixture: ComponentFixture<SiteManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiteManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have sites array defined', () => {
    expect(component.sites).toBeDefined();
    expect(component.sites.length).toBeGreaterThan(0);
  });

  it('should have regions array defined', () => {
    expect(component.regions).toBeDefined();
    expect(component.regions.length).toBeGreaterThan(0);
  });

  it('should have filtered sites array defined', () => {
    expect(component.filteredSites).toBeDefined();
  });

  it('should have displayed sites array defined', () => {
    expect(component.displayedSites).toBeDefined();
  });

  it('should have user role property', () => {
    expect(component.currentUserRole).toBeDefined();
    expect(['head-office', 'zonal-commander']).toContain(component.currentUserRole);
  });

  it('should have search query property', () => {
    expect(component.searchQuery).toBeDefined();
    expect(typeof component.searchQuery).toBe('string');
  });

  it('should have filter properties', () => {
    expect(component.selectedRegion).toBeDefined();
    expect(component.selectedStatus).toBeDefined();
    expect(component.selectedType).toBeDefined();
    expect(component.selectedSecurityLevel).toBeDefined();
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
    expect(title.nativeElement.textContent).toContain('Site Management');
  });

  it('should render user role indicator', () => {
    const roleIndicator = fixture.debugElement.query(By.css('.user-role-indicator'));
    expect(roleIndicator).toBeTruthy();
  });

  it('should render region summary cards for head office view', () => {
    component.currentUserRole = 'head-office';
    fixture.detectChanges();
    
    const regionCards = fixture.debugElement.queryAll(By.css('.region-card'));
    expect(regionCards.length).toBeGreaterThan(0);
  });

  it('should hide region cards for zonal commander view', () => {
    component.currentUserRole = 'zonal-commander';
    fixture.detectChanges();
    
    const regionCards = fixture.debugElement.query(By.css('.region-cards'));
    expect(regionCards).toBeFalsy();
  });

  it('should render search input', () => {
    const searchInput = fixture.debugElement.query(By.css('tolle-input[placeholder*="Search sites"]'));
    expect(searchInput).toBeTruthy();
  });

  it('should render filter buttons', () => {
    const filterButtons = fixture.debugElement.queryAll(By.css('tolle-button'));
    expect(filterButtons.length).toBeGreaterThan(0);
  });

  it('should render new site button', () => {
    const newSiteBtn = fixture.debugElement.query(By.css('tolle-button[contains(., "New Site")]'));
    expect(newSiteBtn).toBeTruthy();
  });

  it('should render site table when there are sites', () => {
    const table = fixture.debugElement.query(By.css('table'));
    expect(table).toBeTruthy();
  });

  it('should render table headers', () => {
    const headers = fixture.debugElement.queryAll(By.css('thead th'));
    expect(headers.length).toBeGreaterThan(0);
    
    const siteInfoHeader = fixture.debugElement.query(By.css('thead th:contains("Site Info")'));
    expect(siteInfoHeader).toBeTruthy();
  });

  it('should render site rows', () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBeGreaterThan(0);
  });

  it('should render pagination component', () => {
    const pagination = fixture.debugElement.query(By.css('tolle-pagination'));
    expect(pagination).toBeTruthy();
  });

  it('should apply filters correctly', () => {
    const initialCount = component.filteredSites.length;
    
    component.selectedRegion = 'Ashanti';
    component.applyFilters();
    
    expect(component.filteredSites.length).toBeLessThanOrEqual(initialCount);
  });

  it('should search sites correctly', () => {
    const initialCount = component.filteredSites.length;
    
    component.searchQuery = 'Ecobank';
    component.onSearch();
    
    expect(component.filteredSites.length).toBeLessThanOrEqual(initialCount);
  });

  it('should clear filters correctly', () => {
    component.selectedRegion = 'Ashanti';
    component.selectedStatus = 'active';
    component.selectedType = 'branch';
    component.searchQuery = 'test';
    
    component.clearFilters();
    
    expect(component.selectedRegion).toBe('all');
    expect(component.selectedStatus).toBe('all');
    expect(component.selectedType).toBe('all');
    expect(component.selectedSecurityLevel).toBe('all');
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

  it('should update displayed sites', () => {
    const initialDisplayedCount = component.displayedSites.length;
    
    component.currentPage = 2;
    component.updateDisplayedSites();
    
    expect(component.displayedSites.length).toBeGreaterThanOrEqual(0);
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

  it('should get site type icon correctly', () => {
    expect(component.getSiteTypeIcon('headquarters')).toBe('ri-building-line');
    expect(component.getSiteTypeIcon('branch')).toBe('ri-bank-line');
    expect(component.getSiteTypeIcon('sub-branch')).toBe('ri-store-line');
    expect(component.getSiteTypeIcon('atm')).toBe('ri-bank-card-line');
    expect(component.getSiteTypeIcon('agency')).toBe('ri-briefcase-line');
  });

  it('should get security level color correctly', () => {
    expect(component.getSecurityLevelColor('low')).toBe('secondary');
    expect(component.getSecurityLevelColor('medium')).toBe('default');
    expect(component.getSecurityLevelColor('high')).toBe('secondary');
    expect(component.getSecurityLevelColor('critical')).toBe('destructive');
  });

  it('should get status color correctly', () => {
    expect(component.getStatusColor('active')).toBe('default');
    expect(component.getStatusColor('inactive')).toBe('secondary');
    expect(component.getStatusColor('maintenance')).toBe('secondary');
    expect(component.getStatusColor('under-construction')).toBe('destructive');
  });

  it('should get region by id correctly', () => {
    const region = component.getRegionById('ASH');
    expect(region).toBeDefined();
    expect(region?.name).toBe('Ashanti Region');
  });

  it('should filter sites by user role', () => {
    component.currentUserRole = 'zonal-commander';
    component.currentUserRegion = 'Ashanti';
    component.applyFilters();
    
    const filteredSites = component.filteredSites;
    expect(filteredSites.every(site => site.region === 'Ashanti')).toBe(true);
  });

  it('should switch user role correctly', () => {
    const initialRole = component.currentUserRole;
    
    component.switchUserRole();
    expect(component.currentUserRole).not.toBe(initialRole);
    
    component.switchUserRole();
    expect(component.currentUserRole).toBe(initialRole);
  });

  it('should update active filter count correctly', () => {
    component.selectedRegion = 'Ashanti';
    component.selectedStatus = 'active';
    component.selectedType = 'branch';
    component.selectedSecurityLevel = 'high';
    
    component.updateActiveFilterCount();
    
    expect(component.activeFilterCount).toBe(4);
  });

  it('should render empty state when no sites', () => {
    component.filteredSites = [];
    fixture.detectChanges();
    
    const emptyState = fixture.debugElement.query(By.css('tolle-empty-state'));
    expect(emptyState).toBeTruthy();
  });

  it('should have correct site structure', () => {
    const site = component.sites[0];
    
    expect(site.id).toBeDefined();
    expect(site.name).toBeDefined();
    expect(site.code).toBeDefined();
    expect(site.type).toBeDefined();
    expect(site.region).toBeDefined();
    expect(site.city).toBeDefined();
    expect(site.address).toBeDefined();
    expect(site.contact).toBeDefined();
    expect(site.status).toBeDefined();
    expect(site.staffCount).toBeDefined();
    expect(site.guardCount).toBeDefined();
    expect(site.securityLevel).toBeDefined();
  });

  it('should have correct region structure', () => {
    const region = component.regions[0];
    
    expect(region.id).toBeDefined();
    expect(region.name).toBeDefined();
    expect(region.code).toBeDefined();
    expect(region.capital).toBeDefined();
    expect(region.siteCount).toBeDefined();
    expect(region.activeGuards).toBeDefined();
    expect(region.zonalCommander).toBeDefined();
  });

  it('should handle site details view', () => {
    const site = component.sites[0];
    spyOn(console, 'log');
    
    component.viewSiteDetails(site);
    
    expect(console.log).toHaveBeenCalledWith('View site details:', site);
  });

  it('should handle site edit', () => {
    const site = component.sites[0];
    spyOn(console, 'log');
    
    component.editSite(site);
    
    expect(console.log).toHaveBeenCalledWith('Edit site:', site);
  });

  it('should handle site map view', () => {
    const site = component.sites[0];
    spyOn(console, 'log');
    
    component.viewSiteOnMap(site);
    
    if (site.coordinates) {
      expect(console.log).toHaveBeenCalledWith('View on map:', site.coordinates);
    }
  });

  it('should handle new site dialog', () => {
    spyOn(component, 'openNewSiteDialog');
    
    const newSiteBtn = fixture.debugElement.query(By.css('tolle-button[contains(., "New Site")]'));
    newSiteBtn.triggerEventHandler('click', null);
    
    expect(component.openNewSiteDialog).toHaveBeenCalled();
  });

  it('should have sites with different types', () => {
    const types = component.sites.map(site => site.type);
    expect(types).toContain('headquarters');
    expect(types).toContain('branch');
    expect(types).toContain('sub-branch');
  });

  it('should have sites across different regions', () => {
    const regions = component.sites.map(site => site.region);
    expect(regions).toContain('Greater Accra');
    expect(regions).toContain('Ashanti');
    expect(regions).toContain('Central');
  });

  it('should have sites with different security levels', () => {
    const securityLevels = component.sites.map(site => site.securityLevel);
    expect(securityLevels).toContain('critical');
    expect(securityLevels).toContain('high');
    expect(securityLevels).toContain('medium');
  });

  it('should have sites with different statuses', () => {
    const statuses = component.sites.map(site => site.status);
    expect(statuses).toContain('active');
  });

  it('should render site type badges', () => {
    const typeBadges = fixture.debugElement.queryAll(By.css('.site-type-badge'));
    expect(typeBadges.length).toBeGreaterThan(0);
  });

  it('should render staff information', () => {
    const staffInfo = fixture.debugElement.queryAll(By.css('.staff-info'));
    expect(staffInfo.length).toBeGreaterThan(0);
  });

  it('should render security badges', () => {
    const securityBadges = fixture.debugElement.queryAll(By.css('.security-badge'));
    expect(securityBadges.length).toBeGreaterThan(0);
  });
});
