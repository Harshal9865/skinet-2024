import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './layout/header/header';
import { ShopComponent } from './features/shop/shop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Header, ShopComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  title = 'Skinet';
}
