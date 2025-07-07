import { Component } from '@angular/core';
import { CartService, CartItem } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class CartComponent {
  items: CartItem[] = [];
  
  constructor(private cartService: CartService) {
    this.cartService.currentItems$.subscribe(i => this.items = i);
  }

  get subtotal() { return this.items.reduce((s, x) => s + x.product.price * x.quantity, 0); }
  remove(id: number) { this.cartService.removeItem(id); }
}
