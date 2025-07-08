import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Shop } from '../../core/services/shop';
import { Product } from '../../shared/models/product';
import { ShopParams } from '../../shared/models/shopParams';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  shop = inject(Shop);
  router = inject(Router);
  cdRef = inject(ChangeDetectorRef); // 🧠 Inject change detector

  featuredProducts: Product[] = [];
  sampleProducts: Product[] = [];
  baseUrl = 'https://localhost:5051/';

  ngOnInit(): void {
    const featuredParams = new ShopParams();
    featuredParams.pageNumber = 1;
    featuredParams.pageSize = 8;

    this.shop.getProducts(featuredParams).subscribe({
      next: response => {
        this.featuredProducts = response.data;
        this.cdRef.detectChanges(); // ✅ Trigger UI update for featured products

        this.loadSampleProducts(this.featuredProducts.map(p => p.id));
      },
      error: err => console.error(err)
    });
  }

  loadSampleProducts(excludeIds: number[]): void {
    const sampleParams = new ShopParams();
    sampleParams.pageNumber = 1;
    sampleParams.pageSize = 20; // Fetch more to allow filtering

    this.shop.getProducts(sampleParams).subscribe({
      next: response => {
        this.sampleProducts = response.data
          .filter(p => !excludeIds.includes(p.id))
          .slice(0, 5);
        this.cdRef.detectChanges(); // ✅ Trigger UI update for sample products
      },
      error: err => console.error(err)
    });
  }

  onCategoryClick(type: string): void {
  this.router.navigate(['/shop'], { queryParams: { type } });
}


  trackByFn(_index: number, item: Product): number {
    return item.id;
  }
}
