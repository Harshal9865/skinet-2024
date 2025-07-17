import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Order } from '../models/order';
import { OrderDto } from '../models/orderDto';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = 'https://localhost:5051/api/orders';

  constructor(private http: HttpClient) {}
getOrdersForUser(): Observable<Order[]> {
  return this.http.get<Order[]>(this.baseUrl);
}

  placeOrder(order: OrderDto): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, order);
  }
}
