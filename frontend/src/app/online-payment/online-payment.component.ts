import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentBillPopupComponent } from '../payment-bill-popup/payment-bill-popup.component'
import { AuthService } from '../auth.service';
import {  MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-online-payment',
  templateUrl: './online-payment.component.html',
  styleUrls: ['./online-payment.component.css'], // Link your CSS file here

  
})
export class OnlinePaymentComponent implements OnInit {
  studentId: string | null = null;
  studentName: string | null = null;
  registerNumber: string | null = null;
  departmentId: string | null = null;
  departmentName: string | null = null;
  semesterNumber: string | null = null;
  subjects: any[] = [];
  upiId: string = '';
  upiVerified: boolean = false;
  paymentMessage: string = '';
  upiName: string = ''; // Extracted UPI name without numbers
  collegeName: string | null = null;
  university: string | null = null;
  constructor(private route: ActivatedRoute , private authService: AuthService,     private dialog: MatDialog

  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.studentId = params['studentId'];
      this.studentName = params['studentName'];
      this.registerNumber = params['registerNumber'];
      this.departmentId = params['departmentId'];
      this.departmentName = params['departmentName'];
      this.semesterNumber = params['semesterNumber'];
      this.collegeName = params['collegeName'];
      this.university = params['university'];
      this.subjects = JSON.parse(params['subjects'] || '[]'); // Parse subjects from query params
    });
  }

  verifyUPI() {
    const validUpiPattern = /^[a-zA-Z0-9]+@(oksbi|ybl|okicici|okhdfcbank|okaxis|okstatebank|okpaytm)$/;
    const trimmedUpi = this.upiId.trim();

    this.upiVerified = validUpiPattern.test(trimmedUpi);
    if (this.upiVerified) {
      this.upiName = trimmedUpi.split('@')[0].replace(/[0-9]/g, '');
      this.paymentMessage = `UPI verified successfully for ${this.upiName}! Proceed with payment.`;
    } else {
      this.paymentMessage = 'Invalid UPI ID. Please enter a valid bank-related UPI ID (e.g., name@oksbi, name@ybl).';
      this.upiName = '';
    }
  }

  completePayment() {
    if (this.upiVerified) {
      const paymentData = {
        semester_number: this.semesterNumber,
        subjects: this.subjects.map((subject) => subject.subject_name).join(', '),
        payment_successful: true,
      };

      this.authService.createPayment(Number(this.studentId), paymentData).subscribe(
        (response) => {
          this.paymentMessage = 'Payment successful!';
          this.openBillPopup();
        },
        (error) => {
          this.paymentMessage = 'Payment failed. Please try again.';
          console.error('Payment error:', error);
        }
      );
    } else {
      this.paymentMessage = 'Please verify your UPI ID before proceeding with payment.';
    }
  }

  openBillPopup() {
    this.dialog.open(PaymentBillPopupComponent, {
      data: {
        studentId: this.studentId,
        studentName: this.studentName,
        registerNumber:this.registerNumber,
        collegeName: this.collegeName,       // Pass college name
        university: this.university,
        departmentId: this.departmentId,
        departmentName: this.departmentName, // Pass department name to the popup
        semesterNumber: this.semesterNumber,
        subjects: this.subjects,
      },
      width: '400px',
    });
  
  }


}