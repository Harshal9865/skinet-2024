import { Routes } from '@angular/router';

import { Home } from './features/home/home';
import { ShopComponent } from './features/shop/shop';
import { ProductDetails } from './features/product-details/product-details';
import { CartComponent } from './features/cart/cart';
import { ContactComponent } from './features/contact/contact';
import { LoginComponent } from './features/account/login.component';
import { RegisterComponent } from './features/account/register.component';
import { ProfileComponent } from './features/profile/profile.component';
import { ProfileEditComponent } from './features/profile/profile-edit.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { OrderHistoryComponent } from './features/orders/order-history.component';
import { PaymentComponent } from './features/checkout/payment/payment.component';

import { AuthGuard } from './core/services/guards/auth.guard';
import { AdminGuard } from './core/services/guards/admin.guard';
import { SellerDashboardComponent } from './features/seller/seller-dashboard.component.ts';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'shop', component: ShopComponent },
  { path: 'shop/:id', component: ProductDetails },
  { path: 'cart', component: CartComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ProfileComponent },
      { path: 'edit', component: ProfileEditComponent }
    ]
  },
  {
    path: 'seller',
    component: SellerDashboardComponent,
    canActivate: [AuthGuard] // Optional: Add a SellerGuard later if needed
  },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: OrderHistoryComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AdminGuard]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
