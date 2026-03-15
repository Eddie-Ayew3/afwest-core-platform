and backend developers separately.
Frontend_Implementation.md
name: Frontend Implementation (Angular 18+)
description: Comprehensive guide for implementing Angular frontend applications with best practices and project structure

Frontend Implementation Skill
Overview
This document provides a structured approach to implementing Angular frontend applications that integrate with .NET backend APIs. It covers architecture patterns, project structure, and implementation best practices for Angular 18+.

Technology Stack
Frontend: Angular 18+ with standalone components

Styling: Tailwind CSS (optional but recommended)

State Management: NgRx, standalone services, or signals (as needed)

HTTP Client: Angular's HttpClient with interceptors

When to Use This Document
Implementing a new Angular frontend for a .NET backend

Setting up Angular project structure following best practices

Creating reusable components and services

Configuring Angular for production deployment

Core Implementation Phases
Phase 1: Architecture Planning
1.1 Choose Frontend Architecture Pattern
For Angular frontend, recommend Feature-Sliced Architecture:

Core Module: Singleton services, guards, interceptors

Shared Module: Reusable components, pipes, directives

Feature Modules: Self-contained business domains

1.2 Define Frontend Project Structure
Frontend Structure (Angular):

text
frontend/
├── src/
│   ├── app/
│   │   ├── core/                # Singleton services, guards
│   │   ├── shared/              # Reusable components
│   │   ├── features/            # Feature modules
│   │   │   └── [feature-name]/
│   │   │       ├── components/  # Presentational components
│   │   │       ├── pages/       # Routed containers
│   │   │       ├── services/    # Feature-specific services
│   │   │       ├── models/      # TypeScript interfaces
│   │   │       └── store/       # NgRx state (if used)
│   │   ├── layout/              # Layout components
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── assets/
│   ├── styles.css
│   └── environments/
├── angular.json
├── tsconfig.json
└── tailwind.config.js
Phase 2: Frontend Initialization (Angular)
2.1 Create Angular Application
bash
# Create new Angular app with standalone components
ng new frontend --routing --style=css --standalone

cd frontend

# Install Tailwind CSS (optional but recommended)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
2.2 Configure Tailwind CSS (if using)
Update tailwind.config.js:

javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
Update src/styles.css:

css
@tailwind base;
@tailwind components;
@tailwind utilities;
2.3 Set Up Environment Configuration
Create src/environments/environment.ts:

typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7000/api/v1'
};
Create src/environments/environment.prod.ts:

typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourproduction.com/api/v1'
};
2.4 Create Core Services
Create src/app/core/services/api.service.ts:

typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`);
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data);
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`);
  }
}
2.5 Configure HTTP Interceptor (for JWT)
Create src/app/core/interceptors/auth.interceptor.ts:

typescript
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};
Register in app.config.ts:

typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
Phase 3: Frontend Version Control
3.1 Create .gitignore (Frontend)
In frontend/ directory:

gitignore
# Angular
/node_modules
/dist
/.angular/cache

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
Phase 4: Frontend CI/CD Setup
4.1 Set Up CI/CD Pipeline
Create .github/workflows/angular.yml:

yaml
name: Angular Frontend CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
    
    - name: Install dependencies
      working-directory: ./frontend
      run: npm ci
    
    - name: Lint
      working-directory: ./frontend
      run: npm run lint
    
    - name: Build
      working-directory: ./frontend
      run: npm run build
    
    - name: Test
      working-directory: ./frontend
      run: npm run test -- --watch=false --browsers=ChromeHeadless
Phase 5: Frontend Implementation
5.1 Create Angular Feature
Create frontend/src/app/features/products/models/product.model.ts:

typescript
export interface Product {
  id: number;
  name: string;
  price: number;
  createdAt: Date;
}
Create frontend/src/app/features/products/services/product.service.ts:

typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private endpoint = 'products';

  constructor(private api: ApiService) {}

  getAll(): Observable<Product[]> {
    return this.api.get<Product[]>(this.endpoint);
  }

  getById(id: number): Observable<Product> {
    return this.api.get<Product>(`${this.endpoint}/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.api.post<Product>(this.endpoint, product);
  }

  update(id: number, product: Product): Observable<void> {
    return this.api.put<void>(`${this.endpoint}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
Create frontend/src/app/features/products/pages/product-list/product-list.component.ts:

typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-4">Products</h1>
      <div class="grid gap-4">
        @for (product of products; track product.id) {
          <div class="border p-4 rounded">
            <h2 class="text-xl font-semibold">{{ product.name }}</h2>
            <p class="text-gray-600">\${{ product.price }}</p>
          </div>
        }
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe(products => {
      this.products = products;
    });
  }
}
Update routes in app.routes.ts:

typescript
import { Routes } from '@angular/router';
import { ProductListComponent } from './features/products/pages/product-list/product-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent }
];
5.2 Run Angular Development Server
bash
# From frontend directory
npm start
# App will run on http://localhost:4200
Phase 6: Frontend Best Practices
✅ DO:
Follow Angular style guide - Use standalone components (Angular 18+)

Implement lazy loading - Load feature modules on demand

Use TypeScript strict mode - Catch errors at compile time

Create reusable components - Keep components focused and single-purpose

Use reactive patterns - Leverage RxJS for async operations

Implement proper error handling - Use interceptors for global error handling

Unsubscribe from observables - Use async pipe or takeUntil pattern

Use environment files - Store configuration per environment

Implement route guards - Protect routes based on authentication

Write unit tests - Test components and services

❌ DON'T:
Don't use any type - Defeats purpose of TypeScript

Don't subscribe in services - Return observables, subscribe in components

Don't mutate state directly - Use immutable patterns

Don't put business logic in components - Keep components focused on presentation

Don't ignore memory leaks - Always handle subscription cleanup

Don't hardcode API URLs - Use environment configuration

Don't skip lazy loading - Impacts initial bundle size

Don't store sensitive data in localStorage - Use secure mechanisms

Phase 7: Frontend Troubleshooting
Frontend Issues
Issue: API calls fail with 404

typescript
// Solution: Check environment.ts has correct API URL
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7000/api/v1' // Match your backend port
};
Issue: Tailwind classes not working

bash
# Solution: Ensure tailwind.config.js content paths are correct
# Run: npm run build
# Restart dev server: npm start
Issue: HttpClient errors

typescript
// Solution: Ensure provideHttpClient is in app.config.ts
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    // other providers
  ]
};
Issue: CORS errors

typescript
// Solution: Backend must be configured to allow your frontend origin
// In .NET backend Program.cs:
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
Phase 8: Frontend Validation Checklist
Before considering frontend implementation complete, verify:

Angular app compiles without errors (npm run build)

Development server runs on port 4200

API endpoints can be called from Angular (CORS configured)

Sample CRUD operations work end-to-end

Environment variables properly configured for all environments

Linting passes (npm run lint)

Unit tests pass (npm test)

Lazy loading implemented for feature modules

Route guards implemented for protected routes

Error handling interceptors configured

Authentication interceptor configured

Production build runs successfully

Tailwind CSS (if used) styles are applied correctly

Phase 9: Frontend Commands Reference
bash
cd frontend

# Development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint

# Generate a new component
ng generate component features/products/components/product-card --standalone

# Generate a new service
ng generate service features/products/services/product

# Generate a new interface
ng generate interface features/products/models/product
Success Criteria
The frontend is successfully implemented when:

A new developer can clone and run the frontend within 5 minutes

All API integrations work correctly with the backend

All tests pass in CI/CD pipeline

Code follows Angular best practices and style guide

Lazy loading is implemented for optimal performance

Environment configuration works across development and production