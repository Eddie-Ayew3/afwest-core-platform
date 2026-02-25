import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverComponent, PopoverContentComponent, ButtonComponent, AvatarComponent, AvatarFallbackComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent, PopoverComponent, PopoverContentComponent, AvatarComponent, AvatarFallbackComponent],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.css'
})
export class AppHeaderComponent {
  userEmail = 'john.doe@example.com';
  userName = 'John Doe';
  userRole = 'Designer';
  userAvatar = 'https://github.com/nutlope.png';
  
  logout(): void {
    console.log('Logging out...');
    // Add logout logic here
  }
}
