import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../shared/models/product';
import { Basket, BasketItem } from '../../shared/models/basket';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private basket: Basket | null = null;
  private basketSource = new BehaviorSubject<Basket | null>(null);
  basket$ = this.basketSource.asObservable();

  constructor(private http: HttpClient) {
    const id = localStorage.getItem('basket_id');
    if (id) this.getBasket(id);
  }

  private createBasket(): Basket {
    const newBasket: Basket = { id: this.generateBasketId(), items: [] };
    this.basket = newBasket;
    this.basketSource.next(newBasket);
    return newBasket;
  }

  private generateBasketId(): string {
    const id = 'cart_' + Math.random().toString(36).substring(2);
    localStorage.setItem('basket_id', id);
    return id;
  }

  private setBasket(basket: Basket) {
    this.basketSource.next(basket); // 👈 Instant UI update
    this.http.post<Basket>(`https://localhost:5051/api/basket`, basket).subscribe({
      next: updated => {
        this.basket = updated;
        this.basketSource.next(updated); // Optional: Sync latest from API
      }
    });
  }

  private getBasket(id: string) {
    this.http.get<Basket>(`https://localhost:5051/api/basket/${id}`).subscribe({
      next: basket => {
        this.basket = basket;
        this.basketSource.next(basket);
      }
    });
  }

  private getOrCreateBasket(): Basket {
    if (this.basket) return this.basket;
    const id = localStorage.getItem('basket_id');
    if (id) return { id, items: [] };
    return this.createBasket();
  }

  addToCart(product: Product, quantity = 1) {
    const basket = this.getOrCreateBasket();
    const index = basket.items.findIndex(i => i.productId === product.id);

    if (index !== -1) {
      basket.items[index].quantity += quantity;
    } else {
      basket.items.push({
        productId: product.id,
        quantity,
        productName: product.name,
        price: product.price,
        pictureUrl: product.pictureUrl,
        brand: product.brand,
        type: product.type
      });
    }

    this.setBasket(basket);
  }

  removeItem(productId: number) {
    if (!this.basket) return;

    const basket = { ...this.basket };
    basket.items = basket.items.filter(i => i.productId !== productId);

    this.setBasket(basket);
  }

  clearCart() {
    const id = localStorage.getItem('basket_id');
    if (!id) return;
    this.http.delete(`https://localhost:5051/api/basket/${id}`).subscribe(() => {
      this.basket = null;
      this.basketSource.next(null);
      localStorage.removeItem('basket_id');
    });
  }
}
