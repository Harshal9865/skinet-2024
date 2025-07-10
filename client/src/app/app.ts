import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer/footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    Header,
    Footer,
    RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  title = 'Skinet';
}
