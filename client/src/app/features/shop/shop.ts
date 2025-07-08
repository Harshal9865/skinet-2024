import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Shop as ShopService } from '../../core/services/shop';
import { Product } from '../../shared/models/product';
import { environment } from '../../../environments/environment';
import { ShopParams } from '../../shared/models/shopParams';
import { Pagination } from '../../shared/models/pagination';
import { finalize } from 'rxjs/operators';
import { ProductItemComponent } from '../shop/product-item/product-item.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { NoItemsDialogComponent } from './no-items-dialog.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ProductItemComponent,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDividerModule,
    MatListModule,
    MatMenuModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './shop.html',
  styleUrls: ['./shop.scss']
})
export class ShopComponent implements OnInit {
  shop = inject(ShopService);
  dialog = inject(MatDialog);
  cdRef = inject(ChangeDetectorRef);
  route = inject(ActivatedRoute);

  shopParams = new ShopParams();
  products: Product[] = [];
  pagination?: Pagination<Product>;
  loading = true;
  baseUrl = environment.apiUrl;
ngOnInit(): void {
  this.route.queryParamMap.subscribe(params => {
    const type = params.get('type');
    if (type) {
      this.shopParams.types = [type];
    }
    this.initializeShop();
  });
}

  initializeShop(): void {
    this.shop.getBrands();
    this.shop.getTypes();
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.shop.getProducts(this.shopParams)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: response => {
          this.products = response.data;
          this.pagination = response;
          this.cdRef.detectChanges();

          if (this.products.length === 0) {
            this.dialog.open(NoItemsDialogComponent, {
              width: '300px'
            });
          }
        },
        error: error => console.error(error)
      });
  }

  toggleBrand(brand: string): void {
    this.shopParams.brands = this.shopParams.brands.includes(brand)
      ? this.shopParams.brands.filter(b => b !== brand)
      : [...this.shopParams.brands, brand];

    this.shopParams.pageNumber = 1;
    this.loadProducts();
  }

  toggleType(type: string): void {
    this.shopParams.types = this.shopParams.types.includes(type)
      ? this.shopParams.types.filter(t => t !== type)
      : [...this.shopParams.types, type];

    this.shopParams.pageNumber = 1;
    this.loadProducts();
  }

  changeSort(sort: string): void {
    this.shopParams.sort = sort;
    this.loadProducts();
  }

  clearFilters(): void {
    this.shopParams = new ShopParams();
    this.loadProducts();
  }

  searchProducts(term: string): void {
    this.shopParams.search = term.trim();
    this.shopParams.pageNumber = 1;
    this.loadProducts();
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchProducts(target.value);
  }

  onPageChange(event: any): void {
    this.shopParams.pageNumber = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.loadProducts();
  }

  changePage(pageNumber: number): void {
    if (this.pagination && pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.shopParams.pageNumber = pageNumber;
      this.loadProducts();
    }
  }

  get totalPages(): number {
    return this.pagination ? Math.ceil(this.pagination.count / this.shopParams.pageSize) : 1;
  }

  get isNextDisabled(): boolean {
    return this.pagination !== undefined && this.shopParams.pageNumber >= this.totalPages;
  }

  trackById(_index: number, product: Product): number {
    return product.id;
  }
}
