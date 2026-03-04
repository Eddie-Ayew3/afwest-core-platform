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
  DatePickerComponent
} from '@tolle_/tolle-ui';

@Component({
  selector: 'app-new-client-management',
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
    DatePickerComponent
  ],
  templateUrl: './new-client-management.component.html',
  styleUrls: ['./new-client-management.component.css']
})
export class NewClientManagementComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);

  currentStep = 0;
  readonly totalSteps = 6;
  isSubmitting = false;

  readonly stepTitles = ['Basic Info', 'Contact', 'Address', 'Business', 'Contract', 'Review'];
  readonly stepIcons = [
    'ri-building-line',
    'ri-user-line',
    'ri-map-pin-line',
    'ri-briefcase-line',
    'ri-file-text-line',
    'ri-check-double-line'
  ];

  clientForm!: FormGroup;

  // DatePicker uses ngModel with Date objects — kept separate and synced to the form
  contractStartDateObj: Date | null = null;
  contractEndDateObj: Date | null = null;

  onStartDateChange(date: Date | null): void {
    this.clientForm.patchValue({ contractStartDate: date });
    this.clientForm.get('contractStartDate')?.markAsTouched();
  }

  onEndDateChange(date: Date | null): void {
    this.clientForm.patchValue({ contractEndDate: date });
    this.clientForm.get('contractEndDate')?.markAsTouched();
  }

  constructor() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.clientForm = this.fb.group({
      // Basic Information
      clientName: ['', Validators.required],
      clientId: [{ value: '', disabled: true }],

      // Contact Information
      contactPerson: ['', Validators.required],
      jobTitle: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      phoneExtension: [''],
      alternativePhone: [''],

      // Address Information
      physicalAddress: ['', Validators.required],
      city: ['', Validators.required],
      region: ['', Validators.required],
      postalCode: [''],
      gpsAddress: [''],

      // Business Information
      businessType: [''],
      industrySector: [''],
      tinNumber: [''],
      registrationNumber: [''],

      // Contract Information
      contractStartDate: [null, Validators.required],
      contractEndDate: [null, Validators.required],
      serviceType: [''],
      billingCycle: [''],

      // Additional Notes
      additionalNotes: ['']
    });
  }

  ngOnInit(): void {
    this.generateClientId();
  }

  private generateClientId(): void {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.clientForm.patchValue({ clientId: `CLI-${timestamp}${random}` });
  }

  private getStepRequiredFields(step: number): string[] {
    const map: Record<number, string[]> = {
      0: ['clientName'],
      1: ['contactPerson', 'email', 'phone'],
      2: ['physicalAddress', 'city', 'region'],
      3: [],
      4: ['contractStartDate', 'contractEndDate'],
      5: []
    };
    return map[step] ?? [];
  }

  private isStepValid(step: number): boolean {
    return this.getStepRequiredFields(step).every(field => {
      const control = this.clientForm.get(field);
      return control ? control.valid : true;
    });
  }

  nextStep(): void {
    if (this.currentStep >= this.totalSteps - 1) return;
    this.getStepRequiredFields(this.currentStep)
      .forEach(field => this.clientForm.get(field)?.markAsTouched());
    if (this.isStepValid(this.currentStep)) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 0) this.currentStep--;
  }

  goToStep(index: number): void {
    // Only allow going back to completed steps
    if (index < this.currentStep) this.currentStep = index;
  }

  get progressValue(): number {
    return ((this.currentStep + 1) / this.totalSteps) * 100;
  }

  get formValues() {
    return this.clientForm.getRawValue();
  }

  onSubmit(): void {
    Object.values(this.clientForm.controls).forEach(c => c.markAsTouched());
    if (this.clientForm.invalid) return;

    this.isSubmitting = true;
    setTimeout(() => {
      console.log('New client:', this.clientForm.getRawValue());
      this.isSubmitting = false;
      this.router.navigate(['/client-management']);
    }, 2000);
  }

  onCancel(): void {
    this.router.navigate(['/client-management']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.clientForm.get(fieldName);
    if (!field?.errors) return '';
    if (field.errors['required']) return 'This field is required';
    if (field.errors['email']) return 'Please enter a valid email address';
    return 'This field is invalid';
  }
}
