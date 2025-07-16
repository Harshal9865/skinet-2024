import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

import { CheckoutService } from '../../../core/services/checkout.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  imports: [CommonModule, MatSnackBarModule, MatButtonModule]
})
export class PaymentComponent implements OnInit {
  address: any;

  constructor(
    private checkoutService: CheckoutService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('shipping_address');
    this.address = stored ? JSON.parse(stored) : null;
  }

  payNow(): void {
    const basketId = localStorage.getItem('basket_id');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!basketId || !user?.email || !this.address) {
      this.snack.open('❌ Missing order data. Please retry.', 'Close', { duration: 3000 });
      return;
    }

    const order = {
      email: user.email,
      basketId,
      deliveryMethodId: 1,
      shippingAddress: this.address
    };

    this.checkoutService.createOrder(order).subscribe({
      next: () => {
        this.snack.open('✅ Payment successful. Order placed!', 'Close', { duration: 3000 });
        localStorage.removeItem('basket_id');
        localStorage.removeItem('shipping_address');
        this.router.navigate(['/orders']);
      },
      error: (err: any) => {
        console.error(err);
        this.snack.open('❌ Payment failed. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }
}
