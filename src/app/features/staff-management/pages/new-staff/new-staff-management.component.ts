import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ButtonComponent,
  InputComponent,
  SelectComponent,
  SelectItemComponent,
  LabelComponent,
  ProgressComponent,
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardContentComponent,
  CardFooterComponent,
  TextareaComponent,
  DatePickerComponent,
  AlertComponent,
  AlertDialogService
} from '@tolle_/tolle-ui';

@Component({
  selector: 'app-new-staff-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    SelectItemComponent,
    LabelComponent,
    ProgressComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    CardFooterComponent,
    TextareaComponent,
    DatePickerComponent,
    AlertComponent
  ],
  templateUrl: './new-staff-management.component.html',
  styleUrls: ['./new-staff-management.component.css']
})
export class NewStaffManagementComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private alertDialog = inject(AlertDialogService);

  currentStep = 0;
  readonly totalSteps = 4;
  isSubmitting = false;
  showSuccessAlert = false;

  readonly stepTitles = ['Personal Info', 'Contact', 'Employment', 'Review'];

  readonly departments = [
    'HR', 'Finance', 'IT', 'Operations', 'Admin',
    'Procurement', 'Logistics', 'Security Management'
  ];

  readonly jobTitles = [
    'Operations Manager', 'Branch Manager', 'Zone Coordinator',
    'HR Manager', 'HR Assistant', 'Finance Manager', 'Finance Analyst',
    'IT Consultant', 'Admin Specialist', 'Admin Coordinator',
    'Logistics Officer', 'Procurement Officer', 'Control Coordinator',
    'Site Supervisor'
  ];

  readonly sites = [
    'Head Office – Accra', 'Kumasi Branch', 'Takoradi Branch',
    'Tema Industrial', 'Cape Coast Post'
  ];

  // DatePicker objects (ngModel-based — synced into the reactive form)
  dobObj: Date | null = null;
  startDateObj: Date | null = null;

  // Profile photo
  profilePhotoPreview: string | null = null;

  staffForm!: FormGroup;

  constructor() {
    this.initForm();
  }

  private initForm(): void {
    this.staffForm = this.fb.group({
      // Personal
      fullName:      ['', Validators.required],
      staffId:       [{ value: '', disabled: true }],
      dateOfBirth:   [null],
      gender:        [''],
      nationalId:    [''],
      // Contact
      email:              ['', [Validators.required, Validators.email]],
      phone:              ['', Validators.required],
      alternativePhone:   [''],
      residentialAddress: ['', Validators.required],
      city:               [''],
      region:             [''],
      // Employment
      department:       ['', Validators.required],
      jobTitle:         ['', Validators.required],
      site:             ['', Validators.required],
      employmentType:   ['Full-time'],
      startDate:        [null, Validators.required],
      reportingManager: [''],
      // Misc
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.generateStaffId();
  }

  private generateStaffId(): void {
    const num = String(Math.floor(Math.random() * 900) + 100);
    this.staffForm.patchValue({ staffId: `ST-${num}` });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.profilePhotoPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  onDobChange(date: Date | null): void {
    this.staffForm.patchValue({ dateOfBirth: date });
  }

  onStartDateChange(date: Date | null): void {
    this.staffForm.patchValue({ startDate: date });
    this.staffForm.get('startDate')?.markAsTouched();
  }

  private getStepRequiredFields(step: number): string[] {
    const map: Record<number, string[]> = {
      0: ['fullName'],
      1: ['email', 'phone', 'residentialAddress'],
      2: ['department', 'jobTitle', 'site', 'startDate'],
      3: []
    };
    return map[step] ?? [];
  }

  private isStepValid(step: number): boolean {
    return this.getStepRequiredFields(step).every(field => {
      const ctrl = this.staffForm.get(field);
      return ctrl ? ctrl.valid : true;
    });
  }

  nextStep(): void {
    if (this.currentStep >= this.totalSteps - 1) return;
    this.getStepRequiredFields(this.currentStep)
      .forEach(field => this.staffForm.get(field)?.markAsTouched());
    if (this.isStepValid(this.currentStep)) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 0) this.currentStep--;
  }

  goToStep(index: number): void {
    if (index < this.currentStep) this.currentStep = index;
  }

  get progressValue(): number {
    return ((this.currentStep + 1) / this.totalSteps) * 100;
  }

  get formValues() {
    return this.staffForm.getRawValue();
  }

  onSubmit(): void {
    Object.values(this.staffForm.controls).forEach(c => c.markAsTouched());
    if (this.staffForm.invalid) return;

    const dialogRef = this.alertDialog.open({
      title: 'Add Staff Member?',
      description: `Confirm adding ${this.formValues.fullName} (${this.formValues.staffId}) as a new staff member at ${this.formValues.site}.`,
      actionText: 'Yes, Add Staff',
      variant: 'default'
    });

    dialogRef.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      this.isSubmitting = true;
      setTimeout(() => {
        console.log('New staff submitted:', this.staffForm.getRawValue());
        this.isSubmitting = false;
        this.showSuccessAlert = true;
        setTimeout(() => this.router.navigate(['/hr/staff-management']), 2500);
      }, 1500);
    });
  }

  onCancel(): void {
    this.router.navigate(['/hr/staff-management']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.staffForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.staffForm.get(fieldName);
    if (!field?.errors) return '';
    if (field.errors['required']) return 'This field is required';
    if (field.errors['email']) return 'Please enter a valid email address';
    return 'Invalid value';
  }
}
