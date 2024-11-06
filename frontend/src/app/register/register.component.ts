import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  departments: any[] = [];
  showPassword: boolean = false; // Toggle for password visibility


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/)]],
      register_number: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      department: [null, Validators.required],
      college_name: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/)]],
      university: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/)]],
      dob: ['', [Validators.required, this.ageValidator(18, 120)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.fetchDepartments();
  }

  fetchDepartments() {
    this.authService.getDepartments().subscribe(
      (response: any) => {
        this.departments = response;
        console.log("Departments fetched successfully:", this.departments);
      },
      (error) => {
        console.error('Error fetching departments:', error);
      }
    );
  }

  ageValidator(minAge: number, maxAge: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const dob = new Date(control.value);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const isValid = age >= minAge && age <= maxAge;
      return isValid ? null : { invalidAge: true };
    };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      console.log('Form Data being submitted:', formData);

      this.authService.register(formData).subscribe(
        (response) => {
          console.log('Registration successful:', response);
          alert('Registration successful!');
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Registration failed:', error);
          alert('Registration failed. Check console for details.');
        }
      );
    } else {
      console.error("Form is invalid");
      alert('Please fill all required fields correctly.');
    }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
