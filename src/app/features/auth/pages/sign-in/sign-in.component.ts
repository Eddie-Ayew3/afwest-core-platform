import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, InputComponent],
  templateUrl: './sign-in.component.html'
})
export class SignInComponent {
 
}