import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  pendingPayments: any[] = [];
  completedPayments: any[] = [];
  filteredCompletedPayments: any[] = [];
  searchRegisterNumber: string = '';

  constructor(private http: HttpClient ,  private router: Router) {}

  ngOnInit(): void {
    this.loadStudentPayments();
  }

  loadStudentPayments() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/student-payments/').subscribe(
      (response) => {
        this.pendingPayments = response.filter(payment => !payment.payment_successful);
        this.completedPayments = response.filter(payment => payment.payment_successful);
        this.filteredCompletedPayments = [...this.completedPayments];
      },
      (error) => {
        console.error('Failed to load payment details:', error);
      }
    );
  }

  filterCompletedPayments() {
    const searchTerm = this.searchRegisterNumber.toLowerCase();
    this.filteredCompletedPayments = this.completedPayments.filter(payment =>
      payment.student_register_number.toLowerCase().includes(searchTerm)
    );
  }

  acceptPayment(paymentId: number) {
    this.http.put(`http://127.0.0.1:8000/api/student-payments/${paymentId}/`, { payment_successful: true })
      .subscribe(
        () => {
          const paymentIndex = this.pendingPayments.findIndex(p => p.id === paymentId);
          if (paymentIndex !== -1) {
            const [completedPayment] = this.pendingPayments.splice(paymentIndex, 1);
            completedPayment.payment_successful = true;
            this.completedPayments.push(completedPayment);
            this.filteredCompletedPayments = [...this.completedPayments];
          }
        },
        (error) => {
          console.error('Failed to accept payment:', error);
        }
      );
  }

  rejectPayment(paymentId: number) {
    this.http.delete(`http://127.0.0.1:8000/api/student-payments/${paymentId}/`)
      .subscribe(
        () => {
          this.pendingPayments = this.pendingPayments.filter(p => p.id !== paymentId);
        },
        (error) => {
          console.error('Failed to reject payment:', error);
        }
      );
  }
  logout() {
    // Clear any relevant session data if needed
    this.router.navigate(['/login']); // Redirects to login page
  }
}
