import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-no-items-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon color="warn">warning</mat-icon>
      No Items Found
    </h2>
    <mat-dialog-content>
      Sorry, no products match your filters or search.
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close color="primary">OK</button>
    </mat-dialog-actions>
  `
})
export class NoItemsDialogComponent {}
