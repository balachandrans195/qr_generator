import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // Link your CSS file here

})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.authService.login(loginData).subscribe(
        (response) => {
          const userType = response.user_type; // Get user type from response
          const studentId = response.user_id; // Get student ID

          console.log('Login successful', response);

          // Navigate based on user type
          if (userType === 'student') {
            this.router.navigate(['/dashboard'], { queryParams: { id: studentId } });// Redirect to student dashboard
          } else if (userType === 'admin') {
            this.router.navigate(['/admin-dashboard', studentId]); // Redirect to admin dashboard
          } else if (userType === 'invigilator') {
            this.router.navigate(['/invigilator-dashboard', studentId]); // Redirect to invigilator dashboard
          }
        },
        (error) => {
          console.error('Login failed', error);
          alert('Login failed. Please check your credentials.');
        }
      );
    } else {
      console.error("Form is invalid");
      alert('Please enter both Register Number and Password.');
    }
  }
  navigateToRegister() {
    this.router.navigate(['/register']);  // Update '/register' based on your routing configuration
  }
}