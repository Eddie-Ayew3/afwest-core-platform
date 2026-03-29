import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '@tolle_/tolle-ui';
import { NgxPrintModule } from 'ngx-print';
import { StaffActions } from '../../stores/staff.actions';
import { selectSelectedMember } from '../../stores/staff.selectors';
import { StaffDto } from '../../models/staff.model';

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



@Component({
  selector: 'app-view-staff',
  standalone: true,
  imports: [CommonModule, NgxPrintModule,ButtonComponent],
  templateUrl: './view-staff.component.html',
  styleUrls: ['./view-staff.component.css']
})
export class ViewStaffComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  staff: StaffDto | null = null;
  today = new Date();

  @ViewChild('printer') printer: any;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(StaffActions.loadStaffMember({ id }));
      
      this.store.select(selectSelectedMember).subscribe(member => {
        this.staff = member;
      });
    }
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

  getPrimaryRole(roles: any[]): string {
    if (!roles || roles.length === 0) return 'No Role Assigned';
    return roles[0].roleName;
  }
}
