// src/app/features/checkout/payment/payment.component.ts

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CheckoutService } from '../../../core/services/checkout.service';
import { AccountService } from '../../../core/services/account.service';
import { CartService } from '../../cart/cart.service';
import { Address } from '../../../core/models/address';
import { IDeliveryMethod } from '../../../core/models/delivery-method';
import { BasketItem } from '../../../shared/models/basket';

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  imports: [CommonModule, FormsModule, MatSnackBarModule, MatButtonModule, MatSelectModule]
})
export class PaymentComponent implements OnInit {
  address: Address | null = null;
  deliveryMethods: IDeliveryMethod[] = [];
  selectedDeliveryMethodId = 1;
  items = signal<BasketItem[]>([]);
  loading = signal(false);

  constructor(
    private checkoutService: CheckoutService,
    private accountService: AccountService,
    private cartService: CartService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('shipping_address');
    this.address = stored ? JSON.parse(stored) : null;

    if (!this.address) {
      this.snack.open('⚠️ No address found. Redirecting…', 'Close', { duration: 3000 });
      this.router.navigate(['/checkout']);
      return;
    }

    this.checkoutService.getDeliveryMethods().subscribe({
      next: (methods) => this.deliveryMethods = methods,
      error: () => this.snack.open('❌ Failed to load delivery options.', 'Close', { duration: 3000 })
    });

    this.cartService.basket$.subscribe(b => this.items.set(b?.items ?? []));
  }

  get subtotal(): number {
    return this.items().reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get tax(): number {
    return +(this.subtotal * 0.1).toFixed(2); // 10% tax
  }

  get deliveryCharge(): number {
    return this.selectedDelivery?.price ?? 0;
  }

  get totalWithTaxAndDelivery(): number {
    return +(this.subtotal + this.tax + this.deliveryCharge).toFixed(2);
  }

  get selectedDelivery(): IDeliveryMethod | undefined {
    return this.deliveryMethods.find(d => d.id === this.selectedDeliveryMethodId);
  }

  payNow(): void {
    const basketId = localStorage.getItem('basket_id');
    const email = this.accountService.getCurrentUserValue()?.email;

    if (!basketId || !email || !this.address) {
      this.snack.open('❌ Missing data. Please retry.', 'Close', { duration: 3000 });
      return;
    }

    this.loading.set(true);
    const order = {
      email,
      basketId,
      deliveryMethodId: this.selectedDeliveryMethodId,
      shippingAddress: this.address
    };

    this.checkoutService.createOrder(order).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.snack.open('✅ Payment successful! Redirecting…', 'Close', { duration: 2000 });
        this.router.navigate(['/orders'], { replaceUrl: true }); // ✅ redirect to order history
      },
      error: (err) => {
        console.error('❌ Payment error:', err);
        this.snack.open('❌ Payment failed. Try again.', 'Close', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }
}
