import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutService } from '../../../core/services/checkout.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  constructor(
    private checkoutService: CheckoutService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  payNow(): void {
    this.checkoutService.createOrderFromSavedShipping().subscribe({
      next: () => {
        this.snack.open('✅ Payment successful. Order placed!', 'Close', { duration: 3000 });
        localStorage.removeItem('basket_id');
        this.router.navigate(['/orders']);
      },
      error: (err: any) => {
        console.error(err);
        this.snack.open('❌ Payment failed. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }
}
