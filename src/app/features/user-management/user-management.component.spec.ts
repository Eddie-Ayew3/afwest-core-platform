import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UserManagementComponent } from './user-management.component';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page title', () => {
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title.nativeElement.textContent).toContain('User Management');
  });

  it('should render page subtitle', () => {
    const subtitle = fixture.debugElement.query(By.css('.text-muted-foreground'));
    expect(subtitle.nativeElement.textContent).toContain('Manage system users and permissions');
  });

  it('should render Add User button', () => {
    const addButton = fixture.debugElement.query(By.css('tolle-button'));
    expect(addButton.nativeElement.textContent).toContain('Add User');
  });

  it('should render statistics cards', () => {
    const statsCards = fixture.debugElement.queryAll(By.css('.bg-white.p-6.rounded-lg.border.border-border'));
    expect(statsCards.length).toBe(4);
  });

  it('should render active users card', () => {
    const activeCard = fixture.debugElement.query(By.css('.bg-blue-100'));
    expect(activeCard).toBeTruthy();
    expect(activeCard.nativeElement.textContent).toContain('Active');
  });

  it('should render inactive users card', () => {
    const inactiveCard = fixture.debugElement.query(By.css('.bg-orange-100'));
    expect(inactiveCard).toBeTruthy();
    expect(inactiveCard.nativeElement.textContent).toContain('Inactive');
  });

  it('should render admin users card', () => {
    const adminCard = fixture.debugElement.query(By.css('.bg-purple-100'));
    expect(adminCard).toBeTruthy();
    expect(adminCard.nativeElement.textContent).toContain('Admins');
  });

  it('should render staff users card', () => {
    const staffCard = fixture.debugElement.query(By.css('.bg-green-100'));
    expect(staffCard).toBeTruthy();
    expect(staffCard.nativeElement.textContent).toContain('Staff');
  });

  it('should render user directory section', () => {
    const directory = fixture.debugElement.query(By.css('.bg-white.rounded-lg.border.border-border'));
    expect(directory).toBeTruthy();
    expect(directory.query(By.css('h3')).nativeElement.textContent).toContain('User Directory');
  });

  it('should render filter and search buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('tolle-button[variant="outline"]'));
    expect(buttons.length).toBe(2);
    expect(buttons[0].nativeElement.textContent).toContain('Filter');
    expect(buttons[1].nativeElement.textContent).toContain('Search');
  });

  it('should render placeholder content', () => {
    const placeholder = fixture.debugElement.query(By.css('.text-center.py-12.text-muted-foreground'));
    expect(placeholder).toBeTruthy();
    expect(placeholder.nativeElement.textContent).toContain('No user accounts found');
  });
});
