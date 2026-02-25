import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { StaffManagementComponent } from './staff-management.component';

describe('StaffManagementComponent', () => {
  let component: StaffManagementComponent;
  let fixture: ComponentFixture<StaffManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page title', () => {
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title.nativeElement.textContent).toContain('Staff/Guard Management');
  });

  it('should render page subtitle', () => {
    const subtitle = fixture.debugElement.query(By.css('.text-muted-foreground'));
    expect(subtitle.nativeElement.textContent).toContain('Manage staff and guard personnel');
  });

  it('should render Add Staff button', () => {
    const addButton = fixture.debugElement.query(By.css('tolle-button'));
    expect(addButton.nativeElement.textContent).toContain('Add Staff');
  });

  it('should render tabs for Staff and Guards', () => {
    const tabTriggers = fixture.debugElement.queryAll(By.css('tolle-tabs-trigger'));
    expect(tabTriggers.length).toBe(2);
    expect(tabTriggers[0].nativeElement.textContent).toContain('Staff');
    expect(tabTriggers[1].nativeElement.textContent).toContain('Guards');
  });

  it('should render search input', () => {
    const searchInput = fixture.debugElement.query(By.css('tolle-input'));
    expect(searchInput).toBeTruthy();
    expect(searchInput.nativeElement.getAttribute('placeholder')).toContain('Search');
  });

  it('should have filter and export buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('tolle-button[variant="outline"]'));
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    // Find buttons by text content
    const buttonTexts = buttons.map(b => b.nativeElement.textContent);
    expect(buttonTexts.some(t => t.includes('Filter'))).toBeTrue();
    expect(buttonTexts.some(t => t.includes('Export'))).toBeTrue();
  });

  it('should render staff table headers', () => {
    const headers = fixture.debugElement.queryAll(By.css('th'));
    const headerTexts = headers.map(h => h.nativeElement.textContent.trim());
    expect(headerTexts).toContain('Staff Name');
    expect(headerTexts).toContain('Role');
    expect(headerTexts).toContain('Status');
    expect(headerTexts).toContain('Contact');
  });

  it('should display staff data', () => {
    expect(component.staff.length).toBeGreaterThan(0);
    expect(component.displayedStaff.length).toBeGreaterThan(0);
  });

  it('should display guards data', () => {
    expect(component.guards.length).toBeGreaterThan(0);
    expect(component.displayedGuards.length).toBeGreaterThan(0);
  });

  it('should filter staff on search', () => {
    component.searchQuery = 'John';
    component.onSearch();
    expect(component.filteredStaff.length).toBeGreaterThan(0);
  });

  it('should filter guards on search', () => {
    component.searchQuery = 'Security';
    component.onSearch();
    expect(component.filteredGuards.length).toBeGreaterThan(0);
  });

  it('should have pagination controls', () => {
    const pagination = fixture.debugElement.query(By.css('tolle-pagination'));
    expect(pagination).toBeTruthy();
  });
});