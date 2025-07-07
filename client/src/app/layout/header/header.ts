import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService, CartItem } from '../../features/cart/cart.service'; // ✅ Correct import

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
    this.cartService.currentItems$.subscribe((items: CartItem[]) => {
      this.itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    });
  }
}
