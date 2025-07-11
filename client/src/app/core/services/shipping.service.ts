import { Injectable } from '@angular/core';
import { Address } from '../models/address';

@Injectable({ providedIn: 'root' })
export class ShippingService {
  private key = 'shipping_address';

  save(address: Address): void {
    localStorage.setItem(this.key, JSON.stringify(address));
  }

  get(): Address | null {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : null;
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }
}
