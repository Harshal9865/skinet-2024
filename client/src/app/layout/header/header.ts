import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  DestroyRef
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

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  private destroyRef = inject(DestroyRef);

  itemCount = signal(0);
  isLoading = signal(false);
  currentUser = signal<User | null>(null);
  currentUrl = signal<string>(this.router.url);

  constructor() {
    // ✅ Basket item count
    this.cartService.basket$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((basket: Basket | null) => {
        if (!basket) {
          this.itemCount.set(0);
          return;
        }
        const count = basket.items.reduce((sum, item) => sum + item.quantity, 0);
        this.itemCount.set(count);
      });

    // ✅ User subscription
    this.accountService.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        this.currentUser.set(user);
      });

    // ✅ Route progress indicator
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.isLoading.set(true);
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.isLoading.set(false);
          this.currentUrl.set(this.router.url);
        }
      });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
