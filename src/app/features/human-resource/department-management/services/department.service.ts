import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DepartmentDto, CreateDepartmentDto, UpdateDepartmentDto } from '../models/department.model';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private base = environment.apiUrl;
  private http = inject(HttpClient);

  getAll(params?: { isActive?: boolean }): Observable<DepartmentDto[]> {
    let httpParams = new HttpParams();
    if (params?.isActive !== undefined) httpParams = httpParams.set('isActive', params.isActive);
    return this.http.get<DepartmentDto[]>(`${this.base}/departments`, { params: httpParams });
  }

  getById(id: string): Observable<DepartmentDto> {
    return this.http.get<DepartmentDto>(`${this.base}/departments/${id}`);
  }

  create(dto: CreateDepartmentDto): Observable<DepartmentDto> {
    return this.http.post<DepartmentDto>(`${this.base}/departments`, dto);
  }

  update(id: string, dto: UpdateDepartmentDto): Observable<DepartmentDto> {
    return this.http.put<DepartmentDto>(`${this.base}/departments/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/departments/${id}`);
  }
}
