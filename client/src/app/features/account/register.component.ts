import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../../core/services/account.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm = this.fb.group({
    displayName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  submit() {
    if (this.registerForm.invalid) return;
    this.accountService.register(this.registerForm.value).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.snack.open('Registration failed', 'Close', { duration: 2000 })
    });
  }
}
