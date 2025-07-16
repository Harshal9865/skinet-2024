import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderService } from '../../core/services/order.services';
import { Order } from '../../core/models/order';

@Component({
  selector: 'app-order-history',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  error = signal<string | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.orderService.getOrdersForUser().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Failed to load orders:', err);
        this.error.set('❌ Failed to load orders');
        this.loading.set(false);
      }
    });
  }
}
