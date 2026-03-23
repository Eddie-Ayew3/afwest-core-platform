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

export interface GuardProfile {
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
  // Security
  guardRole: string;
  licenseNumber: string;
  certification: string;
  site: string;
  shiftPreference: string;
  startDate: string;
  supervisor: string;
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
  // Emergency
  emergencyName: string;
  emergencyRelationship: string;
  emergencyAddress: string;
  emergencyPhone: string;
  emergencyAltPhone: string;
  // Metadata
  createdBy: string;
  createdDate: string;
  approvedBy: string;
  approvedDate: string;
  documentRef: string;
}

const MOCK_GUARDS: GuardProfile[] = [
  {
    id: 'GD001', 
    name: 'Kwesi Owusu', 
    fullName: 'Kwesi Owusu',
    role: 'Senior Guard', 
    guardRole: 'Senior Guard',
    status: 'Active',
    dateOfBirth: '15 March 1990', 
    gender: 'Male', 
    nationality: 'Ghanaian',
    maritalStatus: 'Married',
    placeOfBirth: 'Accra',
    regionOfBirth: 'Greater Accra',
    height: "5'10\"",
    snetNumber: 'SNET123456',
    nationalId: 'GHA-000123456-0',
    email: 'k.owusu@afwest.com.gh', 
    phone: '024 456 7890', 
    telephone: '030 123 4567',
    alternativePhone: '020 111 2233',
    residentialAddress: '12 Osu Badu Street', 
    postalAddress: 'P.O. Box GP 12345',
    city: 'Accra', 
    region: 'Greater Accra',
    licenseNumber: 'GSS-2022-00101', 
    certification: 'Advanced Security Training',
    site: 'Head Office – Accra', 
    shiftPreference: 'Night', 
    startDate: '15 January 2022',
    supervisor: 'Esi Mensah', 
    notes: 'Experienced night-shift guard. Handles VIP entry protocols.',
    bankName: 'Ecobank Ghana',
    bankAccountNumber: '1234567890',
    momoName: 'Kwesi Owusu',
    momoNumber: '024 456 7890',
    numberOfChildren: 2,
    children: [
      { name: 'Kwame Owusu Jr', address: '12 Osu Badu Street', telephone: '024 456 7891' },
      { name: 'Yaa Owusu', address: '12 Osu Badu Street', telephone: '024 456 7892' }
    ],
    fatherName: 'Kofi Owusu Sr',
    fatherAddress: 'Kumasi', 
    fatherPhone: '050 123 4567',
    motherName: 'Adwoa Owusu',
    motherAddress: 'Accra',
    motherPhone: '024 123 4568',
    hasChronicDiseases: false,
    chronicDiseaseDescription: '',
    highestEducation: 'Bachelor\'s Degree',
    institutionName: 'University of Ghana',
    yearCompleted: '2012',
    workExperience: [
      {
        company: 'Ghana Armed Forces',
        position: 'Security Officer',
        startDate: '2015',
        endDate: '2021',
        responsibilities: 'Base security, access control, patrol duties',
        reasonForLeaving: 'Career advancement opportunity'
      }
    ],
    emergencyName: 'Akua Owusu', 
    emergencyRelationship: 'Spouse',
    emergencyAddress: '12 Osu Badu Street, Accra',
    emergencyPhone: '024 999 8877', 
    emergencyAltPhone: '',
    createdBy: 'Kwame Mensah', 
    createdDate: '12 January 2022',
    approvedBy: 'Akosua Frimpong', 
    approvedDate: '14 January 2022',
    documentRef: 'AFWS-GD-2022-001'
  },
  {
    id: 'GD002', 
    name: 'Esi Mensah', 
    fullName: 'Esi Mensah',
    role: 'Guard Supervisor', 
    guardRole: 'Guard Supervisor',
    status: 'Active',
    dateOfBirth: '8 June 1985', 
    gender: 'Female', 
    nationality: 'Ghanaian',
    maritalStatus: 'Married',
    placeOfBirth: 'Kumasi',
    regionOfBirth: 'Ashanti',
    height: "5'6\"",
    snetNumber: 'SNET234567',
    nationalId: 'GHA-000234567-1',
    email: 'e.mensah@afwest.com.gh', 
    phone: '026 567 8901', 
    telephone: '',
    alternativePhone: '',
    residentialAddress: '7 Adum Road', 
    postalAddress: '',
    city: 'Kumasi', 
    region: 'Ashanti',
    licenseNumber: 'GSS-2020-00045', 
    certification: 'Advanced Security Training',
    site: 'Kumasi Branch', 
    shiftPreference: 'Day', 
    startDate: '3 March 2020',
    supervisor: 'Kofi Asante', 
    notes: 'Supervisor for Kumasi Branch day shift. Trained in conflict de-escalation.',
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
    emergencyName: 'Yaw Mensah', 
    emergencyRelationship: 'Spouse',
    emergencyAddress: '7 Adum Road, Kumasi',
    emergencyPhone: '026 111 3344', 
    emergencyAltPhone: '020 222 4455',
    createdBy: 'Ama Boateng', 
    createdDate: '1 March 2020',
    approvedBy: 'Kwame Mensah', 
    approvedDate: '2 March 2020',
    documentRef: 'AFWS-GD-2020-002'
  }
];

@Component({
  selector: 'app-view-guard',
  standalone: true,
  imports: [CommonModule, ButtonComponent, NgxPrintModule],
  templateUrl: './view-guard.component.html',
  styleUrls: ['./view-guard.component.css']
})
export class ViewGuardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  guard: GuardProfile | null = null;
  today = new Date();

  @ViewChild('printer') printer: any;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.guard = MOCK_GUARDS.find(g => g.id === id) ?? MOCK_GUARDS[0];
  }

  print(): void {
    if (this.printer) {
      this.printer.print();
    }
  }

  goBack(): void {
    this.router.navigate(['/hr/guard-management']);
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
