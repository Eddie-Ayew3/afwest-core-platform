export type UserRole =
  | 'Admin'
  | 'ManagingDirector'
  | 'OperationsDirector'
  | 'HRManager'
  | 'ProcurementOfficer'
  | 'ZonalCommander'
  | 'SiteSupervisor'
  | 'Guard';

export type UserScope = 'global' | 'regional' | 'site';

export type GhanaRegion =
  | 'Greater Accra'
  | 'Ashanti'
  | 'Western'
  | 'Central'
  | 'Eastern'
  | 'Volta';

export type GhanaSite =
  | 'Head Office – Accra'
  | 'Tema Industrial'
  | 'Kumasi Branch'
  | 'Takoradi Branch'
  | 'Cape Coast Post'
  | 'Volta Guard Post';

export const REGION_SITES: Record<GhanaRegion, GhanaSite[]> = {
  'Greater Accra': ['Head Office – Accra', 'Tema Industrial'],
  'Ashanti':       ['Kumasi Branch'],
  'Western':       ['Takoradi Branch'],
  'Central':       ['Cape Coast Post'],
  'Eastern':       [],
  'Volta':         ['Volta Guard Post']
};

export const LS = {
  isAuthenticated: 'isAuthenticated',
  userStaffId:     'userStaffId',
  userDisplayName: 'userDisplayName',
  userRole:        'userRole',
  userScope:       'userScope',
  userRegion:      'userRegion',
  userSite:        'userSite'
} as const;

export interface DemoAccount {
  staffId:     string;
  password:    string;
  displayName: string;
  label:       string;
  role:        UserRole;
  scope:       UserScope;
  region?:     GhanaRegion;
  site?:       GhanaSite;
}
