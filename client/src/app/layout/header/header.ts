import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  RouterLink,
  RouterLinkActive,
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { filter } from 'rxjs/operators';
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
    MatProgressBarModule,
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  itemCount = 0;
  isLoading = false;

  private cartService = inject(CartService);
  private cdRef = inject(ChangeDetectorRef);
  private router = inject(Router);

  constructor() {
    // 🛒 Update item count from basket
    this.cartService.basket$.subscribe((basket: Basket | null) => {
      this.itemCount = basket?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
      this.cdRef.detectChanges();
    });

    // 🚦 Detect route changes and show/hide progress bar
    this.router.events.pipe(filter(event =>
      event instanceof NavigationStart ||
      event instanceof NavigationEnd ||
      event instanceof NavigationCancel ||
      event instanceof NavigationError
    )).subscribe(event => {
      this.isLoading = event instanceof NavigationStart;
      this.cdRef.detectChanges();
    });
  }
}
