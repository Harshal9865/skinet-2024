import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Shop } from '../../core/services/shop';
import { Product } from '../../shared/models/product';
import { ShopParams } from '../../core/models/shop-params'; // adjust path as needed

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  shop = inject(Shop);
  featuredProducts: Product[] = [];
  baseUrl = 'https://localhost:5051/';

 ngOnInit(): void {
  const params = new ShopParams();
  params.pageNumber = 1;
  params.pageSize = 8;

  this.shop.getProducts(params).subscribe({
    next: response => this.featuredProducts = response.data,
    error: err => console.error(err)
  });
}

  }
}
