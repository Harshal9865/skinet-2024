import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { OrderService } from '../../core/services/order.services';
import { Order } from '../../core/models/order';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent {
  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  error = signal<string | null>(null);

  constructor() {
    this.orderService.getOrdersForUser().subscribe({
      next: (orders) => this.orders.set(orders),
      error: () => this.error.set('Failed to load orders')
    });
  }
}
