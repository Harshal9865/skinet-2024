import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../features/cart/cart.service'; // ✅ Removed CartItem import
import { Basket } from '../../shared/models/basket'; // ✅ Import actual model

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  itemCount = 0;

  constructor(private cartService: CartService) {
    this.cartService.basket$.subscribe((basket: Basket | null) => {
      this.itemCount = basket?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
    });
  }
}
