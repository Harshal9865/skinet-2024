import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrls: ['../contact/contact.scss']
})
export class ContactComponent {
  name = '';
  email = '';
  message = '';

  submitForm() {
    alert(`Thank you, ${this.name}. We'll get back to you shortly!`);
    this.name = '';
    this.email = '';
    this.message = '';
  }
}
