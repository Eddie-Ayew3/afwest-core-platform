import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  IncidentDto, CreateIncidentDto, UpdateIncidentStatusDto,
  IncidentListParams, PagedResult
} from '../models/incident.model';

@Injectable({ providedIn: 'root' })
export class IncidentService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/incidents`;

  getAll(params?: IncidentListParams): Observable<PagedResult<IncidentDto>> {
    let httpParams = new HttpParams();
    if (params?.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber);
    if (params?.pageSize)   httpParams = httpParams.set('pageSize', params.pageSize);
    if (params?.severity)   httpParams = httpParams.set('severity', params.severity);
    if (params?.status)     httpParams = httpParams.set('status', params.status);
    if (params?.siteId)     httpParams = httpParams.set('siteId', params.siteId);
    if (params?.startDate)  httpParams = httpParams.set('startDate', params.startDate);
    if (params?.endDate)    httpParams = httpParams.set('endDate', params.endDate);
    return this.http.get<PagedResult<IncidentDto>>(this.base, { params: httpParams });
  }

  getById(id: string): Observable<IncidentDto> {
    return this.http.get<IncidentDto>(`${this.base}/${id}`);
  }

  create(dto: CreateIncidentDto): Observable<IncidentDto> {
    return this.http.post<IncidentDto>(this.base, dto);
  }

  updateStatus(id: string, dto: UpdateIncidentStatusDto): Observable<IncidentDto> {
    return this.http.patch<IncidentDto>(`${this.base}/${id}/status`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
