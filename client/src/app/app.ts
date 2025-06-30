import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Header } from './layout/header/header';
import { Product } from './shared/models/product';
import { Pagination } from './shared/models/pagination';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {
  baseUrl = 'https://localhost:5051/api/';
  private http = inject(HttpClient);
  title = 'Skinet';
  products: Product[] = [];

  ngOnInit(): void {
    this.http.get<Pagination<Product>>(this.baseUrl + 'products').subscribe({
      next: response => {
        console.log('API FULL response:', response);  // debug log
        console.log('DATA inside response:', response.data);  // debug log
        this.products = response.data;
      },
      error: error => console.error('API error', error),
      complete: () => console.log('Product fetch complete')
    });
  }

  trackById(_index: number, product: Product) {
    return product.id;
  }
}
