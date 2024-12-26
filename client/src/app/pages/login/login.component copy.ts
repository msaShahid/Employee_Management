import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
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
  isLoading: boolean = false;

  http = inject(HttpClient);
 // router = inject(Router);

  constructor(private authService: AuthService, private router: Router){}

  onLogin(){
    this.authService.login(this.emailId, this.password).subscribe({
      next: (response) => {
       // localStorage.setItem('authToken', response.token);
        localStorage.setItem('user',JSON.stringify(response.user))
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        if (error.error.errors) {
          this.errorMessage = error.error.errors.message || 'An error occurred';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      },
      complete: () => {
        this.isLoading = false; 
      }
    })

  }

  //onLogin(){
   // debugger;
  //   this.http.post("https://projectapi.gerasim.in/api/UserApp/login", this.loginObj).subscribe((res:any) => {
  //     if(res.result){
  //       alert("login success");
  //       localStorage.setItem("loggedin", this.loginObj.emailId)
  //       this.router.navigateByUrl("dashboard");
  //     } else {
  //       alert("Wrong credentials!");
  //     }
  //   })
  // }


  // onLogin(){
  //   if(this.loginObj.emailId == "admin" && this.loginObj.password == "Passw0rd11!!"){
  //     localStorage.setItem("loggedin", this.loginObj.emailId)
  //     this.router.navigateByUrl("dashboard");
  //   } else {
  //     alert("Wrong credentials!");
  //   }
  // }

  

}
