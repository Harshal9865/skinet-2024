import { Injectable } from '@angular/core';
import { Product } from '../../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: { product: Product; quantity: number }[] = [];

  addToCart(product: Product, quantity: number = 1): void {
    const existing = this.cart.find(item => item.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.push({ product, quantity });
    }
    console.log(`🛒 Added to cart: ${quantity} x ${product.name}`);
  }

  getCartItems() {
    return this.cart;
  }

  removeItem(productId: number): void {
    this.cart = this.cart.filter(item => item.product.id !== productId);
  }

  clearCart(): void {
    this.cart = [];
  }

  getItemCount(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }
}
