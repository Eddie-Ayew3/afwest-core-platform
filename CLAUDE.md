# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at http://localhost:4200
npm run build      # Production build → dist/
npm test           # Unit tests via Karma + Jasmine
npm run watch      # Watch mode build (development)
ng generate component features/<name>/<name>  # Scaffold new feature component
```

## Architecture

Angular 18 standalone component app — **no NgModules**. Every component declares its own `imports` array.

### Route Structure

```
/sign-in                       → SignInComponent (public)
/reset-password                → ResetPasswordComponent (public)

/ (DashboardLayoutComponent, authGuard)
  /dashboard
  /client-management
  /hr/staff-management
  /hr/leave-management
  /hr/user-management
  /control-unit/shift-management
  /control-unit/check-in-out
  /procurement/supplier-management
  /procurement/logistics-management
  /procurement/petty-cash-management

/client (ClientDashboardLayoutComponent, authGuard)
  /client/dashboard/:id
  /client/request/:id
  /client/site/:id
  /client/shift/:id
  /client/guard/:id
```

### Auth

Auth state is stored in `localStorage` (`isAuthenticated`, `userStaffId`, `userName`). The `authGuard` (`src/app/guards/auth.guard.ts`) checks this. No backend connected yet — all auth is local.

### Layouts

Two layout shells with sidebars:
- `src/app/layout/main-dashboard-layout/` — main app shell with collapsible sidebar, breadcrumbs, and router outlet
- `src/app/layout/client-dashboard-layout/` — client-specific shell; sidebar URLs are dynamically updated with the client `:id` param

### UI Library — Tolle UI (`@tolle_/tolle-ui`)

Config-first Angular component library. Configured in `app.config.ts`:
```typescript
provideTolleConfig({ primaryColor: '#f14444ff', radius: '0.5rem', darkByDefault: false })
```

**Common imports used across feature components:**
```typescript
import {
  ButtonComponent, BadgeComponent, InputComponent, LabelComponent,
  SelectComponent, SelectItemComponent, PaginationComponent,
  DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
  CardComponent, CardContentComponent, EmptyStateComponent,
  SheetComponent, SheetContentComponent,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  ModalService, TextareaComponent, DatePickerComponent
} from '@tolle_/tolle-ui';
```

**Key patterns:**
- Badges use inline `[style.background]` and `[style.color]` for custom colors (see any feature component)
- Dropdowns use `[tolleDropdownTrigger]="ref"` on a button + `<tolle-dropdown-menu #ref>`
- Tooltips: `tolleTooltip="text" placement="top"` directive on any element
- Modals: inject `ModalService` and call `modalService.open({ title, content, ... })`
- Sheets (side panels): `<tolle-sheet [(isOpen)]="flag" side="right">` with `<tolle-sheet-content>`
- Pagination: `[totalRecords]` `[currentPage]` `[currentPageSize]` `(pageChange)` — page events carry `.detail` or `.page`

**Icons:** Remix Icons via `@ng-icons/remixicon`. Use `<i class="ri-*-line">` in templates.

### Styling

Tailwind CSS v3 + `postcss.config.js`. No global component styles — use Tailwind utility classes directly in templates. Tolle UI exposes CSS variables for theming (`bg-background`, `border-border`, `text-muted-foreground`, `bg-primary/10`, etc.).

## Feature Component Conventions

All fully-implemented feature components follow this consistent pattern — use it for any new features:

**TypeScript:**
1. Define a typed interface for the data model
2. Hard-code mock data array in the component class
3. Maintain `filteredX[]` and `displayedX[]` arrays for search/filter/pagination
4. `applyFiltersAndPagination()` — single method that handles all three
5. `onSearch()` — debounces (300ms) then calls `applyFiltersAndPagination()`
6. `onPageChange(event)` — handles both `number` and `CustomEvent` (use `(event as any).detail || (event as any).page || 1`)
7. Color helpers: `getStatusBg(status)` / `getStatusFg(status)` returning rgba/hex strings
8. `inject(ModalService)` for detail popups with HTML template strings

**HTML structure:**
```
<div class="flex h-full bg-background">
  <div class="flex-1 p-8 overflow-auto">
    <tolle-breadcrumb>...</tolle-breadcrumb>        <!-- nav trail -->
    <div class="flex justify-between ...">          <!-- page header + CTA button -->
    <div class="grid grid-cols-4 gap-4 mb-6">      <!-- stat cards -->
    <div class="flex justify-between ... mb-4">    <!-- search + filter bar -->
    <div *ngIf="showFilterPanel" ...>              <!-- collapsible filter panel -->
    <tolle-card>
      <tolle-card-content class="p-0">
        <table ...> *ngIf="displayedX.length > 0"  <!-- data table -->
        <tolle-empty-state> *ngIf="...length === 0" <!-- empty state -->
        <div class="border-t ... p-4 flex ...">    <!-- pagination footer -->
      </tolle-card-content>
    </tolle-card>
  </div>
</div>
<tolle-sheet ...>...</tolle-sheet>                 <!-- create/edit side panel -->
```

## Mock Data Context

The platform is a **Ghana-based security company** management system. All mock data uses:
- Ghanaian names (Kwame, Ama, Kofi, Abena, Yaw, Akosua, Nana, Efua, etc.)
- Ghana locations: Greater Accra, Ashanti, Western, Central, Eastern, Volta, Northern, Upper East/West
- Site names: Head Office – Accra, Kumasi Branch, Takoradi Branch, Tema Industrial, Cape Coast Post
- Currency: GHS (₵) for financial figures
- Staff IDs: `GD-001` format; Shift codes: `SH-001`; Supplier codes: `SUP-001`; Tracking: `TRK-2025-001`; Petty cash refs: `PC-2025-001`

## Backend Integration Notes

When connecting the backend, replace mock arrays with HTTP service calls. The app already has `provideHttpClient(withInterceptors([]))` configured in `app.config.ts` — add auth interceptors there. The `authGuard` should be updated to validate JWT tokens instead of checking `localStorage.isAuthenticated`.
