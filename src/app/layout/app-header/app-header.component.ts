import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PopoverComponent, PopoverContentComponent, ButtonComponent, AvatarComponent, AvatarFallbackComponent } from '@tolle_/tolle-ui';
import { PermissionsService } from '../../core/services/permissions.service';
import { LS } from '../../core/models/rbac.models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent, PopoverComponent, PopoverContentComponent, AvatarComponent, AvatarFallbackComponent],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.css'
})
export class AppHeaderComponent {
  private permissions = inject(PermissionsService);
  private router = inject(Router);

  get userName()    { return this.permissions.displayName; }
  get userRole()    { return this.permissions.role; }
  get userStaffId() { return this.permissions.staffId; }

  logout(): void {
    Object.values(LS).forEach(key => localStorage.removeItem(key));
    this.router.navigate(['/sign-in']);
  }
}
