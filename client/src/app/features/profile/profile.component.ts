import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from 'src/app/core/models/user';
import { AccountService } from 'src/app/core/services/account.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [CommonModule, RouterModule]
})
export class ProfileComponent implements OnInit {
  user!: User;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe({
      next: (user) => {
        if (user) this.user = user;
      }
    });
  }
}
