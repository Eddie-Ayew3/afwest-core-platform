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
  selector: 'app-new-guard',
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
  templateUrl: './new-guard.component.html',
  styleUrls: ['./new-guard.component.css']
})
export class NewGuardComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private alertDialog = inject(AlertDialogService);

  currentStep = 0;
  readonly totalSteps = 4;
  isSubmitting = false;
  showSuccessAlert = false;

  readonly stepTitles = ['Personal Info', 'Contact', 'Security Details', 'Emergency & Review'];

  readonly sites = [
    'Head Office – Accra', 'Kumasi Branch', 'Takoradi Branch',
    'Tema Industrial', 'Cape Coast Post'
  ];

  // DatePicker objects
  dobObj: Date | null = null;
  startDateObj: Date | null = null;

  // Profile photo
  profilePhotoPreview: string | null = null;

  guardForm!: FormGroup;

  constructor() {
    this.initForm();
  }

  private initForm(): void {
    this.guardForm = this.fb.group({
      // Personal
      fullName:    ['', Validators.required],
      guardId:     [{ value: '', disabled: true }],
      dateOfBirth: [null],
      gender:      [''],
      nationalId:  [''],

      // Contact
      email:              ['', [Validators.required, Validators.email]],
      phone:              ['', Validators.required],
      alternativePhone:   [''],
      residentialAddress: ['', Validators.required],
      city:               [''],
      region:             [''],

      // Security Details (guard-specific)
      guardRole:       ['Guard', Validators.required],
      licenseNumber:   [''],
      certification:   [''],
      site:            ['', Validators.required],
      shiftPreference: [''],
      startDate:       [null, Validators.required],
      supervisor:      [''],
      notes:           [''],

      // Emergency Contact
      emergencyName:         ['', Validators.required],
      emergencyRelationship: [''],
      emergencyPhone:        ['', Validators.required],
      emergencyAltPhone:     ['']
    });
  }

  ngOnInit(): void {
    this.generateGuardId();
  }

  private generateGuardId(): void {
    const num = String(Math.floor(Math.random() * 900) + 100);
    this.guardForm.patchValue({ guardId: `GD-${num}` });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { this.profilePhotoPreview = e.target?.result as string; };
    reader.readAsDataURL(file);
  }

  onDobChange(date: Date | null): void {
    this.guardForm.patchValue({ dateOfBirth: date });
  }

  onStartDateChange(date: Date | null): void {
    this.guardForm.patchValue({ startDate: date });
    this.guardForm.get('startDate')?.markAsTouched();
  }

  private getStepRequiredFields(step: number): string[] {
    const map: Record<number, string[]> = {
      0: ['fullName'],
      1: ['email', 'phone', 'residentialAddress'],
      2: ['guardRole', 'site', 'startDate'],
      3: ['emergencyName', 'emergencyPhone']
    };
    return map[step] ?? [];
  }

  private isStepValid(step: number): boolean {
    return this.getStepRequiredFields(step).every(field => {
      const ctrl = this.guardForm.get(field);
      return ctrl ? ctrl.valid : true;
    });
  }

  nextStep(): void {
    if (this.currentStep >= this.totalSteps - 1) return;
    this.getStepRequiredFields(this.currentStep)
      .forEach(field => this.guardForm.get(field)?.markAsTouched());
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
    return this.guardForm.getRawValue();
  }

  onSubmit(): void {
    Object.values(this.guardForm.controls).forEach(c => c.markAsTouched());
    if (this.guardForm.invalid) return;

    const dialogRef = this.alertDialog.open({
      title: 'Add Guard?',
      description: `Confirm adding ${this.formValues.fullName} (${this.formValues.guardId}) as a ${this.formValues.guardRole} at ${this.formValues.site}.`,
      actionText: 'Yes, Add Guard',
      variant: 'default'
    });

    dialogRef.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      this.isSubmitting = true;
      setTimeout(() => {
        console.log('New guard submitted:', this.guardForm.getRawValue());
        this.isSubmitting = false;
        this.showSuccessAlert = true;
        setTimeout(() => this.router.navigate(['/hr/guard-management']), 2500);
      }, 1500);
    });
  }

  onCancel(): void {
    this.router.navigate(['/hr/guard-management']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.guardForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.guardForm.get(fieldName);
    if (!field?.errors) return '';
    if (field.errors['required']) return 'This field is required';
    if (field.errors['email']) return 'Please enter a valid email address';
    return 'Invalid value';
  }
}
