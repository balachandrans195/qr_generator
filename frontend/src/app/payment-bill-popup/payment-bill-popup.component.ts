import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-payment-bill-popup',
  templateUrl: './payment-bill-popup.component.html',
})
export class PaymentBillPopupComponent {
  constructor(
    private router:Router,
    public dialogRef: MatDialogRef<PaymentBillPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  printBill(): void {
    window.print();
  }

  closeDialog(): void {
    // Close the dialog
    this.dialogRef.close();
    // Navigate back to the dashboard with the student ID
    this.router.navigate(['/dashboard'], { queryParams: { id: this.data.studentId } });
  }
}
