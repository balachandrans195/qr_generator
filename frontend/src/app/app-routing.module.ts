import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { InvigilatorDashboardComponent } from './invigilator-dashboard/invigilator-dashboard.component';
import { OnlinePaymentComponent } from './online-payment/online-payment.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'admin-dashboard/:id', component: AdminDashboardComponent }, // For admin dashboard
  { path: 'invigilator-dashboard/:id', component: InvigilatorDashboardComponent }, // For invigilator dashboard
  { path: 'online-payment', component: OnlinePaymentComponent },

  // Define other routes for your app
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
