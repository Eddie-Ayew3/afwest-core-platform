import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PayrollRecordDto, CreatePayrollRecordDto, UpdatePayrollRecordDto } from '../models/payroll.model';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PayrollService {
  private base = environment.apiUrl;
  private http = inject(HttpClient);

  getAll(params?: { pageNumber?: number; pageSize?: number }): Observable<{ data: PayrollRecordDto[]; totalRecords: number }> {
    return this.http.get<{ data: PayrollRecordDto[]; totalRecords: number }>(`${this.base}/payroll`, { params });
  }

  getById(id: string): Observable<PayrollRecordDto> {
    return this.http.get<PayrollRecordDto>(`${this.base}/payroll/${id}`);
  }

  create(dto: CreatePayrollRecordDto): Observable<PayrollRecordDto> {
    return this.http.post<PayrollRecordDto>(`${this.base}/payroll`, dto);
  }

  update(id: string, dto: UpdatePayrollRecordDto): Observable<PayrollRecordDto> {
    return this.http.put<PayrollRecordDto>(`${this.base}/payroll/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/payroll/${id}`);
  }

  processPayroll(id: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/payroll/${id}/process`, {});
  }

  payPayroll(id: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/payroll/${id}/pay`, {});
  }
}
