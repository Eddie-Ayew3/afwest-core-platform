import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SupplierManagementComponent } from './supplier-management.component';

describe('SupplierManagementComponent', () => {
  let component: SupplierManagementComponent;
  let fixture: ComponentFixture<SupplierManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page title', () => {
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title.nativeElement.textContent).toContain('Supplier Management');
  });

  it('should render page subtitle', () => {
    const subtitle = fixture.debugElement.query(By.css('.text-muted-foreground'));
    expect(subtitle.nativeElement.textContent).toContain('Manage supplier relationships and contracts');
  });

  it('should render Add Supplier button', () => {
    const addButton = fixture.debugElement.query(By.css('tolle-button'));
    expect(addButton.nativeElement.textContent).toContain('Add Supplier');
  });

  it('should render statistics cards', () => {
    const statsCards = fixture.debugElement.queryAll(By.css('.bg-white.p-6.rounded-lg.border.border-border'));
    expect(statsCards.length).toBe(4);
  });

  it('should render active suppliers card', () => {
    const activeCard = fixture.debugElement.query(By.css('.bg-green-100'));
    expect(activeCard).toBeTruthy();
    expect(activeCard.nativeElement.textContent).toContain('Active');
  });

  it('should render contracts card', () => {
    const contractsCard = fixture.debugElement.query(By.css('.bg-blue-100'));
    expect(contractsCard).toBeTruthy();
    expect(contractsCard.nativeElement.textContent).toContain('Contracts');
  });

  it('should render pending orders card', () => {
    const pendingCard = fixture.debugElement.query(By.css('.bg-orange-100'));
    expect(pendingCard).toBeTruthy();
    expect(pendingCard.nativeElement.textContent).toContain('Pending');
  });

  it('should render premium suppliers card', () => {
    const premiumCard = fixture.debugElement.query(By.css('.bg-purple-100'));
    expect(premiumCard).toBeTruthy();
    expect(premiumCard.nativeElement.textContent).toContain('Premium');
  });

  it('should render supplier directory section', () => {
    const directory = fixture.debugElement.query(By.css('.bg-white.rounded-lg.border.border-border'));
    expect(directory).toBeTruthy();
    expect(directory.query(By.css('h3')).nativeElement.textContent).toContain('Supplier Directory');
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
    expect(placeholder.nativeElement.textContent).toContain('No suppliers found');
  });
});
