import { Routes } from '@angular/router';
import { ShopComponent } from './features/shop/shop';
import { Home } from './features/home/home';
import { ProductDetails } from './features/product-details/product-details';
import { CartComponent } from './features/cart/cart';
import { ContactComponent } from './features/contact/contact';
import { LoginComponent } from './features/account/login.component';
import { RegisterComponent } from './features/account/register.component';
import { ProfileComponent } from './features/profile/profile.component';
import { AuthGuard } from './core/services/guards/auth.guard';
import { AdminGuard } from './core/services/guards/admin.guard';
import { CheckoutComponent } from './features/checkout/checkout.component';
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'shop', component: ShopComponent },
  { path: 'shop/:id', component: ProductDetails },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
 { path: 'cart', component: CartComponent }, 

  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  // Admin route (lazy-loaded)
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AdminGuard]
  },

  // Fallback
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
