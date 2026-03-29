import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '@tolle_/tolle-ui';
import { NgxPrintModule } from 'ngx-print';
import { GuardActions } from '../../stores/guard.actions';
import { selectSelectedGuard } from '../../stores/guard.selectors';
import { GuardDto } from '../../models/guard.model';

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



@Component({
  selector: 'app-view-guard',
  standalone: true,
  imports: [CommonModule, ButtonComponent, NgxPrintModule],
  templateUrl: './view-guard.component.html',
  styleUrls: ['./view-guard.component.css']
})
export class ViewGuardComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  guard: GuardDto | null = null;
  today = new Date();

  @ViewChild('printer') printer: any;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(GuardActions.loadGuard({ id }));
      
      this.store.select(selectSelectedGuard).subscribe(guard => {
        this.guard = guard;
      });
    }
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

  get documentRef(): string {
    return this.guard ? `AFWS-GD-${new Date(this.guard.createdAt).getFullYear()}-${this.guard.employeeId}` : '';
  }

  get photo(): string | null {
    return null;
  }

  get name(): string {
    return this.guard?.fullName ?? '';
  }

  get role(): string {
    return 'Guard';
  }
}
