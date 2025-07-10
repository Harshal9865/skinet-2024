import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../core/models/user';
import { AccountService } from '../../core/services/account.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe({
      next: (user) => {
        this.user = user;
      }
    });
  }

  get avatarUrl(): string {
    const seed = this.user?.email || 'guest';
    return `https://api.dicebear.com/7.x/big-ears/svg?seed=${seed}`;
  }
}
