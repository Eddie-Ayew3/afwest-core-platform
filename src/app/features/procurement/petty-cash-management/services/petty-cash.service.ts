import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PettyCashDto, CreatePettyCashDto, ApprovePettyCashDto, PettyCashListParams, PagedResult } from '../models/petty-cash.model';

@Injectable({ providedIn: 'root' })
export class PettyCashService {
  private base = environment.apiUrl;
  private http = inject(HttpClient);

  getAll(params?: PettyCashListParams): Observable<PagedResult<PettyCashDto>> {
    let p = new HttpParams();
    if (params?.pageNumber) p = p.set('pageNumber', params.pageNumber);
    if (params?.pageSize)   p = p.set('pageSize', params.pageSize);
    if (params?.status)     p = p.set('status', params.status);
    if (params?.type)       p = p.set('type', params.type);
    if (params?.site)       p = p.set('site', params.site);
    if (params?.startDate)  p = p.set('startDate', params.startDate);
    if (params?.endDate)    p = p.set('endDate', params.endDate);
    return this.http.get<PagedResult<PettyCashDto>>(`${this.base}/petty-cash`, { params: p });
  }

  getById(id: string): Observable<PettyCashDto> {
    return this.http.get<PettyCashDto>(`${this.base}/petty-cash/${id}`);
  }

  create(dto: CreatePettyCashDto): Observable<PettyCashDto> {
    return this.http.post<PettyCashDto>(`${this.base}/petty-cash`, dto);
  }

  approve(id: string, dto: ApprovePettyCashDto): Observable<PettyCashDto> {
    return this.http.post<PettyCashDto>(`${this.base}/petty-cash/${id}/approve`, dto);
  }

  reject(id: string): Observable<PettyCashDto> {
    return this.http.post<PettyCashDto>(`${this.base}/petty-cash/${id}/reject`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/petty-cash/${id}`);
  }
}
