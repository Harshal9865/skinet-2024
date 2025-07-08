import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../features/cart/cart.service';
import { BasketItem } from '../../shared/models/basket';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class CartComponent {
  items: BasketItem[] = [];
  baseUrl = 'https://localhost:5051/';

  constructor(private cartService: CartService) {
    this.cartService.basket$.subscribe(basket => {
      this.items = basket?.items ?? [];
    });
  }

  get subtotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  remove(id: number): void {
    this.cartService.removeItem(id); // 👈 Instant remove
  }
}
