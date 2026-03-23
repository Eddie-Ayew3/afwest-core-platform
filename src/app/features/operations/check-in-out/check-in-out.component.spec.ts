import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CheckInOutComponent } from './check-in-out.component';

describe('CheckInOutComponent', () => {
  let component: CheckInOutComponent;
  let fixture: ComponentFixture<CheckInOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckInOutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckInOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page title', () => {
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title.nativeElement.textContent).toContain('Check In/Check Out');
  });

  it('should render page subtitle', () => {
    const subtitle = fixture.debugElement.query(By.css('.text-muted-foreground'));
    expect(subtitle.nativeElement.textContent).toContain('Manage staff attendance and time tracking');
  });

  it('should render Check In and Check Out buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('tolle-button'));
    expect(buttons.length).toBe(2);
    expect(buttons[0].nativeElement.textContent).toContain('Check In');
    expect(buttons[1].nativeElement.textContent).toContain('Check Out');
  });

  it('should render statistics cards', () => {
    const statsCards = fixture.debugElement.queryAll(By.css('.bg-white.p-6.rounded-lg.border.border-border'));
    expect(statsCards.length).toBe(4);
  });

  it('should render checked in card', () => {
    const checkedInCard = fixture.debugElement.query(By.css('.bg-green-100'));
    expect(checkedInCard).toBeTruthy();
    expect(checkedInCard.nativeElement.textContent).toContain('Checked In');
  });

  it('should render checked out card', () => {
    const checkedOutCard = fixture.debugElement.query(By.css('.bg-red-100'));
    expect(checkedOutCard).toBeTruthy();
    expect(checkedOutCard.nativeElement.textContent).toContain('Checked Out');
  });

  it('should render late arrivals card', () => {
    const lateCard = fixture.debugElement.query(By.css('.bg-orange-100'));
    expect(lateCard).toBeTruthy();
    expect(lateCard.nativeElement.textContent).toContain('Late');
  });

  it('should render absent card', () => {
    const absentCard = fixture.debugElement.query(By.css('.bg-blue-100'));
    expect(absentCard).toBeTruthy();
    expect(absentCard.nativeElement.textContent).toContain('Absent');
  });

  it('should render today\'s attendance section', () => {
    const attendanceSection = fixture.debugElement.query(By.css('.bg-white.rounded-lg.border.border-border'));
    expect(attendanceSection).toBeTruthy();
    expect(attendanceSection.query(By.css('h3')).nativeElement.textContent).toContain('Today\'s Attendance');
  });

  it('should render filter and export buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('tolle-button[variant="outline"]'));
    expect(buttons.length).toBe(2);
    expect(buttons[0].nativeElement.textContent).toContain('Filter');
    expect(buttons[1].nativeElement.textContent).toContain('Export');
  });

  it('should render placeholder content', () => {
    const placeholder = fixture.debugElement.query(By.css('.text-center.py-12.text-muted-foreground'));
    expect(placeholder).toBeTruthy();
    expect(placeholder.nativeElement.textContent).toContain('No attendance records for today');
  });
});
