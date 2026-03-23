import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent, BadgeComponent } from '@tolle_/tolle-ui';

export interface ClientProfile {
  id: string;
  // Basic
  clientName: string;
  status: 'Active' | 'Suspended';
  // Contact
  contactPerson: string;
  jobTitle: string;
  email: string;
  phone: string;
  phoneExtension: string;
  alternativePhone: string;
  // Address
  physicalAddress: string;
  city: string;
  region: string;
  postalCode: string;
  gpsAddress: string;
  // Business
  businessType: string;
  industrySector: string;
  tinNumber: string;
  registrationNumber: string;
  // Contract
  contractStartDate: string;
  contractEndDate: string;
  serviceType: string;
  billingCycle: string;
  // Notes & Metadata
  additionalNotes: string;
  createdBy: string;
  createdDate: string;
  approvedBy: string;
  approvedDate: string;
  documentRef: string;
}

const MOCK_CLIENTS: ClientProfile[] = [
  {
    id: 'CLT001', clientName: 'GoldFields Ghana Ltd.', status: 'Active',
    contactPerson: 'Kwame Asante', jobTitle: 'Head of Security', email: 'k.asante@goldfields.com.gh',
    phone: '030 221 4567', phoneExtension: '200', alternativePhone: '024 333 4455',
    physicalAddress: '1 Gold Avenue, Airport Residential', city: 'Accra', region: 'Greater Accra',
    postalCode: 'GA-100', gpsAddress: 'GE-011-1234',
    businessType: 'Corporate', industrySector: 'Mining',
    tinNumber: 'C0012345678', registrationNumber: 'GH-REG-00123',
    contractStartDate: '1 January 2024', contractEndDate: '31 December 2025',
    serviceType: 'Armed Guard + CCTV Monitoring', billingCycle: 'Monthly',
    additionalNotes: 'VIP site. Requires armed guards at all entry points. 24/7 coverage.',
    createdBy: 'Ama Boateng', createdDate: '28 December 2023',
    approvedBy: 'Kwame Mensah', approvedDate: '30 December 2023',
    documentRef: 'AFWS-CLT-2024-001'
  },
  {
    id: 'CLT002', clientName: 'Accra Mall Management', status: 'Active',
    contactPerson: 'Ama Boateng', jobTitle: 'Operations Manager', email: 'a.boateng@accramall.com',
    phone: '030 277 8900', phoneExtension: '', alternativePhone: '',
    physicalAddress: 'Spintex Road', city: 'Accra', region: 'Greater Accra',
    postalCode: 'GA-230', gpsAddress: 'GW-023-5678',
    businessType: 'Commercial', industrySector: 'Retail',
    tinNumber: 'C0023456789', registrationNumber: 'GH-REG-00234',
    contractStartDate: '1 July 2024', contractEndDate: '30 June 2026',
    serviceType: 'Unarmed Guard + Patrol', billingCycle: 'Monthly',
    additionalNotes: 'Weekend patrols doubled during festive season.',
    createdBy: 'Yaw Darko', createdDate: '25 June 2024',
    approvedBy: 'Akosua Frimpong', approvedDate: '28 June 2024',
    documentRef: 'AFWS-CLT-2024-002'
  },
  {
    id: 'CLT003', clientName: 'Kumasi Hive Ventures', status: 'Active',
    contactPerson: 'Kofi Acheampong', jobTitle: 'CEO', email: 'k.acheampong@khi.com.gh',
    phone: '032 222 3344', phoneExtension: '', alternativePhone: '055 111 2200',
    physicalAddress: '14 Prempeh II Street', city: 'Kumasi', region: 'Ashanti',
    postalCode: 'AK-110', gpsAddress: 'AK-014-7890',
    businessType: 'SME', industrySector: 'Technology',
    tinNumber: 'C0034567890', registrationNumber: 'GH-REG-00345',
    contractStartDate: '15 September 2023', contractEndDate: '14 September 2025',
    serviceType: 'Unarmed Guard', billingCycle: 'Quarterly',
    additionalNotes: '',
    createdBy: 'Ama Boateng', createdDate: '12 September 2023',
    approvedBy: 'Kwame Mensah', approvedDate: '13 September 2023',
    documentRef: 'AFWS-CLT-2023-003'
  },
  {
    id: 'CLT004', clientName: 'KNUST Research Institute', status: 'Suspended',
    contactPerson: 'Abena Frimpong', jobTitle: 'Finance Director', email: 'a.frimpong@knust.edu.gh',
    phone: '032 240 1122', phoneExtension: '15', alternativePhone: '',
    physicalAddress: 'KNUST Campus, Ayeduase', city: 'Kumasi', region: 'Ashanti',
    postalCode: 'AK-112', gpsAddress: 'AK-032-2345',
    businessType: 'Public Institution', industrySector: 'Education',
    tinNumber: 'C0045678901', registrationNumber: 'GH-REG-00456',
    contractStartDate: '1 March 2023', contractEndDate: '28 February 2025',
    serviceType: 'Unarmed Guard + Access Control', billingCycle: 'Monthly',
    additionalNotes: 'Suspended pending payment review.',
    createdBy: 'Yaw Darko', createdDate: '25 February 2023',
    approvedBy: 'Akosua Frimpong', approvedDate: '27 February 2023',
    documentRef: 'AFWS-CLT-2023-004'
  },
  {
    id: 'CLT005', clientName: 'Takoradi Harbour Authority', status: 'Active',
    contactPerson: 'Yaw Entsie', jobTitle: 'Port Security Manager', email: 'y.entsie@tha.gov.gh',
    phone: '031 202 5566', phoneExtension: '30', alternativePhone: '027 444 5566',
    physicalAddress: 'Harbour Road, Sekondi-Takoradi', city: 'Takoradi', region: 'Western',
    postalCode: 'WR-001', gpsAddress: 'WR-005-6789',
    businessType: 'Government', industrySector: 'Maritime',
    tinNumber: 'C0056789012', registrationNumber: 'GH-GOV-00567',
    contractStartDate: '1 February 2024', contractEndDate: '31 January 2026',
    serviceType: 'Armed Guard + Marine Patrol', billingCycle: 'Monthly',
    additionalNotes: 'High-security port facility. Background checks mandatory for all guards.',
    createdBy: 'Kwame Mensah', createdDate: '28 January 2024',
    approvedBy: 'Akosua Frimpong', approvedDate: '30 January 2024',
    documentRef: 'AFWS-CLT-2024-005'
  },
  {
    id: 'CLT006', clientName: 'Ahanta West Municipal', status: 'Active',
    contactPerson: 'Efua Mensah', jobTitle: 'Municipal Director', email: 'e.mensah@ahantawest.gov.gh',
    phone: '031 210 7788', phoneExtension: '', alternativePhone: '',
    physicalAddress: 'Municipal Assembly Complex', city: 'Agona Nkwanta', region: 'Western',
    postalCode: 'WR-022', gpsAddress: 'WR-022-3456',
    businessType: 'Government', industrySector: 'Public Administration',
    tinNumber: 'C0067890123', registrationNumber: 'GH-GOV-00678',
    contractStartDate: '1 December 2023', contractEndDate: '30 November 2025',
    serviceType: 'Unarmed Guard', billingCycle: 'Monthly',
    additionalNotes: '',
    createdBy: 'Ama Boateng', createdDate: '28 November 2023',
    approvedBy: 'Kwame Mensah', approvedDate: '29 November 2023',
    documentRef: 'AFWS-CLT-2023-006'
  },
  {
    id: 'CLT007', clientName: 'Cape Coast Teaching Hospital', status: 'Active',
    contactPerson: 'Nana Arhin', jobTitle: 'Hospital Administrator', email: 'n.arhin@ccth.gov.gh',
    phone: '033 213 4455', phoneExtension: '100', alternativePhone: '026 777 8899',
    physicalAddress: 'Hospital Road', city: 'Cape Coast', region: 'Central',
    postalCode: 'CR-001', gpsAddress: 'CR-001-4567',
    businessType: 'Public Institution', industrySector: 'Healthcare',
    tinNumber: 'C0078901234', registrationNumber: 'GH-GOV-00789',
    contractStartDate: '1 September 2023', contractEndDate: '31 August 2025',
    serviceType: 'Unarmed Guard + Emergency Response', billingCycle: 'Monthly',
    additionalNotes: 'Guards must complete basic first aid refresher annually.',
    createdBy: 'Yaw Darko', createdDate: '28 August 2023',
    approvedBy: 'Akosua Frimpong', approvedDate: '30 August 2023',
    documentRef: 'AFWS-CLT-2023-007'
  },
  {
    id: 'CLT008', clientName: 'Volta River Authority', status: 'Active',
    contactPerson: 'Ekow Asante', jobTitle: 'Security Coordinator', email: 'e.asante@vra.com.gh',
    phone: '030 268 9900', phoneExtension: '55', alternativePhone: '',
    physicalAddress: 'Electro Volta House, High Street', city: 'Accra', region: 'Volta',
    postalCode: 'GA-050', gpsAddress: 'GA-050-1234',
    businessType: 'Government', industrySector: 'Energy',
    tinNumber: 'C0089012345', registrationNumber: 'GH-GOV-00890',
    contractStartDate: '1 April 2024', contractEndDate: '31 March 2026',
    serviceType: 'Armed Guard + CCTV Monitoring', billingCycle: 'Monthly',
    additionalNotes: 'Critical infrastructure. Requires highest clearance level guards.',
    createdBy: 'Kwame Mensah', createdDate: '28 March 2024',
    approvedBy: 'Akosua Frimpong', approvedDate: '30 March 2024',
    documentRef: 'AFWS-CLT-2024-008'
  }
];

@Component({
  selector: 'app-view-client',
  standalone: true,
  imports: [CommonModule, ButtonComponent, BadgeComponent],
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.css']
})
export class ViewClientComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  client: ClientProfile | null = null;
  today = new Date();

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.client = MOCK_CLIENTS.find(c => c.id === id) ?? MOCK_CLIENTS[0];
  }

  print(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/hr/client-management']);
  }

  getStatusClasses(status: string): string {
    if (status === 'Active') return 'border-green-300 bg-green-50 text-green-700';
    return 'border-red-300 bg-red-50 text-red-700';
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
