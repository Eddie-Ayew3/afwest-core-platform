import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardManagementComponent } from './guard-management.component';

describe('GuardManagementComponent', () => {
  let component: GuardManagementComponent;
  let fixture: ComponentFixture<GuardManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuardManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuardManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have guards data', () => {
    expect(component.guards.length).toBeGreaterThan(0);
  });

  it('should identify pending-approval guards', () => {
    const pending = component.guards.filter(g => g.status === 'pending-approval');
    expect(pending.length).toBeGreaterThan(0);
  });
});
