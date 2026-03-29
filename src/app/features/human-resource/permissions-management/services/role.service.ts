import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoleDto, CreateRoleDto, UpdateRoleDto, SetRolePermissionsDto, RoleListParams, PagedResult } from '../models/role.model';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private base = environment.apiUrl;
  private http = inject(HttpClient);

  getAll(params?: RoleListParams): Observable<PagedResult<RoleDto>> {
    let p = new HttpParams();
    if (params?.pageNumber) p = p.set('pageNumber', params.pageNumber);
    if (params?.pageSize)   p = p.set('pageSize', params.pageSize);
    if (params?.isActive !== undefined) p = p.set('isActive', params.isActive);
    return this.http.get<PagedResult<RoleDto>>(`${this.base}/roles`, { params: p });
  }

  getById(id: string): Observable<RoleDto> {
    return this.http.get<RoleDto>(`${this.base}/roles/${id}`);
  }

  create(dto: CreateRoleDto): Observable<RoleDto> {
    return this.http.post<RoleDto>(`${this.base}/roles`, dto);
  }

  update(id: string, dto: UpdateRoleDto): Observable<RoleDto> {
    return this.http.put<RoleDto>(`${this.base}/roles/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/roles/${id}`);
  }

  setPermissions(id: string, dto: SetRolePermissionsDto): Observable<RoleDto> {
    return this.http.put<RoleDto>(`${this.base}/roles/${id}/permissions`, dto);
  }

  grantPermission(id: string, permissionId: string): Observable<void> {
    return this.http.post<void>(`${this.base}/roles/${id}/permissions/${permissionId}`, {});
  }

  revokePermission(id: string, permissionId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/roles/${id}/permissions/${permissionId}`);
  }
}
