import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { SupplierDto, CreateSupplierDto, UpdateSupplierDto, SupplierListParams, PagedResult } from '../models/supplier.model';

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private base = environment.apiUrl;
  private http = inject(HttpClient);

  getAll(params?: SupplierListParams): Observable<PagedResult<SupplierDto>> {
    let p = new HttpParams();
    if (params?.pageNumber) p = p.set('pageNumber', params.pageNumber);
    if (params?.pageSize)   p = p.set('pageSize', params.pageSize);
    if (params?.search)     p = p.set('search', params.search);
    if (params?.status)     p = p.set('status', params.status);
    if (params?.tier)       p = p.set('tier', params.tier);
    if (params?.category)   p = p.set('category', params.category);
    return this.http.get<PagedResult<SupplierDto>>(`${this.base}/suppliers`, { params: p });
  }

  getById(id: string): Observable<SupplierDto> {
    return this.http.get<SupplierDto>(`${this.base}/suppliers/${id}`);
  }

  create(dto: CreateSupplierDto): Observable<SupplierDto> {
    return this.http.post<SupplierDto>(`${this.base}/suppliers`, dto);
  }

  update(id: string, dto: UpdateSupplierDto): Observable<SupplierDto> {
    return this.http.put<SupplierDto>(`${this.base}/suppliers/${id}`, dto);
  }

  activate(id: string): Observable<SupplierDto> {
    return this.http.patch<SupplierDto>(`${this.base}/suppliers/${id}/activate`, {});
  }

  deactivate(id: string): Observable<SupplierDto> {
    return this.http.patch<SupplierDto>(`${this.base}/suppliers/${id}/deactivate`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/suppliers/${id}`);
  }
}
