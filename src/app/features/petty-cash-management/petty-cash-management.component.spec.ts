import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PettyCashManagementComponent } from './petty-cash-management.component';

describe('PettyCashManagementComponent', () => {
  let component: PettyCashManagementComponent;
  let fixture: ComponentFixture<PettyCashManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PettyCashManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PettyCashManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page title', () => {
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title.nativeElement.textContent).toContain('Petty Cash Management');
  });

  it('should render page subtitle', () => {
    const subtitle = fixture.debugElement.query(By.css('.text-muted-foreground'));
    expect(subtitle.nativeElement.textContent).toContain('Manage petty cash expenses and reimbursements');
  });

  it('should render New Expense button', () => {
    const addButton = fixture.debugElement.query(By.css('tolle-button'));
    expect(addButton.nativeElement.textContent).toContain('New Expense');
  });

  it('should render statistics cards', () => {
    const statsCards = fixture.debugElement.queryAll(By.css('.bg-white.p-6.rounded-lg.border.border-border'));
    expect(statsCards.length).toBe(4);
  });

  it('should render balance card', () => {
    const balanceCard = fixture.debugElement.query(By.css('.bg-green-100'));
    expect(balanceCard).toBeTruthy();
    expect(balanceCard.nativeElement.textContent).toContain('Balance');
  });

  it('should render expenses card', () => {
    const expensesCard = fixture.debugElement.query(By.css('.bg-blue-100'));
    expect(expensesCard).toBeTruthy();
    expect(expensesCard.nativeElement.textContent).toContain('Expenses');
  });

  it('should render replenished card', () => {
    const replenishedCard = fixture.debugElement.query(By.css('.bg-purple-100'));
    expect(replenishedCard).toBeTruthy();
    expect(replenishedCard.nativeElement.textContent).toContain('Replenished');
  });

  it('should render pending claims card', () => {
    const pendingCard = fixture.debugElement.query(By.css('.bg-orange-100'));
    expect(pendingCard).toBeTruthy();
    expect(pendingCard.nativeElement.textContent).toContain('Pending');
  });

  it('should render recent transactions section', () => {
    const transactionsSection = fixture.debugElement.query(By.css('.bg-white.rounded-lg.border.border-border'));
    expect(transactionsSection).toBeTruthy();
    expect(transactionsSection.query(By.css('h3')).nativeElement.textContent).toContain('Recent Transactions');
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
    expect(placeholder.nativeElement.textContent).toContain('No transactions found');
  });
});
