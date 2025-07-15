import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../core/services/account.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    RouterModule 
  ],
  templateUrl: './profile-edit.component.html'
})
export class ProfileEditComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private snack: MatSnackBar,
    private router: Router
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
    const user = this.accountService.getCurrentUserValue();

    if (!user) {
      this.snack.open('❌ You must be logged in', 'Close', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    const address = user.address;
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

    this.accountService.updateAddress(address).pipe(take(1)).subscribe({
      next: () => {
        this.snack.open('✅ Address saved successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/profile']);
      },
      error: () => {
        this.snack.open('❌ Failed to save address', 'Close', { duration: 3000 });
      }
    });
  }
}
