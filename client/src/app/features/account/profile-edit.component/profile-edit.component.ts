import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';

import { AccountService } from '../../../core/services/account.service';
import { ShippingService } from '../../../core/services/shipping.service';
import { Address } from '../../../core/models/address';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class ProfileEditComponent implements OnInit {
  profileForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private shippingService: ShippingService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const user = this.accountService.getCurrentUserValue();
    const savedAddress = this.shippingService.get();

    this.profileForm = this.fb.group({
      displayName: [user?.displayName || '', Validators.required],
      email: [user?.email || ''],
      street: [savedAddress?.street || '', Validators.required],
      city: [savedAddress?.city || '', Validators.required],
      state: [savedAddress?.state || '', Validators.required],
      zipCode: [savedAddress?.zipCode || '', Validators.required]
    });
  }

  save(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const dto = {
      displayName: this.profileForm.get('displayName')?.value,
      address: {
        firstName: '',
        lastName: '',
        street: this.profileForm.get('street')?.value,
        city: this.profileForm.get('city')?.value,
        state: this.profileForm.get('state')?.value,
        zipCode: this.profileForm.get('zipCode')?.value
      }
    };

    this.http.put('/api/account/update-profile', dto).subscribe({
      next: () => {
        this.snackBar.open('✅ Profile and address updated!', 'Close', { duration: 3000 });

        // Also update localStorage shipping (optional)
        this.shippingService.save(dto.address);
      },
      error: () => {
        this.snackBar.open('❌ Failed to update profile.', 'Close', { duration: 3000 });
      }
    });
  }
}
