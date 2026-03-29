import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegionDto, CreateRegionDto, UpdateRegionDto, PagedResult, AssignUserToRegionDto } from '../models/region.model';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RegionService {
  private base = environment.apiUrl;
  private http = inject(HttpClient);

  getAll(params?: { pageNumber?: number; pageSize?: number; isActive?: boolean }): Observable<PagedResult<RegionDto>> {
    let httpParams = new HttpParams();
    if (params?.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params?.isActive !== undefined) httpParams = httpParams.set('isActive', params.isActive);
    return this.http.get<PagedResult<RegionDto>>(`${this.base}/regions`, { params: httpParams });
  }

  getById(id: string): Observable<RegionDto> {
    return this.http.get<RegionDto>(`${this.base}/regions/${id}`);
  }

  create(dto: CreateRegionDto): Observable<RegionDto> {
    return this.http.post<RegionDto>(`${this.base}/regions`, dto);
  }

  update(id: string, dto: UpdateRegionDto): Observable<RegionDto> {
    return this.http.put<RegionDto>(`${this.base}/regions/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/regions/${id}`);
  }

  assignUser(id: string, dto: AssignUserToRegionDto): Observable<void> {
    return this.http.post<void>(`${this.base}/regions/${id}/assign-user`, dto);
  }
}
