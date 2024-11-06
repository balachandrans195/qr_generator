import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000'; // Update with your Django backend URL
  studentId: number | null = null; // To store student I
  constructor(private http: HttpClient) {}

  // Register a new student
  register(studentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, studentData);
  }
  
  
  // Login user
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, credentials);
  }

  getDepartments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/departments/`); // Update with your actual endpoint
  }

  setStudentId(id: number) {
    this.studentId = id;
  }

  getStudentId(): number | null {
    return this.studentId;
  }

  // auth.service.ts
  getStudentDetails(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/students/${id}/`).pipe(
      switchMap((student) => {
        return this.getPaymentsForStudent(student.id).pipe(
          map((payments) => {
            // Add payment information to the student object
            return {
              ...student,
              payments: payments,
            };
          })
        );
      })
    );
  }

  private getPaymentsForStudent(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/payments/${studentId}/`);
  }


  createPayment(studentId: number, paymentData: any): Observable<any> {
    const url = `${this.apiUrl}/payments/${studentId}/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, paymentData, { headers });
  }


  // auth.service.ts
  cashPayment(studentId: number, paymentData: any): Observable<any> {
    const url = `${this.apiUrl}/api/cash-payment/${studentId}/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, paymentData, { headers });
  }

  
}
