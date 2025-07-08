import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../shared/models/product';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CartService } from '../../cart/cart.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent {
  @Input() product!: Product;
  @Input() baseUrl = '';

  constructor(private cart: CartService, private snackBar: MatSnackBar) {}

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/placeholder.png';
  }

  addToCart() {
    this.cart.addToCart(this.product, 1);
    this.snackBar.open(`${this.product.name} added to cart`, 'Close', {
      duration: 2000
    });
  }
}
