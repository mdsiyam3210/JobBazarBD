import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { PaymentState } from '../store/payment.state';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule} from '@angular/material/checkbox'
import { ReceiptState, SetReceipt } from '../store/receipt.state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatFormField,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatCheckboxModule
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  receiptForm: FormGroup
  paymentData: any;
  paymentMethods = ["bKash", "Nagad", "Rocket"]

  constructor(private store: Store, private fb: FormBuilder, private serviceRouter: Router) {
    this.receiptForm = this.fb.group({
      costumer_name: ['', Validators.required],
      costumer_phone: ['', Validators.required],
      plan_name: ['', Validators.required],
      amount_paid: ['', Validators.required],
      payment_method: this.fb.array([], Validators.required),
      transaction_id: ['', Validators.required],
      reference: ['', Validators.required],
    })

    this.paymentMethods.forEach(() => {
      this.paymentMethodArray.push(new FormControl(false));
    });
  }

  router = inject(Router)

  ngOnInit(): void {
    this.paymentData = this.store.selectSnapshot(PaymentState.payment);
    console.log(this.store.selectSnapshot(ReceiptState.receipt));
    if (this.paymentData) {
      this.receiptForm.get('plan_name')?.setValue(this.paymentData.plan_name);
      this.receiptForm.get('amount_paid')?.setValue(this.paymentData.amount);
    }
  }

  // Getter for payment_method FormArray
  get paymentMethodArray(): FormArray {
    return this.receiptForm.get('payment_method') as FormArray;
  }

  // Getter for checkbox controls
  get paymentMethodControls(): FormControl[] {
    return this.paymentMethodArray.controls as FormControl[];
  }

  printReceipt() {
    // Map selected payment methods
    const selectedMethods = this.paymentMethods.filter(
      (_, i) => this.paymentMethodArray.at(i).value
    );

    console.log('Selected Payment Methods:', selectedMethods);
    console.log('Form Value:', this.receiptForm.value);

    if (this.receiptForm.valid) {
      // Replace boolean array with selected payment methods in the final payload
      const finalFormValue = { ...this.receiptForm.value, payment_method: selectedMethods };
      console.log('Final Form Value:', finalFormValue);
      this.store.dispatch(new SetReceipt(finalFormValue));
      this.router.navigateByUrl('/receipt');
    }
  }

}
