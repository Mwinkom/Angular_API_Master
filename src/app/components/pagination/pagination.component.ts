import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 0;
  @Input() currentPage: number = 1;

  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number[] {
    const pages = Math.ceil(this.totalItems / this.itemsPerPage);
    return Array.from({length:pages}, (_,i) => i + 1);
  }

  changePage(page: number) {
    this.pageChange.emit(page);
  }
}
