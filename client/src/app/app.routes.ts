import { Routes } from '@angular/router';
import { ShopComponent } from './features/shop/shop';
import { Home } from './features/home/home';
import { ProductDetails } from './features/product-details/product-details';
export const routes: Routes = [
    {path: '', component: Home},
    {path: 'shop', component: ShopComponent},
    {path: 'shop/:id', component: ProductDetails},
    {path: '**', redirectTo: '',pathMatch:'full'},

];
