import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PermissionDetailDto, PermissionCategoryDto } from '../models/permission.model';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private base = environment.apiUrl;
  private http = inject(HttpClient);

  getAll(): Observable<PermissionDetailDto[]> {
    return this.http.get<PermissionDetailDto[]>(`${this.base}/permissions`);
  }

  getByCategory(): Observable<PermissionCategoryDto[]> {
    return this.http.get<PermissionCategoryDto[]>(`${this.base}/permissions/categories`);
  }
}
