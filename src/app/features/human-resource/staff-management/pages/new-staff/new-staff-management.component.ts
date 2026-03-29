import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
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
  CheckboxComponent,
  AlertDialogService,
  ToastService
} from '@tolle_/tolle-ui';
import { StaffActions } from '../../stores/staff.actions';
import { CreateStaffDto } from '../../models/staff.model';
import { selectStaffSaving } from '../../stores/staff.selectors';

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
    CheckboxComponent
  ],
  templateUrl: './new-staff-management.component.html',
  styleUrls: ['./new-staff-management.component.css']
})
export class NewStaffManagementComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);

  currentStep = 0;
  readonly totalSteps = 7;
  isSubmitting = false;
  saving$ = this.store.select(selectStaffSaving);

  readonly stepTitles = ['Personal Info', 'Contact Details', 'Employment & Banking', 'Family', 'Medical & Education', 'Work Experience', 'Review'];

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

  readonly ghanaianRegions = [
    'Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern',
    'Volta', 'Northern', 'Upper East', 'Upper West'
  ];

  readonly maritalStatuses = [
    'Single', 'Married', 'Divorced', 'Widowed'
  ];

  readonly nationalities = [
    'Ghanaian', 'Nigerian', 'Other'
  ];

  // DatePicker objects (ngModel-based — synced into the reactive form)
  dobObj: Date | null = null;
  startDateObj: Date | null = null;

  // Profile photo
  profilePhotoPreview: string | null = null;

  staffForm!: FormGroup;
  childrenArray!: FormArray;
  workExperienceArray!: FormArray;

  constructor() {
    this.initForm();
  }

  private initForm(): void {
    this.childrenArray = this.fb.array([]);
    this.workExperienceArray = this.fb.array([]);

    this.staffForm = this.fb.group({
      // Personal
      firstName:     ['', Validators.required],
      lastName:      ['', Validators.required],
      staffId:       [{ value: '', disabled: true }],
      dateOfBirth:   [null],
      placeOfBirth:  [''],
      regionOfBirth: [''],
      nationality:   ['Ghanaian'],
      maritalStatus: [''],
      gender:        [''],
      nationalId:    [''],
      snetNumber:    [''],
      height:        [''],
      // Contact
      email:              ['', [Validators.required, Validators.email]],
      phone:              ['', Validators.required],
      telephone:          [''],
      alternativePhone:   [''],
      residentialAddress: ['', Validators.required],
      postalAddress:      [''],
      city:               [''],
      region:             [''],
      // Employment
      department:       ['', Validators.required],
      jobTitle:         ['', Validators.required],
      site:             ['', Validators.required],
      employmentType:   ['Full-time'],
      startDate:        [null, Validators.required],
      reportingManager: [''],
      // Banking
      bankName:         [''],
      bankAccountNumber: [''],
      momoName:         [''],
      momoNumber:       [''],
      // Next of Kin
      nextOfKinName:        ['', Validators.required],
      nextOfKinRelationship: ['', Validators.required],
      nextOfKinAddress:     ['', Validators.required],
      nextOfKinPhone:       ['', Validators.required],
      // Family
      numberOfChildren: [0],
      children: this.childrenArray,
      fatherName: [''],
      fatherAddress: [''],
      fatherPhone: [''],
      motherName: [''],
      motherAddress: [''],
      motherPhone: [''],
      // Medical
      hasChronicDiseases: [false],
      chronicDiseaseDescription: [''],
      // Education
      highestEducation: [''],
      institutionName: [''],
      yearCompleted: [''],
      // Work Experience
      workExperience: this.workExperienceArray,
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
      3: [],
      4: [],
      5: [],
      6: []
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
    
    if (this.staffForm.invalid) {
      console.log('Form is invalid. Errors:', this.staffForm.errors);
      Object.keys(this.staffForm.controls).forEach(key => {
        const control = this.staffForm.get(key);
        if (control?.invalid) {
          console.log(`${key} is invalid:`, control.errors);
        }
      });
      this.toast.show({ title: 'Validation Error', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }

    const dialogRef = this.alertDialog.open({
      title: 'Add Staff Member?',
      description: `Confirm adding ${this.formValues.fullName} (${this.formValues.staffId}) as a new staff member at ${this.formValues.site}.`,
      actionText: 'Yes, Add Staff',
      variant: 'default'
    });

    dialogRef.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      
      const formValue = this.staffForm.getRawValue();
      const dto: CreateStaffDto = {
        email: formValue.email,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        phoneNumber: formValue.phone,
        password: 'TempPass123!',
        staffId: formValue.staffId || `ST-${Date.now().toString().slice(-6)}`
      };

      console.log('Creating staff:', dto);
      this.store.dispatch(StaffActions.createStaff({ dto }));
      
      this.toast.show({ title: 'Staff Member Added!', description: `${formValue.firstName} ${formValue.lastName} has been successfully added.`, variant: 'success' });
      setTimeout(() => this.router.navigate(['/hr/staff-management']), 2500);
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

  // Children array methods
  addChild(): void {
    const childGroup = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      telephone: ['']
    });
    this.childrenArray.push(childGroup);
  }

  removeChild(index: number): void {
    this.childrenArray.removeAt(index);
  }

  // Work experience array methods
  addWorkExperience(): void {
    const workGroup = this.fb.group({
      companyName: ['', Validators.required],
      position: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      responsibilities: [''],
      reasonForLeaving: ['']
    });
    this.workExperienceArray.push(workGroup);
  }

  removeWorkExperience(index: number): void {
    this.workExperienceArray.removeAt(index);
  }

  // Helper to get form arrays
  get children() {
    return this.staffForm.get('children') as FormArray;
  }

  get workExperience() {
    return this.staffForm.get('workExperience') as FormArray;
  }

  // Helper to get child form control safely
  getChildControl(index: number, field: string) {
    return this.children.at(index).get(field) as FormControl;
  }

  // Helper to get work experience form control safely
  getWorkExperienceControl(index: number, field: string) {
    return this.workExperience.at(index).get(field) as FormControl;
  }

  // Update children count based on input
  updateChildrenCount(): void {
    const count = this.staffForm.get('numberOfChildren')?.value || 0;
    const currentCount = this.childrenArray.length;
    
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
}
