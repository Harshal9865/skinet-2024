import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../shared/models/product';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router'; 
@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
     RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent {
  @Input() product!: Product;
  @Input() baseUrl = '';

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/placeholder.png';
  }

  addToCart(product: Product) {
    console.log('Added to cart:', product);
    // you can inject CartService here later
  }
}
