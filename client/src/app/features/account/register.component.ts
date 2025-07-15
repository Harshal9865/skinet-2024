// src/app/features/account/register/register.component.ts
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AccountService } from '../../core/services/account.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackbar = inject(MatSnackBar);
  private location = inject(Location);

  form: FormGroup = this.fb.group({
    displayName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.accountService.register(this.form.value).subscribe({
      next: () => {
        this.snackbar.open('Registered successfully!', 'Close', { duration: 2500 });

        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
        } else {
          this.location.back(); // fallback
        }
      },
      error: (err) => {
        const msg =
          err?.error?.errors?.email?.[0] ||
          err?.error?.message ||
          'Registration failed. Try again.';

        this.snackbar.open(msg, 'Close', { duration: 3000 });
        console.error('Registration error:', err);
      }
    });
  }
}
