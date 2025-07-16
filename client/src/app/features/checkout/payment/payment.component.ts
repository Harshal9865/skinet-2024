import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CheckoutService } from '../../../core/services/checkout.service';
import { AccountService } from '../../../core/services/account.service';
import { Address } from '../../../core/models/address';
import { IDeliveryMethod } from '../../../core/models/delivery-method';

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  imports: [CommonModule, FormsModule,MatSnackBarModule, MatButtonModule, MatSelectModule]
})
export class PaymentComponent implements OnInit {
  address: Address | null = null;
  deliveryMethods: IDeliveryMethod[] = [];
  selectedDeliveryMethodId = 1;

  constructor(
    private checkoutService: CheckoutService,
    private accountService: AccountService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('shipping_address');
    this.address = stored ? JSON.parse(stored) : null;

    if (!this.address) {
      this.snack.open('❌ No shipping address found. Please checkout again.', 'Close', { duration: 3000 });
      this.router.navigate(['/checkout']);
      return;
    }

    this.checkoutService.getDeliveryMethods().subscribe({
      next: (methods) => this.deliveryMethods = methods,
      error: () => this.snack.open('❌ Failed to load delivery options.', 'Close', { duration: 3000 })
    });
  }

  payNow(): void {
    const basketId = localStorage.getItem('basket_id');
    const email = this.accountService.getCurrentUserValue()?.email;

    if (!basketId || !email || !this.address) {
      this.snack.open('❌ Missing order data. Please retry.', 'Close', { duration: 3000 });
      return;
    }

    const order = {
      email,
      basketId,
      deliveryMethodId: this.selectedDeliveryMethodId,
      shippingAddress: this.address
    };

    this.checkoutService.createOrder(order).subscribe({
      next: () => {
        this.snack.open('✅ Payment successful. Order placed!', 'Close', { duration: 3000 });
        localStorage.removeItem('basket_id');
        localStorage.removeItem('shipping_address');
        this.router.navigate(['/orders'], { replaceUrl: true });
      },
      error: (err) => {
        console.error('❌ Payment error:', err);
        this.snack.open('❌ Payment failed. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }
}
