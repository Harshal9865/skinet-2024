import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-5xl mx-auto">
      <h2 class="text-3xl font-bold mb-6 text-center">Admin Dashboard</h2>

      <div class="grid md:grid-cols-3 gap-6">
        <div class="bg-white shadow rounded-lg p-4 border">
          <h3 class="text-xl font-semibold mb-2">Manage Products</h3>
          <p class="text-sm text-gray-600">Add, update, or remove products from the store.</p>
          <button class="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm">
            Go to Products
          </button>
        </div>

        <div class="bg-white shadow rounded-lg p-4 border">
          <h3 class="text-xl font-semibold mb-2">View Orders</h3>
          <p class="text-sm text-gray-600">Monitor and manage customer orders.</p>
          <button class="mt-4 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm">
            View Orders
          </button>
        </div>

        <div class="bg-white shadow rounded-lg p-4 border">
          <h3 class="text-xl font-semibold mb-2">User Management</h3>
          <p class="text-sm text-gray-600">Manage user roles and access.</p>
          <button class="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded text-sm">
            Manage Users
          </button>
        </div>
      </div>
    </div>
  `
})
export class AdminComponent {}
