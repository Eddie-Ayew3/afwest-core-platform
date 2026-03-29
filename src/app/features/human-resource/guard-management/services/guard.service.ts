import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  GuardDto, CreateGuardDto, UpdateGuardDto, GuardListParams, PagedResult,
  GuardAssignmentDto, AssignGuardDto, TransferGuardDto, GuardPerformanceDto,
  SubmitPerformanceReviewDto, GuardStatusActionDto, EndAssignmentDto
} from '../models/guard.model';

@Injectable({ providedIn: 'root' })
export class GuardService {
  private base = environment.apiUrl;
  private http = inject(HttpClient);

  getAll(params?: GuardListParams): Observable<PagedResult<GuardDto>> {
    let p = new HttpParams();
    if (params?.pageNumber) p = p.set('pageNumber', params.pageNumber);
    if (params?.pageSize)   p = p.set('pageSize', params.pageSize);
    if (params?.search)     p = p.set('search', params.search);
    if (params?.status)     p = p.set('status', params.status);
    if (params?.siteId)     p = p.set('siteId', params.siteId);
    if (params?.regionId)   p = p.set('regionId', params.regionId);
    return this.http.get<PagedResult<GuardDto>>(`${this.base}/guards`, { params: p });
  }

  getById(id: string): Observable<GuardDto> {
    return this.http.get<GuardDto>(`${this.base}/guards/${id}`);
  }

  create(dto: CreateGuardDto): Observable<GuardDto> {
    return this.http.post<GuardDto>(`${this.base}/guards`, dto);
  }

  update(id: string, dto: UpdateGuardDto): Observable<GuardDto> {
    return this.http.put<GuardDto>(`${this.base}/guards/${id}`, dto);
  }

  approve(id: string): Observable<GuardDto> {
    return this.http.post<GuardDto>(`${this.base}/guards/${id}/approve`, {});
  }

  reject(id: string, dto?: GuardStatusActionDto): Observable<GuardDto> {
    return this.http.post<GuardDto>(`${this.base}/guards/${id}/reject`, dto ?? {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/guards/${id}`);
  }

  assign(id: string, dto: AssignGuardDto): Observable<GuardAssignmentDto> {
    return this.http.post<GuardAssignmentDto>(`${this.base}/guards/${id}/assign`, dto);
  }

  transfer(id: string, dto: TransferGuardDto): Observable<GuardAssignmentDto> {
    return this.http.post<GuardAssignmentDto>(`${this.base}/guards/${id}/transfer`, dto);
  }

  endAssignment(id: string, dto: EndAssignmentDto): Observable<void> {
    return this.http.post<void>(`${this.base}/guards/${id}/end-assignment`, dto);
  }

  getAssignments(id: string): Observable<GuardAssignmentDto[]> {
    return this.http.get<GuardAssignmentDto[]>(`${this.base}/guards/${id}/assignments`);
  }

  getPerformance(id: string): Observable<GuardPerformanceDto> {
    return this.http.get<GuardPerformanceDto>(`${this.base}/guards/${id}/performance`);
  }

  submitPerformanceReview(id: string, dto: SubmitPerformanceReviewDto): Observable<GuardPerformanceDto> {
    return this.http.post<GuardPerformanceDto>(`${this.base}/guards/${id}/performance-review`, dto);
  }
}
