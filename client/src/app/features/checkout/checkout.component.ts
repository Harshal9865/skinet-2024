// src/app/features/checkout/checkout.component.ts
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderService } from '../../core/services/order.services';

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
export class CheckoutComponent {
  checkoutForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private orderService: OrderService,
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
  }

  submit(): void {
  if (this.checkoutForm.invalid) {
    this.checkoutForm.markAllAsTouched();
    return;
  }

  const address = this.checkoutForm.value;

  const basketId = localStorage.getItem('basket_id'); // 🔁 This must match how basket is stored
  const deliveryMethodId = 1; // 🔁 Hardcoded now; can be dynamic later

  const order = {
    basketId,
    deliveryMethodId,
    shippingAddress: address
  };

  if (!basketId) {
    this.snack.open('No basket found. Please add items to your cart.', 'Close', { duration: 3000 });
    return;
  }

  this.orderService.placeOrder(order).subscribe({
    next: () => {
      this.snack.open('Order placed successfully!', 'Close', { duration: 3000 });
      localStorage.removeItem('basket_id'); // ✅ optional
      this.router.navigate(['/orders']);
    },
    error: (err) => {
      console.error(err);
      this.snack.open('Order failed. Please try again.', 'Close', { duration: 3000 });
    }
  });
}

}
