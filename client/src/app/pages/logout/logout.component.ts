import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logout',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  username: string = '';
  emailId: string = '';
  password: string = '';
  errorMessage: string = '';

  onRegister(){
    console.log(this.emailId + " " + this.password);
  }

}
