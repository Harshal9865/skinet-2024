import { Routes } from '@angular/router';
import { ShopComponent } from './features/shop/shop';
import { Home } from './features/home/home';
import { ProductDetails } from './features/product-details/product-details';
import { CartComponent } from './features/cart/cart';
import { ContactComponent } from './features/contact/contact'; // ✅ Add this line

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'shop', component: ShopComponent },
  { path: 'shop/:id', component: ProductDetails },
  { path: 'cart', component: CartComponent },
  { path: 'contact', component: ContactComponent }, // ✅ Added route
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
