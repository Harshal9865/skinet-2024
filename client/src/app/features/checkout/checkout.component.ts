import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CheckoutService } from '../../core/services/checkout.service';
import { AccountService } from '../../core/services/account.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private checkoutService: CheckoutService,
    private accountService: AccountService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required]
    });

    console.log('✅ CheckoutComponent constructor executed');
  }

  ngOnInit(): void {
    console.log('✅ ngOnInit started');

    const user = this.accountService.getCurrentUserValue();
    console.log('👤 Current user from accountService:', user);

    const address = user?.address;

    if (!address?.street) {
      console.warn('⚠️ No valid address found. Redirecting to profile edit.');
      this.snack.open('Please complete your profile before checkout.', 'Close', { duration: 3000 });
      this.router.navigate(['/profile/edit']);
      return;
    }

    console.log('✅ Address found:', address);

    this.checkoutForm.patchValue({
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode
    });

    console.log('✅ Checkout form patched with address');
  }

  submit(): void {
    console.log('🚀 submit() triggered');

    if (this.checkoutForm.invalid) {
      console.warn('⚠️ Form is invalid. Marking all as touched.');
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const address = this.checkoutForm.value;
    console.log('📦 Address form value:', address);

    const basketId = localStorage.getItem('basket_id');
    const email = this.accountService.getCurrentUserValue()?.email;

    if (!basketId || !email) {
      console.error('❌ Missing basketId or user email. Cannot proceed.');
      this.snack.open('Please login and add items to cart.', 'Close', { duration: 3000 });
      return;
    }

    // ✅ Store address for use in payment page
    localStorage.setItem('shipping_address', JSON.stringify(address));

    // ✅ Redirect to payment page
    this.router.navigate(['/payment']);
  }
}
