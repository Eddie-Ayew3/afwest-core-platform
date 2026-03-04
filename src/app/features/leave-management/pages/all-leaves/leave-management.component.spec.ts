import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LeaveManagementComponent } from './leave-management.component';

describe('LeaveManagementComponent', () => {
  let component: LeaveManagementComponent;
  let fixture: ComponentFixture<LeaveManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page title', () => {
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title.nativeElement.textContent).toContain('Leave Management');
  });

  it('should render page subtitle', () => {
    const subtitle = fixture.debugElement.query(By.css('.text-muted-foreground'));
    expect(subtitle.nativeElement.textContent).toContain('Manage employee leave requests and approvals');
  });

  it('should render Request Leave button', () => {
    const requestButton = fixture.debugElement.query(By.css('tolle-button'));
    expect(requestButton.nativeElement.textContent).toContain('Request Leave');
  });

  it('should render statistics cards', () => {
    const statsCards = fixture.debugElement.queryAll(By.css('.bg-white.p-6.rounded-lg.border.border-border'));
    expect(statsCards.length).toBe(3);
  });

  it('should render pending requests card', () => {
    const pendingCard = fixture.debugElement.query(By.css('.bg-orange-100'));
    expect(pendingCard).toBeTruthy();
    expect(pendingCard.nativeElement.textContent).toContain('Pending');
  });

  it('should render approved requests card', () => {
    const approvedCard = fixture.debugElement.query(By.css('.bg-green-100'));
    expect(approvedCard).toBeTruthy();
    expect(approvedCard.nativeElement.textContent).toContain('Approved');
  });

  it('should render balance card', () => {
    const balanceCard = fixture.debugElement.query(By.css('.bg-purple-100'));
    expect(balanceCard).toBeTruthy();
    expect(balanceCard.nativeElement.textContent).toContain('Balance');
  });

  it('should render recent leave requests section', () => {
    const requestsSection = fixture.debugElement.query(By.css('.bg-white.rounded-lg.border.border-border'));
    expect(requestsSection).toBeTruthy();
    expect(requestsSection.query(By.css('h3')).nativeElement.textContent).toContain('Recent Leave Requests');
  });

  it('should render refresh button', () => {
    const refreshButton = fixture.debugElement.query(By.css('tolle-button[variant="outline"]'));
    expect(refreshButton.nativeElement.textContent).toContain('Refresh');
  });

  it('should render placeholder content', () => {
    const placeholder = fixture.debugElement.query(By.css('.text-center.py-12.text-muted-foreground'));
    expect(placeholder).toBeTruthy();
    expect(placeholder.nativeElement.textContent).toContain('No leave requests found');
  });
});
