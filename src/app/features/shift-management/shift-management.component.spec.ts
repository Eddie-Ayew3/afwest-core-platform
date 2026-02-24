import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ShiftManagementComponent } from './shift-management.component';

describe('ShiftManagementComponent', () => {
  let component: ShiftManagementComponent;
  let fixture: ComponentFixture<ShiftManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page title', () => {
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title.nativeElement.textContent).toContain('Shift Management');
  });

  it('should render page subtitle', () => {
    const subtitle = fixture.debugElement.query(By.css('.text-muted-foreground'));
    expect(subtitle.nativeElement.textContent).toContain('Manage staff shifts and schedules');
  });

  it('should render Create Shift button', () => {
    const createButton = fixture.debugElement.query(By.css('tolle-button'));
    expect(createButton.nativeElement.textContent).toContain('Create Shift');
  });

  it('should render statistics cards', () => {
    const statsCards = fixture.debugElement.queryAll(By.css('.bg-white.p-6.rounded-lg.border.border-border'));
    expect(statsCards.length).toBe(3);
  });

  it('should render active shifts card', () => {
    const activeCard = fixture.debugElement.query(By.css('.bg-green-100'));
    expect(activeCard).toBeTruthy();
    expect(activeCard.nativeElement.textContent).toContain('Active');
  });

  it('should render staff on duty card', () => {
    const staffCard = fixture.debugElement.query(By.css('.bg-blue-100'));
    expect(staffCard).toBeTruthy();
    expect(staffCard.nativeElement.textContent).toContain('Staff');
  });

  it('should render shifts today card', () => {
    const todayCard = fixture.debugElement.query(By.css('.bg-orange-100'));
    expect(todayCard).toBeTruthy();
    expect(todayCard.nativeElement.textContent).toContain('Today');
  });

  it('should render current shifts section', () => {
    const shiftsSection = fixture.debugElement.query(By.css('.bg-white.rounded-lg.border.border-border'));
    expect(shiftsSection).toBeTruthy();
    expect(shiftsSection.query(By.css('h3')).nativeElement.textContent).toContain('Current Shifts');
  });

  it('should render filter and today buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('tolle-button[variant="outline"]'));
    expect(buttons.length).toBe(2);
    expect(buttons[0].nativeElement.textContent).toContain('Filter');
    expect(buttons[1].nativeElement.textContent).toContain('Today');
  });

  it('should render placeholder content', () => {
    const placeholder = fixture.debugElement.query(By.css('.text-center.py-12.text-muted-foreground'));
    expect(placeholder).toBeTruthy();
    expect(placeholder.nativeElement.textContent).toContain('No shifts scheduled');
  });
});
