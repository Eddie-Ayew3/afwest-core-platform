import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  UserDto, UserAccessDto, ActivateUserDto, AssignRoleDto,
  UserListParams, PagedResult
} from '../models/user-mgmt.model';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserMgmtService {
  private base = environment.apiUrl;
  private http = inject(HttpClient);

  getAll(params?: UserListParams): Observable<PagedResult<UserDto>> {
    let p = new HttpParams();
    if (params?.pageNumber) p = p.set('pageNumber', params.pageNumber);
    if (params?.pageSize)   p = p.set('pageSize', params.pageSize);
    if (params?.search)     p = p.set('search', params.search);
    if (params?.isActive !== undefined) p = p.set('isActive', params.isActive);
    return this.http.get<PagedResult<UserDto>>(`${this.base}/users`, { params: p });
  }

  getById(id: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.base}/users/${id}`);
  }

  getAccessList(): Observable<UserAccessDto[]> {
    return this.http.get<UserAccessDto[]>(`${this.base}/users/access-list`);
  }

  activate(id: string, dto: ActivateUserDto): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.base}/users/${id}/activate`, dto);
  }

  deactivate(id: string): Observable<void> {
    return this.http.post<void>(`${this.base}/users/${id}/deactivate`, {});
  }

  assignRole(id: string, dto: AssignRoleDto): Observable<void> {
    return this.http.post<void>(`${this.base}/users/${id}/assign-role`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/users/${id}`);
  }
}
