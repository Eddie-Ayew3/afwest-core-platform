import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-data-table-sticky',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './data-table-sticky.component.html'
})
export class DataTableStickyComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() maxHeight = '400px';
  @Input() searchable = true;
  @Input() paginate = true;
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];
  @Input() size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
  @Input() allowColumnHiding = true;
  @Input() showSettings = true;
  @Input() expandable = false;
}
