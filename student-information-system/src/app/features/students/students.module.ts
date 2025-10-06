import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { StudentsRoutingModule } from './students-routing.module';
import { OverviewComponent } from './overview/overview.component';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { PopoverModule } from 'primeng/popover';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

import { ConfirmationService, MessageService } from 'primeng/api';

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DatePickerModule,
    DialogModule,
    SelectModule,
    InputTextModule,
    MultiSelectModule,
    PaginatorModule,
    ConfirmDialogModule,
    ToolbarModule,
    TagModule,
    ToastModule,
    TooltipModule,
    PopoverModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class StudentsModule {}
