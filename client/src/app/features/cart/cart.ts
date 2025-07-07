import { Component } from '@angular/core';
import { CartService, CartItem } from '../../features/cart/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class CartComponent {
  items: CartItem[] = [];
  baseUrl = 'https://localhost:5051/'; // ✅ Add this line

  constructor(private cartService: CartService) {
    this.cartService.currentItems$.subscribe(i => this.items = i);
  }

  get subtotal(): number {
    return this.items.reduce((s, x) => s + x.product.price * x.quantity, 0);
  }

  remove(id: number): void {
    this.cartService.removeItem(id);
  }
}
