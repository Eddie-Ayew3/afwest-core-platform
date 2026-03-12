import { DemoAccount } from '../models/rbac.models';

export const DEMO_ACCOUNTS: DemoAccount[] = [
  // ── Global roles ──────────────────────────────────────────
  {
    staffId: 'ADM-001', password: 'admin123',
    displayName: 'Kwame Asare',
    label: 'ADM-001 — Admin (Global)',
    role: 'Admin', scope: 'global'
  },
  {
    staffId: 'GM-001', password: 'admin123',
    displayName: 'Ama Ofori',
    label: 'GM-001 — General Manager (Global)',
    role: 'GeneralManager', scope: 'global'
  },
  {
    staffId: 'MD-001', password: 'admin123',
    displayName: 'Ama Boateng',
    label: 'MD-001 — Managing Director (Global)',
    role: 'ManagingDirector', scope: 'global'
  },
  {
    staffId: 'OD-001', password: 'admin123',
    displayName: 'Kofi Mensah',
    label: 'OD-001 — Operations Director (Global)',
    role: 'OperationsDirector', scope: 'global'
  },
  {
    staffId: 'HR-001', password: 'admin123',
    displayName: 'Abena Osei',
    label: 'HR-001 — HR Manager (Global)',
    role: 'HRManager', scope: 'global'
  },
  {
    staffId: 'PRO-001', password: 'admin123',
    displayName: 'Yaw Darko',
    label: 'PRO-001 — Procurement Officer (Global)',
    role: 'ProcurementOfficer', scope: 'global'
  },

  // ── Zonal Commanders (regional) ───────────────────────────
  {
    staffId: 'ZC-ACC-001', password: 'zone123',
    displayName: 'Akosua Frimpong',
    label: 'ZC-ACC-001 — Zonal Commander (Greater Accra)',
    role: 'ZonalCommander', scope: 'regional', region: 'Greater Accra'
  },
  {
    staffId: 'ZC-ASH-001', password: 'zone123',
    displayName: 'Nana Acheampong',
    label: 'ZC-ASH-001 — Zonal Commander (Ashanti)',
    role: 'ZonalCommander', scope: 'regional', region: 'Ashanti'
  },
  {
    staffId: 'ZC-WES-001', password: 'zone123',
    displayName: 'Efua Asante',
    label: 'ZC-WES-001 — Zonal Commander (Western)',
    role: 'ZonalCommander', scope: 'regional', region: 'Western'
  },

  // ── Site Supervisors ──────────────────────────────────────
  {
    staffId: 'SS-HO-001', password: 'site123',
    displayName: 'Kweku Baffoe',
    label: 'SS-HO-001 — Site Supervisor (Head Office)',
    role: 'SiteSupervisor', scope: 'site', region: 'Greater Accra', site: 'Head Office – Accra'
  },
  {
    staffId: 'SS-KU-001', password: 'site123',
    displayName: 'Adwoa Kyei',
    label: 'SS-KU-001 — Site Supervisor (Kumasi Branch)',
    role: 'SiteSupervisor', scope: 'site', region: 'Ashanti', site: 'Kumasi Branch'
  },

  // ── Guards ────────────────────────────────────────────────
  {
    staffId: 'GD-HO-001', password: 'guard123',
    displayName: 'Kojo Agyemang',
    label: 'GD-HO-001 — Guard (Head Office)',
    role: 'Guard', scope: 'site', region: 'Greater Accra', site: 'Head Office – Accra'
  },
  {
    staffId: 'GD-TI-001', password: 'guard123',
    displayName: 'Akua Tetteh',
    label: 'GD-TI-001 — Guard (Tema Industrial)',
    role: 'Guard', scope: 'site', region: 'Greater Accra', site: 'Tema Industrial'
  }
];
