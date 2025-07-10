import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-semibold mb-4">Order History</h2>
      <p>This is a placeholder for order history.</p>
    </div>
  `
})
export class OrderHistoryComponent {}
