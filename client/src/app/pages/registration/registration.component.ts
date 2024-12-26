import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  username: string = '';
  emailId: string = '';
  password: string = '';
  errorMessage: string = '';

  onRegister(){
    console.log(this.emailId + " " + this.password);
  }

}
