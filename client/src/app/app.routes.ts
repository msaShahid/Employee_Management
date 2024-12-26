import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { ProjectComponent } from './pages/project/project.component';
import { ProjectEmployeeComponent } from './pages/project-employee/project-employee.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuard } from './guard/auth.guard';
import { LogoutComponent } from './pages/logout/logout.component';

export const routes: Routes = [
    { path:'login',redirectTo: 'login',pathMatch: 'full'},
    { path: 'login',component: LoginComponent},
    {path: 'registration', component: LogoutComponent},
    {
        path:'',
        component:LayoutComponent,
        canActivate: [authGuard],
        children:[
            {path:'dashboard',component:DashboardComponent},
            {path:'employee',component:EmployeeComponent},
            {path:'projects',component:ProjectComponent},
            {path:'project-employee',component:ProjectEmployeeComponent }
        ]
    },
    { path: '**', component: NotFoundComponent}
   
];
