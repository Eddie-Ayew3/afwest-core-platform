import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffManagementComponent } from './staff-management.component';

describe('StaffManagementComponent', () => {
  let component: StaffManagementComponent;
  let fixture: ComponentFixture<StaffManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have staff data', () => {
    expect(component.staff.length).toBeGreaterThan(0);
  });
});
