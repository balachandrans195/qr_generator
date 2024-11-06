import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentBillPopupComponent } from './payment-bill-popup.component';

describe('PaymentBillPopupComponent', () => {
  let component: PaymentBillPopupComponent;
  let fixture: ComponentFixture<PaymentBillPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentBillPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentBillPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
