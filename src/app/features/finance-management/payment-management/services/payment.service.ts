import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PaymentDto, RecordPaymentDto, PaymentListParams, PagedResult } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private base = environment.apiUrl;
  private http = inject(HttpClient);

  getAll(params?: PaymentListParams): Observable<PagedResult<PaymentDto>> {
    let p = new HttpParams();
    if (params?.pageNumber) p = p.set('pageNumber', params.pageNumber);
    if (params?.pageSize)   p = p.set('pageSize', params.pageSize);
    if (params?.status)     p = p.set('status', params.status);
    if (params?.clientId)   p = p.set('clientId', params.clientId);
    if (params?.startDate)  p = p.set('startDate', params.startDate);
    if (params?.endDate)    p = p.set('endDate', params.endDate);
    return this.http.get<PagedResult<PaymentDto>>(`${this.base}/payments`, { params: p });
  }

  getById(id: string): Observable<PaymentDto> {
    return this.http.get<PaymentDto>(`${this.base}/payments/${id}`);
  }

  record(dto: RecordPaymentDto): Observable<PaymentDto> {
    return this.http.post<PaymentDto>(`${this.base}/payments`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/payments/${id}`);
  }
}
