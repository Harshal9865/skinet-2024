import {
  Component,
  ChangeDetectionStrategy,
  effect,
  inject,
  signal
} from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';

import { CartService } from '../../features/cart/cart.service';
import { AccountService } from '../../core/services/account.service';
import { Basket } from '../../shared/models/basket';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    MatProgressBarModule,
    MatMenuModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  private cartService = inject(CartService);
  private accountService = inject(AccountService);
  public router = inject(Router);

  // 🔄 Reactive signals
  itemCount = signal(0);
  isLoading = signal(false);
  currentUser = signal<User | null>(null);
  currentUrl = signal<string>(this.router.url); // ✅ signal that updates on nav

  constructor() {
    // ✅ Basket item count updater
    effect(() => {
      this.cartService.basket$.subscribe((basket: Basket | null) => {
        const count = basket?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
        this.itemCount.set(count);
      });
    });

    // ✅ User state updater
    effect(() => {
      this.accountService.currentUser$.subscribe(user => {
        this.currentUser.set(user);
      });
    });

    // ✅ Handle route loading & update currentUrl on navigation
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isLoading.set(false);
        this.currentUrl.set(this.router.url); // ✅ update current url on end
      }
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
