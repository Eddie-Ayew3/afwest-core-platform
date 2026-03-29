import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  StaffDto, CreateStaffDto, UpdateStaffDto, StaffListParams, PagedResult,
  UserAccessDto, ActivateUserDto, AssignRoleDto
} from '../models/staff.model';

@Injectable({ providedIn: 'root' })
export class StaffService {
  private base = environment.apiUrl;
  private http = inject(HttpClient);

  getAll(params?: StaffListParams): Observable<PagedResult<StaffDto>> {
    let p = new HttpParams();
    if (params?.pageNumber) p = p.set('pageNumber', params.pageNumber);
    if (params?.pageSize)   p = p.set('pageSize', params.pageSize);
    if (params?.search)     p = p.set('search', params.search);
    if (params?.isActive !== undefined) p = p.set('isActive', params.isActive);
    return this.http.get<PagedResult<StaffDto>>(`${this.base}/users`, { params: p });
  }

  getById(id: string): Observable<StaffDto> {
    return this.http.get<StaffDto>(`${this.base}/users/${id}`);
  }

  create(dto: CreateStaffDto): Observable<StaffDto> {
    return this.http.post<StaffDto>(`${this.base}/users`, dto);
  }

  update(id: string, dto: UpdateStaffDto): Observable<StaffDto> {
    return this.http.put<StaffDto>(`${this.base}/users/${id}`, dto);
  }

  deactivate(id: string): Observable<void> {
    return this.http.post<void>(`${this.base}/users/${id}/deactivate`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/users/${id}`);
  }

  getAccessList(params?: StaffListParams): Observable<PagedResult<UserAccessDto>> {
    let p = new HttpParams();
    if (params?.pageNumber) p = p.set('pageNumber', params.pageNumber);
    if (params?.pageSize) p = p.set('pageSize', params.pageSize);
    return this.http.get<PagedResult<UserAccessDto>>(`${this.base}/users/access-list`, { params: p });
  }

  activate(id: string, dto: ActivateUserDto): Observable<void> {
    return this.http.post<void>(`${this.base}/users/${id}/activate`, dto);
  }

  assignRole(id: string, dto: AssignRoleDto): Observable<void> {
    return this.http.post<void>(`${this.base}/users/${id}/assign-role`, dto);
  }
}
