import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, throwError } from 'rxjs';
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
    if (id && id.length >= 10) {
      this.loadBasket(id);
    } else {
      console.warn('⚠️ No valid basket ID found. Creating new one.');
      this.createBasket();
    }
  }

  // Generate a new basket ID and store it in localStorage
  private generateBasketId(): string {
    const id = crypto.randomUUID();
    localStorage.setItem('basket_id', id);
    return id;
  }

  // Create a new basket
  private createBasket(): Basket {
    const newBasket: Basket = {
      id: this.generateBasketId(),
      items: []
    };
    console.log('🧺 Created new basket:', newBasket);
    this.basket = newBasket;
    this.basketSource.next(newBasket);
    return newBasket;
  }

  // Get existing basket or create a new one
  private getOrCreateBasket(): Basket {
    if (this.basket) return this.basket;

    const id = localStorage.getItem('basket_id');
    if (id) {
      const localBasket: Basket = { id, items: [] };
      this.basket = localBasket;
      return localBasket;
    }

    return this.createBasket();
  }

  // Load basket from backend
  private loadBasket(id: string) {
    this.http.get<Basket>(`${this.baseUrl}/${id}`).pipe(
      catchError(err => {
        console.error('❌ Failed to fetch basket:', err);
        this.basket = null;
        this.basketSource.next(null);
        localStorage.removeItem('basket_id');
        return of(null);
      })
    ).subscribe(basket => {
      if (basket) {
        this.basket = basket;
        this.basketSource.next(basket);
      }
    });
  }

  // Update basket in backend
  private updateBasket(basket: Basket) {
    console.log('📤 Updating basket on backend:', basket);
    this.http.post<Basket>(this.baseUrl, basket).pipe(
      catchError(err => {
        console.error('❌ Failed to update basket:', err);
        return of(null);
      })
    ).subscribe(updated => {
      if (updated) {
        console.log('✅ Basket updated and returned:', updated);
        localStorage.setItem('basket_id', updated.id); // ✅ sync to localStorage
        this.basket = updated;
        this.basketSource.next(updated);
      }
    });
  }

  // Add product to cart
  addToCart(product: Product, quantity = 1) {
    const basket = this.getOrCreateBasket();
    console.log('🛒 Adding to basket:', basket);
    console.log('🧺 Basket ID during addToCart:', basket.id);

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
    this.updateBasket(updatedBasket);
  }

  // Remove product from cart
  removeItem(productId: number) {
    if (!this.basket) return;

    const filteredItems = this.basket.items.filter(i => i.productId !== productId);
    const updatedBasket = { ...this.basket, items: filteredItems };
    this.updateBasket(updatedBasket);
  }

  // Clear the entire cart
  clearCart() {
    const id = localStorage.getItem('basket_id');
    if (!id || id.length < 10) {
      console.warn('❌ Invalid basket ID. Skip deletion.');
      return;
    }

    console.log('🗑️ Clearing basket with ID:', id);

    this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError(err => {
        if (err.status === 404) {
          console.warn('🧺 Basket already deleted.');
          return of(null);
        }
        console.error('❌ Failed to clear cart:', err);
        return of(null);
      })
    ).subscribe(() => {
      this.basket = null;
      this.basketSource.next(null);
      localStorage.removeItem('basket_id');
    });
  }

  // Get basket by ID manually (useful externally if needed)
  getBasket(id: string) {
    return this.http.get<Basket>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        if (error.status === 404) {
          console.warn('🧺 Basket not found.');
          return of(undefined);
        }
        console.error('❌ Failed to get basket:', error);
        return throwError(() => error);
      })
    );
  }
}
