import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent, BadgeComponent } from '@tolle_/tolle-ui';

export interface GuardProfile {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Suspended' | 'Inactive';
  photo?: string;
  // Personal
  dateOfBirth: string;
  gender: string;
  nationalId: string;
  // Contact
  email: string;
  phone: string;
  alternativePhone: string;
  residentialAddress: string;
  city: string;
  region: string;
  // Security
  licenseNumber: string;
  certification: string;
  site: string;
  shiftPreference: string;
  startDate: string;
  supervisor: string;
  notes: string;
  // Emergency
  emergencyName: string;
  emergencyRelationship: string;
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
    id: 'GD001', name: 'Kwesi Owusu', role: 'Senior Guard', status: 'Active',
    dateOfBirth: '15 March 1990', gender: 'Male', nationalId: 'GHA-000123456-0',
    email: 'k.owusu@afwest.com.gh', phone: '024 456 7890', alternativePhone: '020 111 2233',
    residentialAddress: '12 Osu Badu Street', city: 'Accra', region: 'Greater Accra',
    licenseNumber: 'GSS-2022-00101', certification: 'Advanced Security Training',
    site: 'Head Office – Accra', shiftPreference: 'Night', startDate: '15 January 2022',
    supervisor: 'Esi Mensah', notes: 'Experienced night-shift guard. Handles VIP entry protocols.',
    emergencyName: 'Akua Owusu', emergencyRelationship: 'Spouse',
    emergencyPhone: '024 999 8877', emergencyAltPhone: '',
    createdBy: 'Kwame Mensah', createdDate: '12 January 2022',
    approvedBy: 'Akosua Frimpong', approvedDate: '14 January 2022',
    documentRef: 'AFWS-GD-2022-001'
  },
  {
    id: 'GD002', name: 'Esi Mensah', role: 'Guard Supervisor', status: 'Active',
    dateOfBirth: '8 June 1985', gender: 'Female', nationalId: 'GHA-000234567-1',
    email: 'e.mensah@afwest.com.gh', phone: '026 567 8901', alternativePhone: '',
    residentialAddress: '7 Adum Road', city: 'Kumasi', region: 'Ashanti',
    licenseNumber: 'GSS-2020-00045', certification: 'Advanced Security Training',
    site: 'Kumasi Branch', shiftPreference: 'Day', startDate: '3 March 2020',
    supervisor: 'Kofi Asante', notes: 'Supervisor for Kumasi Branch day shift. Trained in conflict de-escalation.',
    emergencyName: 'Yaw Mensah', emergencyRelationship: 'Spouse',
    emergencyPhone: '026 111 3344', emergencyAltPhone: '020 222 4455',
    createdBy: 'Ama Boateng', createdDate: '1 March 2020',
    approvedBy: 'Kwame Mensah', approvedDate: '2 March 2020',
    documentRef: 'AFWS-GD-2020-002'
  },
  {
    id: 'GD003', name: 'Fiifi Aidoo', role: 'Guard', status: 'Active',
    dateOfBirth: '22 November 1995', gender: 'Male', nationalId: 'GHA-000345678-2',
    email: 'f.aidoo@afwest.com.gh', phone: '024 678 9012', alternativePhone: '',
    residentialAddress: '3 Labadi Road', city: 'Accra', region: 'Greater Accra',
    licenseNumber: 'GSS-2023-00210', certification: 'Basic Security Training',
    site: 'Head Office – Accra', shiftPreference: 'Rotating', startDate: '10 May 2023',
    supervisor: 'Kwesi Owusu', notes: '',
    emergencyName: 'Abena Aidoo', emergencyRelationship: 'Mother',
    emergencyPhone: '020 777 6655', emergencyAltPhone: '',
    createdBy: 'Ama Boateng', createdDate: '8 May 2023',
    approvedBy: 'Akosua Frimpong', approvedDate: '9 May 2023',
    documentRef: 'AFWS-GD-2023-003'
  },
  {
    id: 'GD004', name: 'Afia Nyarko', role: 'Guard', status: 'Suspended',
    dateOfBirth: '30 July 1993', gender: 'Female', nationalId: 'GHA-000456789-3',
    email: 'a.nyarko@afwest.com.gh', phone: '055 789 0123', alternativePhone: '',
    residentialAddress: '19 Tema Harbour Rd', city: 'Tema', region: 'Greater Accra',
    licenseNumber: 'GSS-2021-00088', certification: 'Basic Security Training',
    site: 'Tema Industrial', shiftPreference: 'Day', startDate: '20 August 2021',
    supervisor: 'Kofi Tawiah', notes: 'Currently suspended pending internal review.',
    emergencyName: 'Kojo Nyarko', emergencyRelationship: 'Brother',
    emergencyPhone: '055 111 2233', emergencyAltPhone: '',
    createdBy: 'Yaw Darko', createdDate: '18 August 2021',
    approvedBy: 'Kwame Mensah', approvedDate: '19 August 2021',
    documentRef: 'AFWS-GD-2021-004'
  },
  {
    id: 'GD005', name: 'Yoofi Entsie', role: 'Guard', status: 'Active',
    dateOfBirth: '5 April 1997', gender: 'Male', nationalId: 'GHA-000567890-4',
    email: 'y.entsie@afwest.com.gh', phone: '027 890 1234', alternativePhone: '020 333 4455',
    residentialAddress: '4 Victoria Road', city: 'Cape Coast', region: 'Central',
    licenseNumber: 'GSS-2022-00155', certification: 'First Aid Certified',
    site: 'Cape Coast Post', shiftPreference: 'Night', startDate: '1 April 2022',
    supervisor: 'Esi Mensah', notes: 'First Aid certified. Handles medical emergencies on-site.',
    emergencyName: 'Ama Entsie', emergencyRelationship: 'Spouse',
    emergencyPhone: '027 444 5566', emergencyAltPhone: '',
    createdBy: 'Kwame Mensah', createdDate: '28 March 2022',
    approvedBy: 'Akosua Frimpong', approvedDate: '30 March 2022',
    documentRef: 'AFWS-GD-2022-005'
  },
  {
    id: 'GD006', name: 'Maame Serwaa', role: 'Senior Guard', status: 'Active',
    dateOfBirth: '18 September 1988', gender: 'Female', nationalId: 'GHA-000678901-5',
    email: 'm.serwaa@afwest.com.gh', phone: '024 901 2345', alternativePhone: '',
    residentialAddress: '6 Cantonments Ave', city: 'Accra', region: 'Greater Accra',
    licenseNumber: 'GSS-2019-00032', certification: 'Armed Security Certified',
    site: 'Head Office – Accra', shiftPreference: 'Day', startDate: '15 February 2019',
    supervisor: 'Esi Mensah', notes: 'Armed security certified. Manages day-shift team.',
    emergencyName: 'Kwabena Serwaa', emergencyRelationship: 'Spouse',
    emergencyPhone: '024 555 6677', emergencyAltPhone: '020 888 9900',
    createdBy: 'Kwame Mensah', createdDate: '12 February 2019',
    approvedBy: 'Akosua Frimpong', approvedDate: '14 February 2019',
    documentRef: 'AFWS-GD-2019-006'
  },
  {
    id: 'GD007', name: 'Nii Armah', role: 'Guard', status: 'Active',
    dateOfBirth: '12 December 1994', gender: 'Male', nationalId: 'GHA-000789012-6',
    email: 'n.armah@afwest.com.gh', phone: '026 012 3456', alternativePhone: '',
    residentialAddress: '11 Kejetia Lane', city: 'Kumasi', region: 'Ashanti',
    licenseNumber: 'GSS-2023-00198', certification: 'Basic Security Training',
    site: 'Kumasi Branch', shiftPreference: 'Night', startDate: '5 September 2023',
    supervisor: 'Esi Mensah', notes: '',
    emergencyName: 'Adwoa Armah', emergencyRelationship: 'Sister',
    emergencyPhone: '026 666 7788', emergencyAltPhone: '',
    createdBy: 'Ama Boateng', createdDate: '3 September 2023',
    approvedBy: 'Akosua Frimpong', approvedDate: '4 September 2023',
    documentRef: 'AFWS-GD-2023-007'
  },
  {
    id: 'GD008', name: 'Akosua Agyare', role: 'Guard Supervisor', status: 'Inactive',
    dateOfBirth: '3 January 1987', gender: 'Female', nationalId: 'GHA-000890123-7',
    email: 'a.agyare@afwest.com.gh', phone: '024 123 4567', alternativePhone: '',
    residentialAddress: '8 Market Circle', city: 'Takoradi', region: 'Western',
    licenseNumber: 'GSS-2018-00021', certification: 'Advanced Security Training',
    site: 'Takoradi Branch', shiftPreference: 'Day', startDate: '20 June 2018',
    supervisor: 'Kwame Mensah', notes: 'Currently inactive. On extended leave.',
    emergencyName: 'Kofi Agyare', emergencyRelationship: 'Spouse',
    emergencyPhone: '024 777 8899', emergencyAltPhone: '',
    createdBy: 'Yaw Darko', createdDate: '18 June 2018',
    approvedBy: 'Kwame Mensah', approvedDate: '19 June 2018',
    documentRef: 'AFWS-GD-2018-008'
  },
  {
    id: 'GD009', name: 'Kofi Tawiah', role: 'Guard', status: 'Active',
    dateOfBirth: '25 May 1992', gender: 'Male', nationalId: 'GHA-000901234-8',
    email: 'k.tawiah@afwest.com.gh', phone: '020 234 5678', alternativePhone: '024 111 2233',
    residentialAddress: '15 Airport Rd', city: 'Accra', region: 'Greater Accra',
    licenseNumber: 'GSS-2021-00112', certification: 'Fire Safety Certified',
    site: 'Head Office – Accra', shiftPreference: 'Rotating', startDate: '10 October 2021',
    supervisor: 'Kwesi Owusu', notes: 'Fire safety certified. Manages emergency evacuation drills.',
    emergencyName: 'Efua Tawiah', emergencyRelationship: 'Spouse',
    emergencyPhone: '020 888 7766', emergencyAltPhone: '',
    createdBy: 'Ama Boateng', createdDate: '8 October 2021',
    approvedBy: 'Kwame Mensah', approvedDate: '9 October 2021',
    documentRef: 'AFWS-GD-2021-009'
  },
  {
    id: 'GD010', name: 'Abena Boampong', role: 'Senior Guard', status: 'Active',
    dateOfBirth: '14 February 1989', gender: 'Female', nationalId: 'GHA-001012345-9',
    email: 'a.boampong@afwest.com.gh', phone: '055 345 6789', alternativePhone: '',
    residentialAddress: '22 Industrial Lane', city: 'Tema', region: 'Greater Accra',
    licenseNumber: 'GSS-2020-00067', certification: 'Advanced Security Training',
    site: 'Tema Industrial', shiftPreference: 'Day', startDate: '1 July 2020',
    supervisor: 'Esi Mensah', notes: 'Leads Tema Industrial day-shift team.',
    emergencyName: 'Kweku Boampong', emergencyRelationship: 'Spouse',
    emergencyPhone: '055 999 0011', emergencyAltPhone: '024 333 4455',
    createdBy: 'Kwame Mensah', createdDate: '28 June 2020',
    approvedBy: 'Akosua Frimpong', approvedDate: '30 June 2020',
    documentRef: 'AFWS-GD-2020-010'
  },
  {
    id: 'GD011', name: 'Ato Hagan', role: 'Guard', status: 'Active',
    dateOfBirth: '9 August 1996', gender: 'Male', nationalId: 'GHA-001123456-0',
    email: 'a.hagan@afwest.com.gh', phone: '026 456 7890', alternativePhone: '',
    residentialAddress: '5 Roman Hill', city: 'Kumasi', region: 'Ashanti',
    licenseNumber: 'GSS-2022-00177', certification: 'Basic Security Training',
    site: 'Kumasi Branch', shiftPreference: 'Any', startDate: '15 June 2022',
    supervisor: 'Esi Mensah', notes: '',
    emergencyName: 'Nana Hagan', emergencyRelationship: 'Father',
    emergencyPhone: '026 222 3344', emergencyAltPhone: '',
    createdBy: 'Ama Boateng', createdDate: '13 June 2022',
    approvedBy: 'Kwame Mensah', approvedDate: '14 June 2022',
    documentRef: 'AFWS-GD-2022-011'
  },
  {
    id: 'GD012', name: 'Ewuraba Piesie', role: 'Guard', status: 'Active',
    dateOfBirth: '28 October 1998', gender: 'Female', nationalId: 'GHA-001234567-1',
    email: 'e.piesie@afwest.com.gh', phone: '027 567 8901', alternativePhone: '',
    residentialAddress: '9 Ola Road', city: 'Cape Coast', region: 'Central',
    licenseNumber: 'GSS-2023-00241', certification: 'Basic Security Training',
    site: 'Cape Coast Post', shiftPreference: 'Day', startDate: '20 January 2024',
    supervisor: 'Yoofi Entsie', notes: 'New recruit. Completed probation successfully.',
    emergencyName: 'Kofi Piesie', emergencyRelationship: 'Brother',
    emergencyPhone: '027 111 2233', emergencyAltPhone: '',
    createdBy: 'Ama Boateng', createdDate: '17 January 2024',
    approvedBy: 'Akosua Frimpong', approvedDate: '18 January 2024',
    documentRef: 'AFWS-GD-2024-012'
  }
];

@Component({
  selector: 'app-view-guard',
  standalone: true,
  imports: [CommonModule, ButtonComponent, BadgeComponent],
  templateUrl: './view-guard.component.html',
  styleUrls: ['./view-guard.component.css']
})
export class ViewGuardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  guard: GuardProfile | null = null;
  today = new Date();

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.guard = MOCK_GUARDS.find(g => g.id === id) ?? MOCK_GUARDS[0];
  }

  print(): void {
    window.print();
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
