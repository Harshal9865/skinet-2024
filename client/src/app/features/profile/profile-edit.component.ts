import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AccountService } from '../../core/services/account.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatSnackBarModule],
  templateUrl: './profile-edit.component.html'
})
export class ProfileEditComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const address = this.accountService.getCurrentUserValue()?.address;
    if (address) {
      this.form.patchValue(address);
    }
  }

  save(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const address = this.form.value;

  this.accountService.updateAddress(address).subscribe({
    next: () => {
      this.snack.open('✅ Address updated successfully', 'Close', { duration: 3000 });
      this.router.navigate(['/profile']);
    },
    error: () => {
      this.snack.open('❌ Failed to update address', 'Close', { duration: 3000 });
    }
  });
}

}
