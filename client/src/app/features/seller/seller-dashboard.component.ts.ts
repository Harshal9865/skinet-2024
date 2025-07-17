import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { SellerService } from './seller.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Product } from '../../shared/models/product';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.scss']
})
export class SellerDashboardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private sellerService = inject(SellerService);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    price: [null, Validators.required],
    brand: [''],
    type: [''],
    image: [null, Validators.required]  // File is required
  });

  products = signal<Product[]>([]);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.sellerService.getSellerProducts().subscribe({
      next: (res) => this.products.set(res)
    });
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.form.patchValue({ image: file });
    }
  }

  submit() {
  if (this.form.valid) {
    const formData = new FormData();
    const formValue = this.form.value;

    for (const key in formValue) {
      const value = formValue[key as keyof typeof formValue];

      if (value !== null && value !== undefined) {
        if (key === 'image' && value instanceof File) {
          formData.append(key, value); // for file
        } else {
          formData.append(key, value.toString()); // convert number or other values to string
        }
      }
    }

    this.sellerService.uploadProduct(formData).subscribe({
      next: () => {
        this.form.reset();
        this.loadProducts();
      }
    });
  }
}


  delete(productId: number) {
    this.sellerService.deleteProduct(productId).subscribe({
      next: () => this.loadProducts()
    });
  }
}
