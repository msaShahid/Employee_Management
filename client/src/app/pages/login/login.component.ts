import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  emailId: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router){}

  onLogin(){

    console.log('click on login');
    if(!this.emailId || !this.password){
      this.errorMessage = 'Please enter both email and password'; 
      return;
    }

    this.authService.login(this.emailId, this.password).subscribe({
      next: (response) => {
        sessionStorage.setItem('user',JSON.stringify(response.user))
        console.log('Next to dashboard!');
        this.router.navigateByUrl("dashboard");
      },
      error: (error) => {
        if (error?.error?.errors?.message) {
          this.errorMessage = error.error.errors.message || 'An error occurred during login';
        } else {
          this.errorMessage = 'Login failed. Please check your credentials and try again.';
        }
      },
    })

  }  

}
