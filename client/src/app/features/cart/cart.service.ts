// src/app/core/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../shared/models/product';
import { Basket, BasketItem } from '../../shared/models/basket';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private basket: Basket | null = null;
  private basketSource = new BehaviorSubject<Basket | null>(null);
  basket$ = this.basketSource.asObservable();

  private baseUrl = `${environment.apiUrl}basket`;

  constructor(private http: HttpClient) {
    const id = localStorage.getItem('basket_id');
    if (id) {
      this.getBasket(id);
    }
  }

  private generateBasketId(): string {
    const id = 'cart_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('basket_id', id);
    return id;
  }

  private createBasket(): Basket {
    const newBasket: Basket = {
      id: this.generateBasketId(),
      items: []
    };
    this.basket = newBasket;
    this.basketSource.next(newBasket);
    return newBasket;
  }

  private getOrCreateBasket(): Basket {
    if (this.basket) return this.basket;

    const id = localStorage.getItem('basket_id');
    if (id) {
      return { id, items: [] }; // provisional until HTTP fetch updates it
    }

    return this.createBasket();
  }

  private getBasket(id: string) {
    this.http.get<Basket>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError(err => {
          console.error('❌ Failed to fetch basket:', err);
          this.basket = null;
          this.basketSource.next(null);
          localStorage.removeItem('basket_id');
          return of(null);
        })
      )
      .subscribe(basket => {
        if (basket) {
          this.basket = basket;
          this.basketSource.next(basket);
        }
      });
  }

  private setBasket(basket: Basket) {
    this.http.post<Basket>(this.baseUrl, basket)
      .pipe(
        catchError(err => {
          console.error('❌ Failed to set basket:', err);
          return of(null);
        })
      )
      .subscribe(updated => {
        if (updated) {
          this.basket = updated;
          this.basketSource.next(updated);
        }
      });
  }

  addToCart(product: Product, quantity = 1) {
    const basket = this.getOrCreateBasket();

    const index = basket.items.findIndex(i => i.productId === product.id);
    const items = [...basket.items];

    if (index !== -1) {
      items[index] = { ...items[index], quantity: items[index].quantity + quantity };
    } else {
      const newItem: BasketItem = {
        productId: product.id,
        productName: product.name,
        quantity,
        price: product.price,
        pictureUrl: product.pictureUrl,
        brand: product.brand,
        type: product.type
      };
      items.push(newItem);
    }

    const updatedBasket = { ...basket, items };
    this.setBasket(updatedBasket);
  }

  removeItem(productId: number) {
    if (!this.basket) return;

    const filteredItems = this.basket.items.filter(i => i.productId !== productId);
    const updatedBasket = { ...this.basket, items: filteredItems };
    this.setBasket(updatedBasket);
  }

  clearCart() {
    const id = localStorage.getItem('basket_id');
    if (!id) return;

    this.http.delete(`${this.baseUrl}/${id}`)
      .pipe(
        catchError(err => {
          console.error('❌ Failed to clear cart:', err);
          return of(null);
        })
      )
      .subscribe(() => {
        this.basket = null;
        this.basketSource.next(null);
        localStorage.removeItem('basket_id');
      });
  }
}
