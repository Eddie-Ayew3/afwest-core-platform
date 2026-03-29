import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { SlaRecordDto, SlaListParams, PagedResult } from '../models/sla-report.model';

@Injectable({ providedIn: 'root' })
export class SlaReportService {
  private base = environment.apiUrl;
  private http = inject(HttpClient);

  getAll(params?: SlaListParams): Observable<PagedResult<SlaRecordDto>> {
    let p = new HttpParams();
    if (params?.pageNumber) p = p.set('pageNumber', params.pageNumber);
    if (params?.pageSize)   p = p.set('pageSize', params.pageSize);
    if (params?.status)     p = p.set('status', params.status);
    if (params?.clientId)   p = p.set('clientId', params.clientId);
    if (params?.period)     p = p.set('period', params.period);
    return this.http.get<PagedResult<SlaRecordDto>>(`${this.base}/sla-reports`, { params: p });
  }

  getById(id: string): Observable<SlaRecordDto> {
    return this.http.get<SlaRecordDto>(`${this.base}/sla-reports/${id}`);
  }
}
