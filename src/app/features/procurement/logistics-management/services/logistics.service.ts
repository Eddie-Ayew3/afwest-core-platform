import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ShipmentDto, CreateShipmentDto, UpdateShipmentStatusDto, ShipmentListParams, PagedResult } from '../models/logistics.model';

@Injectable({ providedIn: 'root' })
export class LogisticsService {
  private base = environment.apiUrl;
  private http = inject(HttpClient);

  getAll(params?: ShipmentListParams): Observable<PagedResult<ShipmentDto>> {
    let p = new HttpParams();
    if (params?.pageNumber) p = p.set('pageNumber', params.pageNumber);
    if (params?.pageSize)   p = p.set('pageSize', params.pageSize);
    if (params?.search)     p = p.set('search', params.search);
    if (params?.status)     p = p.set('status', params.status);
    if (params?.priority)   p = p.set('priority', params.priority);
    return this.http.get<PagedResult<ShipmentDto>>(`${this.base}/shipments`, { params: p });
  }

  getById(id: string): Observable<ShipmentDto> {
    return this.http.get<ShipmentDto>(`${this.base}/shipments/${id}`);
  }

  create(dto: CreateShipmentDto): Observable<ShipmentDto> {
    return this.http.post<ShipmentDto>(`${this.base}/shipments`, dto);
  }

  updateStatus(id: string, dto: UpdateShipmentStatusDto): Observable<ShipmentDto> {
    return this.http.patch<ShipmentDto>(`${this.base}/shipments/${id}/status`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/shipments/${id}`);
  }
}
