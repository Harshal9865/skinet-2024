import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './layout/header/header';
import { RouterOutlet } from '@angular/router';
import { Footer } from './layout/footer/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Footer, Header, RouterOutlet, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  title = 'Skinet';
}
