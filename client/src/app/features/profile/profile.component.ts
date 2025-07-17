import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../core/models/user';
import { AccountService } from '../../core/services/account.service';
import { MatButtonModule } from '@angular/material/button';
import { take } from 'rxjs/operators';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        this.user = user;
      }
    });
  }

  get avatarUrl(): string {
    const seed = this.user?.email || 'guest';
    return `https://api.dicebear.com/7.x/big-ears/svg?seed=${seed}`;
  }

  get hasAddress(): boolean {
    return !!this.user?.address?.street;
  }

  get addressDisplay(): string {
    const addr = this.user?.address;
    if (!addr) return '';
    return `${addr.firstName} ${addr.lastName}, ${addr.street}, ${addr.city}, ${addr.state} - ${addr.zipCode}`;
  }
}