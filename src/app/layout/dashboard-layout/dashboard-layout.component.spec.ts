import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { DashboardLayoutComponent } from './dashboard-layout.component';

describe('DashboardLayoutComponent', () => {
  let component: DashboardLayoutComponent;
  let fixture: ComponentFixture<DashboardLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardLayoutComponent, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render sidebar', () => {
    const sidebar = fixture.debugElement.query(By.css('tolle-sidebar'));
    expect(sidebar).toBeTruthy();
  });

  it('should render main content area', () => {
    const main = fixture.debugElement.query(By.css('main'));
    expect(main).toBeTruthy();
  });

  it('should render breadcrumb navigation', () => {
    const breadcrumb = fixture.debugElement.query(By.css('tolle-breadcrumb'));
    expect(breadcrumb).toBeTruthy();
  });

  it('should render dashboard header', () => {
    const header = fixture.debugElement.query(By.css('h1'));
    expect(header.nativeElement.textContent).toContain('Dashboard');
  });

  it('should render router outlet', () => {
    const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutlet).toBeTruthy();
  });

  it('should render notification buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('tolle-button[variant="ghost"]'));
    expect(buttons.length).toBe(3);
  });

  it('should have sidebar items defined', () => {
    expect(component.sidebarItems).toBeDefined();
    expect(component.sidebarItems.length).toBeGreaterThan(0);
  });

  it('should have breadcrumb items defined', () => {
    expect(component.breadcrumbItems).toBeDefined();
    expect(component.breadcrumbItems.length).toBeGreaterThan(0);
  });

  it('should have page title and subtitle', () => {
    expect(component.pageTitle).toBeDefined();
    expect(component.pageSubtitle).toBeDefined();
  });

  it('should render brand name', () => {
    const brand = fixture.debugElement.query(By.css('.font-bold span'));
    expect(brand.nativeElement.textContent).toContain('Antigravity');
  });

  it('should render user info', () => {
    const userInfo = fixture.debugElement.query(By.css('.text-sm.font-medium'));
    expect(userInfo.nativeElement.textContent).toContain('John Doe');
  });
});
