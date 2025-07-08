import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../../core/services/account.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = this.fb.group({
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
    if (this.loginForm.invalid) return;
    this.accountService.login(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.snack.open('Invalid login', 'Close', { duration: 2000 })
    });
  }
}
