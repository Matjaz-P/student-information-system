import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-custom-paginator',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule, ButtonModule],
  templateUrl: './custom-paginator.html',
  styleUrl: './custom-paginator.scss'
})
export class CustomPaginator {
  @Input() totalRecords: number = 0;
  @Input() rows: number = 20;
  @Input() first: number = 0;
  @Input() rowsPerPageOptions: number[] = [20, 50, 100];

  @Output() onPageChange = new EventEmitter<{ first: number; rows: number }>();
  @Output() rowsChange = new EventEmitter<number>();

  get currentPage(): number {
    return Math.floor(this.first / this.rows) + 1;
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.rows);
  }

  get visiblePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const current = this.currentPage;
    const total = this.totalPages;
    const maxVisible = 5;

    if (total <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current <= 3) {
        // Near the beginning: 1 2 3 4 5 ... 10
        for (let i = 2; i <= maxVisible; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 2) {
        // Near the end: 1 ... 6 7 8 9 10
        pages.push('...');
        for (let i = total - (maxVisible - 2); i <= total; i++) {
          pages.push(i);
        }
      } else {
        // In the middle: 1 ... 4 5 6 ... 10
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      }
    }

    return pages;
  }

  get showPrevEllipsis(): boolean {
    return this.currentPage > 3;
  }

  get showNextEllipsis(): boolean {
    return this.currentPage < this.totalPages - 2;
  }

  get firstRow(): number {
    return this.totalRecords === 0 ? 0 : this.first + 1;
  }

  get lastRow(): number {
    const last = this.first + this.rows;
    return last > this.totalRecords ? this.totalRecords : last;
  }

  onRowsChange(newRows: number): void {
    this.rows = newRows;
    this.rowsChange.emit(newRows);
    this.changePage(0);
  }

  changePage(newFirst: number): void {
    this.first = newFirst;
    this.onPageChange.emit({ first: this.first, rows: this.rows });
  }

  handlePageClick(page: number | string): void {
    if (typeof page === 'number') {
      this.goToPage(page);
    }
  }

  goToPage(page: number): void {
    this.changePage((page - 1) * this.rows);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.changePage(this.first - this.rows);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.first + this.rows);
    }
  }
}
