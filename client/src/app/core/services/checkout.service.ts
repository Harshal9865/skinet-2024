import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { Order } from '../models/order';
import { ShippingService } from './shipping.service';
import { AccountService } from './account.service';
import { IDeliveryMethod } from '../models/delivery-method';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private shippingService: ShippingService,
    private accountService: AccountService
  ) {}

  createOrder(order: any): Observable<Order> {
    return this.http.post<Order>(this.baseUrl + 'orders', order);
  }

  getDeliveryMethods(): Observable<IDeliveryMethod[]> {
    return this.http.get<IDeliveryMethod[]>(this.baseUrl + 'deliverymethods');
  }

  createOrderFromSavedShipping(deliveryMethodId = 1): Observable<Order> {
    const address = this.shippingService.get();
    const basketId = localStorage.getItem('basket_id');
    const email = this.accountService.getCurrentUserValue()?.email;

    if (!address || !basketId || !email) {
      return throwError(() => new Error('Missing email, basket or saved shipping address'));
    }

    const order = {
      email,
      basketId,
      deliveryMethodId,
      shippingAddress: address
    };

    return this.createOrder(order);
  }
}
