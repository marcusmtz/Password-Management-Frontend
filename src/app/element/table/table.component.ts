import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Password } from '../../shared/models/password';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-table',
  imports: [CommonModule,RouterLink],
  templateUrl: './table.component.html'
})
export class TableComponent {
  @Input() title = '';
  @Input() passwords: Password[] = [];
  @Output() delete = new EventEmitter<number>();

  constructor(public router: Router) {}

  onDeleteClick(id: number) {
    this.delete.emit(id);
  }

  
}
