import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ShiftDto, CreateShiftDto, UpdateShiftDto,
  ManualCheckInDto, ManualCheckOutDto,
  ShiftListParams
} from '../models/shift.model';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ShiftService {
  private base = environment.apiUrl;
  private http = inject(HttpClient);

  getAll(params: ShiftListParams = {}): Observable<{ data: ShiftDto[]; totalRecords: number; pageNumber: number; pageSize: number }> {
    let httpParams = new HttpParams();
    if (params.pageNumber != null) httpParams = httpParams.set('pageNumber', params.pageNumber);
    if (params.pageSize != null) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params.status != null) httpParams = httpParams.set('status', params.status);
    if (params.guardId != null) httpParams = httpParams.set('guardId', params.guardId);
    if (params.siteId != null) httpParams = httpParams.set('siteId', params.siteId);
    if (params.startDate != null) httpParams = httpParams.set('startDate', params.startDate);
    if (params.endDate != null) httpParams = httpParams.set('endDate', params.endDate);
    return this.http.get<{ data: ShiftDto[]; totalRecords: number; pageNumber: number; pageSize: number }>(`${this.base}/shifts`, { params: httpParams });
  }

  getById(id: string): Observable<ShiftDto> {
    return this.http.get<ShiftDto>(`${this.base}/shifts/${id}`);
  }

  create(dto: CreateShiftDto): Observable<ShiftDto> {
    return this.http.post<ShiftDto>(`${this.base}/shifts`, dto);
  }

  update(id: string, dto: UpdateShiftDto): Observable<ShiftDto> {
    return this.http.put<ShiftDto>(`${this.base}/shifts/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/shifts/${id}`);
  }

  startShift(id: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/shifts/${id}/start`, {});
  }

  completeShift(id: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/shifts/${id}/complete`, {});
  }

  cancelShift(id: string, reason?: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/shifts/${id}/cancel`, { reason });
  }

  markMissed(id: string, reason?: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/shifts/${id}/mark-missed`, { reason });
  }

  manualCheckIn(id: string, dto: ManualCheckInDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/shifts/${id}/manual-check-in`, dto);
  }

  manualCheckOut(id: string, dto: ManualCheckOutDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/shifts/${id}/manual-check-out`, dto);
  }
}
