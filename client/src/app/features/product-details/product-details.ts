import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Shop } from '../../core/services/shop';
import { Product } from '../../shared/models/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.scss']
})
export class ProductDetails implements OnInit {
  product: Product | undefined;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private shopService: Shop
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.shopService.getProduct(id).subscribe({
        next: (res) => {
          this.product = res;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading product', err);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }
}
