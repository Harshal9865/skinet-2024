import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Shop } from '../../core/services/shop';
import { Product } from '../../shared/models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.scss']
})
export class ProductDetails implements OnInit {
  product: Product | undefined;
  quantity = 1;
  loading = true;
  baseUrl = 'https://localhost:5051/';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private shopService: Shop,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const routeId = Number(this.route.snapshot.paramMap.get('id'));
    const navState = this.router.getCurrentNavigation()?.extras.state as { product?: Product };

    // 👇 Step 1: Preload immediately if state is available
    if (navState?.product) {
      this.product = navState.product;
      this.loading = false;
      this.cdRef.detectChanges(); // Force view update
    }

    // 👇 Step 2: Otherwise fetch from API
    if (!this.product && routeId) {
      this.shopService.getProduct(routeId).subscribe({
        next: res => {
          this.product = res;
          this.loading = false;
          this.cdRef.detectChanges();
        },
        error: err => {
          console.error('Error loading product', err);
          this.loading = false;
        }
      });
    }
  }

  addToCart(): void {
    if (!this.product || this.quantity < 1) return;
    console.log(`Added ${this.quantity} x ${this.product.name} to cart`);
    // Add CartService logic here
  }
}
