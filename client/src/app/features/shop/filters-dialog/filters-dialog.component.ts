import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Shop as ShopService } from '../../../core/services/shop';

@Component({
  selector: 'app-filters-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatSelectionList,
    MatListOption,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './filters-dialog.component.html',
  styleUrls: ['./filters-dialog.component.scss']
})
export class FiltersDialogComponent {
  shopService = inject(ShopService);
  dialogRef = inject(MatDialogRef<FiltersDialogComponent>);

  onApplyFilters(
    brandsList: MatSelectionList,
    typesList: MatSelectionList
  ) {
    const selectedBrands = brandsList.selectedOptions.selected.map(option => option.value);
    const selectedTypes = typesList.selectedOptions.selected.map(option => option.value);

    this.dialogRef.close({
      brands: selectedBrands,
      types: selectedTypes
    });
  }
}
