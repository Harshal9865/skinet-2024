import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatError } from '@angular/material/form-field'; // Optional: resolves Angular Material template errors

import { AccountService } from '../../core/services/account.service';
import { Register } from '../../core/models/register';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="submit()" class="max-w-md mx-auto mt-8 space-y-4">
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Display Name</mat-label>
        <input matInput formControlName="displayName" />
        <mat-error *ngIf="registerForm.get('displayName')?.hasError('required')">
          Display Name is required
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" />
        <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
          Email is required
        </mat-error>
        <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
          Enter a valid email address
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Password</mat-label>
        <input matInput formControlName="password" type="password" />
        <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
          Password is required
        </mat-error>
        <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
          Password must be at least 6 characters
        </mat-error>
      </mat-form-field>

      <button mat-raised-button color="primary" class="w-full" [disabled]="registerForm.invalid">
        Register
      </button>
    </form>
  `,
  styles: [`
    .mat-form-field {
      margin-bottom: 16px;
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      displayName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit(): void {
    if (this.registerForm.invalid) return;

    const value = this.registerForm.value as Register;
    this.accountService.register(value).subscribe({
      next: () => {
        console.log('Registration successful');
      },
      error: (err: unknown) => {
        console.error('Registration failed', err);
      }
    });
  }
}
