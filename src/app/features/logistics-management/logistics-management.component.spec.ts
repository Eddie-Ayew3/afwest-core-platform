import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LogisticsManagementComponent } from './logistics-management.component';

describe('LogisticsManagementComponent', () => {
  let component: LogisticsManagementComponent;
  let fixture: ComponentFixture<LogisticsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogisticsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogisticsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page title', () => {
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title.nativeElement.textContent).toContain('Logistics Management');
  });

  it('should render page subtitle', () => {
    const subtitle = fixture.debugElement.query(By.css('.text-muted-foreground'));
    expect(subtitle.nativeElement.textContent).toContain('Manage logistics, shipping, and delivery operations');
  });

  it('should render New Shipment button', () => {
    const addButton = fixture.debugElement.query(By.css('tolle-button'));
    expect(addButton.nativeElement.textContent).toContain('New Shipment');
  });

  it('should render statistics cards', () => {
    const statsCards = fixture.debugElement.queryAll(By.css('.bg-white.p-6.rounded-lg.border.border-border'));
    expect(statsCards.length).toBe(4);
  });

  it('should render in transit card', () => {
    const transitCard = fixture.debugElement.query(By.css('.bg-blue-100'));
    expect(transitCard).toBeTruthy();
    expect(transitCard.nativeElement.textContent).toContain('In Transit');
  });

  it('should render delivered card', () => {
    const deliveredCard = fixture.debugElement.query(By.css('.bg-green-100'));
    expect(deliveredCard).toBeTruthy();
    expect(deliveredCard.nativeElement.textContent).toContain('Delivered');
  });

  it('should render pending dispatch card', () => {
    const pendingCard = fixture.debugElement.query(By.css('.bg-orange-100'));
    expect(pendingCard).toBeTruthy();
    expect(pendingCard.nativeElement.textContent).toContain('Pending');
  });

  it('should render delayed shipments card', () => {
    const delayedCard = fixture.debugElement.query(By.css('.bg-red-100'));
    expect(delayedCard).toBeTruthy();
    expect(delayedCard.nativeElement.textContent).toContain('Delayed');
  });

  it('should render shipments tracking section', () => {
    const trackingSection = fixture.debugElement.query(By.css('.bg-white.rounded-lg.border.border-border'));
    expect(trackingSection).toBeTruthy();
    expect(trackingSection.query(By.css('h3')).nativeElement.textContent).toContain('Shipments Tracking');
  });

  it('should render filter and map view buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('tolle-button[variant="outline"]'));
    expect(buttons.length).toBe(2);
    expect(buttons[0].nativeElement.textContent).toContain('Filter');
    expect(buttons[1].nativeElement.textContent).toContain('Map View');
  });

  it('should render placeholder content', () => {
    const placeholder = fixture.debugElement.query(By.css('.text-center.py-12.text-muted-foreground'));
    expect(placeholder).toBeTruthy();
    expect(placeholder.nativeElement.textContent).toContain('No shipments found');
  });
});
