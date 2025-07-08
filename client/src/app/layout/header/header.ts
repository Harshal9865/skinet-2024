import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../features/cart/cart.service';

import { Basket } from '../../shared/models/basket';

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
  private cartService = inject(CartService); // ✅ explicitly typed
  private cdRef = inject(ChangeDetectorRef);

  constructor() {
    this.cartService.basket$.subscribe((basket: Basket | null) => {
      this.itemCount = basket?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
      this.cdRef.detectChanges(); // ✅ triggers immediate UI update
    });
  }
}
