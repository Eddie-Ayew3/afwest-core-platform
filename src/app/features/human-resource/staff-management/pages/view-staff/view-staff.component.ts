import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '@tolle_/tolle-ui';
import { NgxPrintModule } from 'ngx-print';

export interface Child {
  name: string;
  address: string;
  telephone: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
  reasonForLeaving: string;
}

export interface StaffProfile {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Suspended' | 'Inactive';
  photo?: string;
  // Personal
  fullName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  maritalStatus: string;
  placeOfBirth: string;
  regionOfBirth: string;
  height: string;
  snetNumber: string;
  nationalId: string;
  // Contact
  email: string;
  phone: string;
  telephone: string;
  alternativePhone: string;
  residentialAddress: string;
  postalAddress: string;
  city: string;
  region: string;
  // Employment
  department: string;
  jobTitle: string;
  site: string;
  employmentType: string;
  startDate: string;
  reportingManager: string;
  notes: string;
  // Banking
  bankName: string;
  bankAccountNumber: string;
  momoName: string;
  momoNumber: string;
  // Family
  numberOfChildren: number;
  children: Child[];
  fatherName: string;
  fatherAddress: string;
  fatherPhone: string;
  motherName: string;
  motherAddress: string;
  motherPhone: string;
  // Medical & Education
  hasChronicDiseases: boolean;
  chronicDiseaseDescription: string;
  highestEducation: string;
  institutionName: string;
  yearCompleted: string;
  // Work Experience
  workExperience: WorkExperience[];
  // Next of Kin
  nextOfKinName: string;
  nextOfKinRelationship: string;
  nextOfKinAddress: string;
  nextOfKinPhone: string;
  // Metadata
  createdBy: string;
  createdDate: string;
  approvedBy: string;
  approvedDate: string;
  documentRef: string;
}

const MOCK_STAFF: StaffProfile[] = [
  {
    id: 'ST001', 
    name: 'Kwame Mensah', 
    fullName: 'Kwame Mensah',
    role: 'Operations Manager', 
    status: 'Active',
    dateOfBirth: '15 March 1985', 
    gender: 'Male', 
    nationality: 'Ghanaian',
    maritalStatus: 'Married',
    placeOfBirth: 'Accra',
    regionOfBirth: 'Greater Accra',
    height: "5'11\"",
    snetNumber: 'SNET123456',
    nationalId: 'GHA-000123456-0',
    email: 'k.mensah@afwest.com.gh', 
    phone: '024 456 7890', 
    telephone: '030 123 4567',
    alternativePhone: '020 111 2233',
    residentialAddress: '12 Labone Street', 
    postalAddress: 'P.O. Box GP 12345',
    city: 'Accra', 
    region: 'Greater Accra',
    department: 'Operations',
    jobTitle: 'Operations Manager',
    site: 'Head Office – Accra', 
    employmentType: 'Full-time',
    startDate: '15 January 2020',
    reportingManager: 'CEO', 
    notes: 'Oversees all operational activities and ensures compliance with security protocols.',
    bankName: 'Ecobank Ghana',
    bankAccountNumber: '1234567890',
    momoName: 'Kwame Mensah',
    momoNumber: '024 456 7890',
    numberOfChildren: 2,
    children: [
      { name: 'Nana Yaa Mensah', address: '12 Labone Street', telephone: '024 456 7891' },
      { name: 'Kwame Mensah Jr', address: '12 Labone Street', telephone: '024 456 7892' }
    ],
    fatherName: 'Kofi Mensah Sr',
    fatherAddress: 'Kumasi', 
    fatherPhone: '050 123 4567',
    motherName: 'Adwoa Mensah',
    motherAddress: 'Accra',
    motherPhone: '024 123 4568',
    hasChronicDiseases: false,
    chronicDiseaseDescription: '',
    highestEducation: 'Master\'s Degree',
    institutionName: 'University of Ghana',
    yearCompleted: '2010',
    workExperience: [
      {
        company: 'Ghana Police Service',
        position: 'Senior Officer',
        startDate: '2010',
        endDate: '2019',
        responsibilities: 'Security operations, team management, incident response',
        reasonForLeaving: 'Career advancement opportunity'
      }
    ],
    nextOfKinName: 'Naana Mensah', 
    nextOfKinRelationship: 'Spouse',
    nextOfKinAddress: '12 Labone Street, Accra',
    nextOfKinPhone: '024 999 8877', 
    createdBy: 'HR Department', 
    createdDate: '10 January 2020',
    approvedBy: 'CEO', 
    approvedDate: '14 January 2020',
    documentRef: 'AFWS-ST-2020-001'
  },
  {
    id: 'ST002', 
    name: 'Akosua Frimpong', 
    fullName: 'Akosua Frimpong',
    role: 'HR Manager', 
    status: 'Active',
    dateOfBirth: '8 June 1988', 
    gender: 'Female', 
    nationality: 'Ghanaian',
    maritalStatus: 'Single',
    placeOfBirth: 'Kumasi',
    regionOfBirth: 'Ashanti',
    height: "5'6\"",
    snetNumber: 'SNET234567',
    nationalId: 'GHA-000234567-1',
    email: 'a.frimpong@afwest.com.gh', 
    phone: '026 567 8901', 
    telephone: '',
    alternativePhone: '',
    residentialAddress: '7 Adum Road', 
    postalAddress: '',
    city: 'Kumasi', 
    region: 'Ashanti',
    department: 'HR',
    jobTitle: 'HR Manager',
    site: 'Head Office – Accra', 
    employmentType: 'Full-time',
    startDate: '3 March 2019',
    reportingManager: 'CEO', 
    notes: 'Manages all HR functions including recruitment, training, and employee relations.',
    bankName: '',
    bankAccountNumber: '',
    momoName: '',
    momoNumber: '',
    numberOfChildren: 0,
    children: [],
    fatherName: '',
    fatherAddress: '', 
    fatherPhone: '',
    motherName: '',
    motherAddress: '',
    motherPhone: '',
    hasChronicDiseases: false,
    chronicDiseaseDescription: '',
    highestEducation: '',
    institutionName: '',
    yearCompleted: '',
    workExperience: [],
    nextOfKinName: 'Kofi Frimpong', 
    nextOfKinRelationship: 'Brother',
    nextOfKinAddress: 'Kumasi',
    nextOfKinPhone: '026 111 3344', 
    createdBy: 'CEO', 
    createdDate: '1 March 2019',
    approvedBy: 'Board', 
    approvedDate: '2 March 2019',
    documentRef: 'AFWS-ST-2019-002'
  }
];

@Component({
  selector: 'app-view-staff',
  standalone: true,
  imports: [CommonModule, NgxPrintModule,ButtonComponent],
  templateUrl: './view-staff.component.html',
  styleUrls: ['./view-staff.component.css']
})
export class ViewStaffComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  staff: StaffProfile | null = null;
  today = new Date();

  @ViewChild('printer') printer: any;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.staff = MOCK_STAFF.find(s => s.id === id) ?? MOCK_STAFF[0];
  }

  print(): void {
    if (this.printer) {
      this.printer.print();
    }
  }

  goBack(): void {
    this.router.navigate(['/hr/staff-management']);
  }

  getStatusColor(status: string): string {
    if (status === 'Active') return 'default';
    if (status === 'Suspended') return 'destructive';
    return 'secondary';
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
