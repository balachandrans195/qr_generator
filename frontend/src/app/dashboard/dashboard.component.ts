import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HallTicketComponent } from '../hall-ticket/hall-ticket.component';
import { MatDialog } from '@angular/material/dialog';
import QRCode, { QRCodeToDataURLOptions } from 'qrcode'; 
import jsPDF from 'jspdf';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'], // Link your CSS file here
})
export class DashboardComponent implements OnInit {
  studentId: string | null = null;
  studentData: any;
  semesters: any[] = [];
  showQrCodeDialog: boolean = false;
  qrData: string = '';
  qrCodeDataUrl: string = ''; // Store the generated QR code data URL

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.studentId = params['id'];
      if (this.studentId) {
        this.loadStudentData(this.studentId);
      }
    });
  }

  loadStudentData(id: string) {
    this.authService.getStudentDetails(id).subscribe(
      (response) => {
        this.studentData = response;
        this.groupSubjectsBySemester();
      },
      (error) => {
        console.error('Failed to fetch student details:', error);
      }
    );
  }

  groupSubjectsBySemester() {
    const semesterMap = new Map();
    const today = new Date();

    this.studentData.subjects.forEach((subject: any) => {
      if (!semesterMap.has(subject.semester_number)) {
        semesterMap.set(subject.semester_number, {
          semester: subject.semester_number,
          subjects: [],
          paymentSuccessful: false,
          hasFutureDate: false,
        });
      }

      const semesterEntry = semesterMap.get(subject.semester_number);
      semesterEntry.subjects.push(subject);

      const subjectDate = new Date(subject.subject_date);
      if (subjectDate > today) {
        semesterEntry.hasFutureDate = true;
      }

      const payment = this.studentData.payments.find((p: any) => p.semester_number === semesterEntry.semester);
      if (payment) {
        semesterEntry.paymentSuccessful = payment.payment_successful;
      }
    });

    this.semesters = Array.from(semesterMap.values());
  }

  openHallTicketDialog(semester: any): void {
    this.dialog.open(HallTicketComponent, {
      data: {
        studentData: this.studentData,
        semester: semester,
      },
      width: '600px',
    });
  }

  payForSemester(semester: any, paymentType: string) {
    if (paymentType === 'Online Payment') {
      this.router.navigate(['/online-payment'], {
        queryParams: {
          studentId: this.studentId,
          studentName: this.studentData.name,
          registerNumber: this.studentData.register_number,
          departmentId: this.studentData.department_id,  // Use correct field for department ID
          departmentName: this.studentData.department_name,
          semesterNumber: semester.semester,
          subjects: JSON.stringify(semester.subjects),
          collegeName: this.studentData.college_name,
          university: this.studentData.university,
        },
      });
    } else if (paymentType === 'Cash Payment') {
      const paymentData = {
        studentId: this.studentId,  // Include student ID for backend association
        departmentId: this.studentData.department_id,  // Ensure correct field name
        semester_number: semester.semester,  // Rename to match expected field
        subjects: semester.subjects.map((subject: any) => subject.subject_name).join(', '),  // Join subject names with a comma
        paymentSuccessful: false,     // Set payment as unsuccessful for cash payment
        collegeName: this.studentData.college_name,
        university: this.studentData.university,
      };
  
      // Ensure studentId is a number before passing it
      const studentId = this.studentId ? parseInt(this.studentId, 10) : null;
      if (studentId !== null) {
        this.authService.cashPayment(studentId, paymentData).subscribe(
          (response) => {
            semester.paymentSuccessful = false; // Keep the payment status as false
            console.log('Cash payment recorded successfully:', response);
          },
          (error) => {
            console.error('Failed to record cash payment:', error);
          }
        );
      } else {
        console.error('Invalid student ID');
      }
    }
  }
  
  
  
  
  

  openQrCodeDialog(semester: any) {
    // Determine the maximum length of the subject names for alignment
    const maxSubjectLength = Math.max(
      ...semester.subjects.map((subject: any) => this.abbreviateSubject(subject.subject_name).length),
      11 // 11 for the word "Subject"
    );
  
    const subjectColumnWidth = maxSubjectLength + 2; // Add padding for better visual separation
    const dateColumnWidth = 15; // Fixed width for date column (adjust as needed)
  
    // Construct the QR data in a table-like format
    const qrData = `
      Student: ${this.studentData.name}
      Register: ${this.studentData.register_number}
      College: ${this.studentData.college_name}
      University: ${this.studentData.university}
      Department: ${this.studentData.department_name}
      Semester: ${semester.semester}
  
      Subjects and Dates:
      ${'-'.repeat(subjectColumnWidth + dateColumnWidth + 7)}
    |  ${'Subject '.padEnd(subjectColumnWidth)} |${'Date'.padStart(dateColumnWidth)} |
      ${'-'.repeat(subjectColumnWidth + dateColumnWidth + 7)}
      ${semester.subjects.map((subject: any) => `| ${this.abbreviateSubject(subject.subject_name).padEnd(subjectColumnWidth)} | ${subject.subject_date ? subject.subject_date : 'N/A'.padStart(dateColumnWidth)} |`).join('\n    ')}
      ${'-'.repeat(subjectColumnWidth + dateColumnWidth + 7)}
    `.trim();
  
    const options: QRCodeToDataURLOptions = {
      errorCorrectionLevel: 'L', // Low error correction for less detail
      width: 120, // Adjusted width for a larger QR code
      margin: 3, // Increased margin for easier scanning
    };
  
    // Generate the QR code with the constructed data
    QRCode.toDataURL(qrData, options)
      .then((url: string) => {
        this.qrCodeDataUrl = url; // Store the generated QR code URL
        this.showQrCodeDialog = true; // Show the QR code dialog
      })
      .catch((err: Error) => {
        console.error('Error generating QR code', err);
      });
  }
  
  // Helper method to abbreviate the subject name
  // Helper method to abbreviate the subject name
abbreviateSubject(subjectName: string): string {
  const words = subjectName.split(' ');
  
  // Regular expression to match digits or Roman numeral characters
  const romanRegex = /^(M{0,4})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
  
  // Check for single-word subjects
  if (words.length === 1) {
    // Shorten single-word subjects to the first five letters
    return subjectName.slice(0, 5).toUpperCase(); // e.g., "Math" -> "MATH"
  } else {
    // Initialize the abbreviation
    let abbreviation = words.map(word => {
      // Check if the word is a number or a Roman numeral
      if (!isNaN(Number(word)) || romanRegex.test(word)) {
        return word; // Return the number or Roman numeral as-is
      }
      // Take the first letter of the word
      return word[0].toUpperCase();
    }).join('');
    
    // Add hyphenation for numbers or Roman numerals
    return abbreviation.replace(/([A-Z]+)(\d+)/g, '$1-$2') // For letters followed by numbers
                       .replace(/([A-Z]+)([IVXLCDM]+)/g, '$1-$2'); // For letters followed by Roman numerals
  }
}
 
  

  closeQrCodeDialog() {
    this.showQrCodeDialog = false;
  }
  logout() {
    // Add your logout logic here, e.g., clearing session storage and redirecting
    // this.authService.logout();
    // Navigate to login page
    this.router.navigate(['/login']);
  }
}


