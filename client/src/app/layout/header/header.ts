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
import { AccountService } from '../../core/services/account.service';
import { User } from '../../core/models/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  currentUser: User | null = null;

  private cartService = inject(CartService);
  private accountService = inject(AccountService);
  private cdRef = inject(ChangeDetectorRef);
  private router = inject(Router);

  constructor() {
    this.cartService.basket$
      .pipe(takeUntilDestroyed())
      .subscribe((basket: Basket | null) => {
        this.itemCount = basket?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
        this.cdRef.detectChanges();
      });

    this.accountService.currentUser$
      .pipe(takeUntilDestroyed())
      .subscribe(user => {
        this.currentUser = user;
        this.cdRef.detectChanges();
      });

    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter(event =>
          event instanceof NavigationStart ||
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        )
      )
      .subscribe(event => {
        this.isLoading = event instanceof NavigationStart;
        this.cdRef.detectChanges();
      });
  }

  logout() {
    this.accountService.logout();
    this.currentUser = null;
    this.router.navigateByUrl('/');
    this.cdRef.detectChanges();
  }
}
