import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SiteInspectionDto, CreateSiteInspectionDto, UpdateSiteInspectionDto } from '../models/site-inspection.model';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SiteInspectionService {
  private base = environment.apiUrl;
  private http = inject(HttpClient);

  getAll(params?: { pageNumber?: number; pageSize?: number }): Observable<{ data: SiteInspectionDto[]; totalRecords: number }> {
    return this.http.get<{ data: SiteInspectionDto[]; totalRecords: number }>(`${this.base}/site-inspections`, { params });
  }

  getById(id: string): Observable<SiteInspectionDto> {
    return this.http.get<SiteInspectionDto>(`${this.base}/site-inspections/${id}`);
  }

  create(dto: CreateSiteInspectionDto): Observable<SiteInspectionDto> {
    return this.http.post<SiteInspectionDto>(`${this.base}/site-inspections`, dto);
  }

  update(id: string, dto: UpdateSiteInspectionDto): Observable<SiteInspectionDto> {
    return this.http.put<SiteInspectionDto>(`${this.base}/site-inspections/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/site-inspections/${id}`);
  }

  startInspection(id: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/site-inspections/${id}/start`, {});
  }

  completeInspection(id: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/site-inspections/${id}/complete`, {});
  }

  cancelInspection(id: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/site-inspections/${id}/cancel`, {});
  }
}
