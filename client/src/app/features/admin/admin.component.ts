import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-3xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <p>Welcome to the Admin Panel. Add functionality here.</p>
    </div>
  `
})
export class AdminComponent {}
