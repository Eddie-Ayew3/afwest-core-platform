import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { InvoiceDto, CreateInvoiceDto, UpdateInvoiceDto } from '../models/invoice.model';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private base = environment.apiUrl;
  private http = inject(HttpClient);

  getAll(params?: { pageNumber?: number; pageSize?: number }): Observable<{ data: InvoiceDto[]; totalRecords: number }> {
    return this.http.get<{ data: InvoiceDto[]; totalRecords: number }>(`${this.base}/invoices`, { params });
  }

  getById(id: string): Observable<InvoiceDto> {
    return this.http.get<InvoiceDto>(`${this.base}/invoices/${id}`);
  }

  create(dto: CreateInvoiceDto): Observable<InvoiceDto> {
    return this.http.post<InvoiceDto>(`${this.base}/invoices`, dto);
  }

  update(id: string, dto: UpdateInvoiceDto): Observable<InvoiceDto> {
    return this.http.put<InvoiceDto>(`${this.base}/invoices/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/invoices/${id}`);
  }

  sendInvoice(id: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/invoices/${id}/send`, {});
  }

  payInvoice(id: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/invoices/${id}/pay`, {});
  }

  cancelInvoice(id: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/invoices/${id}/cancel`, {});
  }
}
