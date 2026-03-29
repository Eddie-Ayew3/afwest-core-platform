import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  LeaveRequestDto, CreateLeaveRequestDto, ApproveLeaveDto,
  LeaveBalanceDto, LeaveListParams, InitializeLeaveBalanceDto
} from '../models/leave.model';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private base = environment.apiUrl;
  private http = inject(HttpClient);

  getAll(params?: LeaveListParams): Observable<LeaveRequestDto[]> {
    let p = new HttpParams();
    if (params?.status)   p = p.set('status', params.status);
    if (params?.guardId)  p = p.set('guardId', params.guardId);
    return this.http.get<LeaveRequestDto[]>(`${this.base}/leave`, { params: p });
  }

  getPending(): Observable<LeaveRequestDto[]> {
    return this.http.get<LeaveRequestDto[]>(`${this.base}/leave/pending`);
  }

  getById(id: string): Observable<LeaveRequestDto> {
    return this.http.get<LeaveRequestDto>(`${this.base}/leave/${id}`);
  }

  create(dto: CreateLeaveRequestDto): Observable<LeaveRequestDto> {
    return this.http.post<LeaveRequestDto>(`${this.base}/leave`, { dto });
  }

  approve(id: string, dto: ApproveLeaveDto): Observable<LeaveRequestDto> {
    return this.http.post<LeaveRequestDto>(`${this.base}/leave/${id}/approve`, { dto });
  }

  getBalance(userId: string, year?: number): Observable<LeaveBalanceDto[]> {
    let p = new HttpParams();
    if (year) p = p.set('year', year);
    return this.http.get<LeaveBalanceDto[]>(`${this.base}/leave/balance/${userId}`, { params: p });
  }

  initializeBalance(userId: string, dto: InitializeLeaveBalanceDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/leave/balance/${userId}/initialize`, { dto });
  }

  autoInitializeBalance(userId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/leave/balance/auto-initialize/${userId}`, {});
  }
}
