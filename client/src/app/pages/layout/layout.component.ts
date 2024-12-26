import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../service/auth.service';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet,RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  private userDetails: any;
  userName: string | null = null; 
  //router = inject(Router);
  errorMessage: string = '';
  constructor(private authService: AuthService,private http: HttpClient,  private router: Router) { }
  

  ngOnInit(): void {
    const storedUserData = sessionStorage.getItem('user');

    if (storedUserData) {
      this.userDetails = JSON.parse(storedUserData);
     // console.log(this.userDetails.username); 
     this.userName = this.userDetails ? this.userDetails.username : null;

    } else {
      this.errorMessage = 'No user data';
    }
  }

  logout() {
    console.log("click on logut")
    this.authService.logout().subscribe({
      next: () => {
        sessionStorage.removeItem('user');
        sessionStorage.clear(); 
        console.log()
        this.router.navigate(['/login']);
      },
      error: (error) => {
        if (error?.error?.errors?.message) {
          this.errorMessage = error.error.errors.message || 'An error occurred during Logout';
        } else {
          this.errorMessage = 'Logout failed.';
        }
        console.error('Logout failed:', error);
        this.router.navigate(['/login']);
      }
    });
  }


}
