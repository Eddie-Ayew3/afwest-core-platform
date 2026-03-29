export type UserRole =
  | 'Admin'
  | 'GeneralManager'
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
  accessToken:     'access_token',
  refreshToken:    'refresh_token',
  userId:          'userId',
  userStaffId:     'userStaffId',
  userEmail:       'userEmail',
  userDisplayName: 'userDisplayName',
  userFullName:    'userFullName',
  userRole:        'userRole',
  userScope:       'userScope',
  userRegion:      'userRegion',
  userSite:        'userSite',
  userPermissions: 'userPermissions',
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
