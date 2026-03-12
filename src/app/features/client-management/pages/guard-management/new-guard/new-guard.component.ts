import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
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
  AlertDialogService,
  CheckboxComponent
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
    AlertComponent,
    CheckboxComponent
  ],
  templateUrl: './new-guard.component.html',
  styleUrls: ['./new-guard.component.css']
})
export class NewGuardComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private alertDialog = inject(AlertDialogService);

  currentStep = 0;
  readonly totalSteps = 7;
  isSubmitting = false;
  showSuccessAlert = false;

  readonly stepTitles = [
    'Personal Info', 'Contact', 'Security Details', 
    'Family Info', 'Medical & Education', 'Work Experience', 'Review & Submit'
  ];

  readonly sites = [
    'Head Office – Accra', 'Kumasi Branch', 'Takoradi Branch',
    'Tema Industrial', 'Cape Coast Post'
  ];

  readonly nationalities = [
    'Ghanaian', 'Nigerian', 'Burkinabe', 'Ivorian', 'Togolese',
    'Beninese', 'Malian', 'Senegalese', 'Other'
  ];

  readonly maritalStatuses = [
    'Single', 'Married', 'Divorced', 'Widowed', 'Separated'
  ];

  readonly ghanaianRegions = [
    'Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern',
    'Volta', 'Northern', 'Upper East', 'Upper West', 'Savannah',
    'North East', 'Oti', 'Western North', 'Ahafo', 'Bono East', 'Bono'
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
      fullName:        ['', Validators.required],
      guardId:         [{ value: '', disabled: true }],
      dateOfBirth:     [null],
      gender:          [''],
      nationality:      [''],
      maritalStatus:    [''],
      placeOfBirth:     [''],
      regionOfBirth:    [''],
      height:          [''],
      snetNumber:      [''],
      nationalId:      [''],

      // Contact
      email:              ['', [Validators.required, Validators.email]],
      phone:              ['', Validators.required],
      telephone:          [''],
      alternativePhone:   [''],
      residentialAddress: ['', Validators.required],
      postalAddress:      [''],
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

      // Banking Details
      bankName:          [''],
      bankAccountNumber: [''],
      momoName:          [''],
      momoNumber:        [''],

      // Family Information
      numberOfChildren: [0],
      children:          this.fb.array([]),
      fatherName:        [''],
      fatherAddress:     [''],
      fatherPhone:       [''],
      motherName:        [''],
      motherAddress:     [''],
      motherPhone:       [''],

      // Medical & Education
      hasChronicDiseases:        [false],
      chronicDiseaseDescription: [''],
      highestEducation:          [''],
      institutionName:           [''],
      yearCompleted:             [''],

      // Work Experience
      workExperience: this.fb.array([]),

      // Emergency Contact
      emergencyName:         ['', Validators.required],
      emergencyRelationship: [''],
      emergencyAddress:      [''],
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

  get children() {
    return this.guardForm.get('children') as FormArray;
  }

  get workExperience() {
    return this.guardForm.get('workExperience') as FormArray;
  }

  addChild(): void {
    const childGroup = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      telephone: ['']
    });
    this.children.push(childGroup);
  }

  removeChild(index: number): void {
    this.children.removeAt(index);
  }

  getChildControl(index: number, field: string) {
    return this.children.at(index).get(field)! as FormControl;
  }

  getWorkExperienceControl(index: number, field: string) {
    return this.workExperience.at(index).get(field)! as FormControl;
  }

  updateChildrenCount(): void {
    const count = this.guardForm.get('numberOfChildren')?.value || 0;
    const currentCount = this.children.length;
    
    if (count > currentCount) {
      for (let i = currentCount; i < count; i++) {
        this.addChild();
      }
    } else if (count < currentCount) {
      for (let i = currentCount; i > count; i--) {
        this.removeChild(i - 1);
      }
    }
  }

  addWorkExperience(): void {
    const workGroup = this.fb.group({
      company: ['', Validators.required],
      position: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null],
      responsibilities: [''],
      reasonForLeaving: ['']
    });
    this.workExperience.push(workGroup);
  }

  removeWorkExperience(index: number): void {
    this.workExperience.removeAt(index);
  }

  onSubmit(): void {
    Object.values(this.guardForm.controls).forEach(c => c.markAsTouched());
    if (this.guardForm.invalid) return;

    const dialogRef = this.alertDialog.open({
      title: 'Register Guard?',
      description: `Confirm registering ${this.formValues.fullName} (${this.formValues.guardId}) as a ${this.formValues.guardRole} at ${this.formValues.site}. The guard will require approval before deployment.`,
      actionText: 'Yes, Register Guard',
      variant: 'default'
    });

    dialogRef.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      this.isSubmitting = true;
      setTimeout(() => {
        const newGuard = {
          ...this.guardForm.getRawValue(),
          status: 'pending-approval',
          dateRegistered: new Date(),
          registeredBy: 'HR Manager' // In real app, get from auth service
        };
        console.log('New guard registered:', newGuard);
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
