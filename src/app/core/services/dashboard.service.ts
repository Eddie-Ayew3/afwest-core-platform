import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


export interface DashboardSummary {
  totalGuards: number;
  activeShifts: number;
  scheduledShifts: number;
  guardsOnDuty: number;
  absentToday: number;
  openIncidents: number;
  totalClients: number;
  totalSites: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.base}/dashboard/summary`);
  }
}
