import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  ClientDto, CreateClientDto, UpdateClientDto, ClientListParams,
  PagedResult, ClientStatusActionDto, ClientRegionDto
} from '../models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private base = environment.apiUrl;
  private http = inject(HttpClient);

  getAll(params?: ClientListParams): Observable<PagedResult<ClientDto>> {
    let p = new HttpParams();
    if (params?.pageNumber) p = p.set('pageNumber', params.pageNumber);
    if (params?.pageSize)   p = p.set('pageSize', params.pageSize);
    if (params?.search)     p = p.set('search', params.search);
    if (params?.status)     p = p.set('status', params.status);
    if (params?.isActive !== undefined) p = p.set('isActive', params.isActive);
    return this.http.get<PagedResult<ClientDto>>(`${this.base}/clients`, { params: p });
  }

  getById(id: string): Observable<ClientDto> {
    return this.http.get<ClientDto>(`${this.base}/clients/${id}`);
  }

  create(dto: CreateClientDto): Observable<ClientDto> {
    return this.http.post<ClientDto>(`${this.base}/clients`, dto);
  }

  update(id: string, dto: UpdateClientDto): Observable<ClientDto> {
    return this.http.put<ClientDto>(`${this.base}/clients/${id}`, dto);
  }

  approve(id: string, dto?: ClientStatusActionDto): Observable<ClientDto> {
    return this.http.post<ClientDto>(`${this.base}/clients/${id}/approve`, dto ?? {});
  }

  suspend(id: string, dto?: ClientStatusActionDto): Observable<ClientDto> {
    return this.http.post<ClientDto>(`${this.base}/clients/${id}/suspend`, dto ?? {});
  }

  reinstate(id: string): Observable<ClientDto> {
    return this.http.post<ClientDto>(`${this.base}/clients/${id}/reinstate`, {});
  }

  terminate(id: string, dto?: ClientStatusActionDto): Observable<ClientDto> {
    return this.http.post<ClientDto>(`${this.base}/clients/${id}/terminate`, dto ?? {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/clients/${id}`);
  }

  getRegions(id: string): Observable<ClientRegionDto[]> {
    return this.http.get<ClientRegionDto[]>(`${this.base}/clients/${id}/regions`);
  }

  assignRegion(id: string, regionId: string): Observable<ClientRegionDto> {
    return this.http.post<ClientRegionDto>(`${this.base}/clients/${id}/regions`, { regionId });
  }

  removeRegion(id: string, regionId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/clients/${id}/regions/${regionId}`);
  }
}
