import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DashBoardComponent } from './dashboard.component';

describe('DashBoardComponent', () => {
  let component: DashBoardComponent;
  let fixture: ComponentFixture<DashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render stats cards', () => {
    const statsCards = fixture.debugElement.queryAll(By.css('.bg-white.p-6.rounded-lg.border.border-border'));
    expect(statsCards.length).toBe(4);
  });

  it('should render recent activity section', () => {
    const recentActivity = fixture.debugElement.query(By.css('.lg\\:col-span-2.bg-white.rounded-lg.border.border-border'));
    expect(recentActivity).toBeTruthy();
    expect(recentActivity.query(By.css('h3')).nativeElement.textContent).toContain('Recent Activity');
  });

  it('should render quick actions section', () => {
    const quickActions = fixture.debugElement.query(By.css('.space-y-4'));
    expect(quickActions).toBeTruthy();
    expect(quickActions.query(By.css('h3')).nativeElement.textContent).toContain('Quick Actions');
  });

  it('should render projects table', () => {
    const projectsTable = fixture.debugElement.query(By.css('.bg-white.rounded-lg.border.border-border'));
    expect(projectsTable).toBeTruthy();
    expect(projectsTable.query(By.css('h3')).nativeElement.textContent).toContain('Recent Projects');
  });

  it('should render placeholder content when no data', () => {
    const placeholder = fixture.debugElement.query(By.css('.text-center.py-12.text-muted-foreground'));
    expect(placeholder).toBeTruthy();
  });
});
