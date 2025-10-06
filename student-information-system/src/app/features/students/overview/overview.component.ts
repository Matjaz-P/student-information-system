import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';

import { StudentService } from '@services/student.service';
import { Student } from '@models/student.model';
import { Course } from '@models/course.model';

type StudentFormValue = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  birthdate: Date | string | null;
  enrolledCourses: Array<number | string> | null;
};

@Component({
  selector: 'app-overview',
  standalone: false,
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  students: Student[] = [];
  courses: Course[] = [];
  displayAddDialog = false;
  displayEditDialog = false;
  studentForm!: FormGroup;
  editForm!: FormGroup;
  selectedStudent: Student | null = null;
  rows = 20;
  first = 0;
  rowsPerPageOptions = [20, 50, 100];

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadCourses();
  }

  initializeForms(): void {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      birthdate: [null, Validators.required],
      enrolledCourses: [[], Validators.required]
    });

    this.editForm = this.fb.group({
      enrolledCourses: [[], Validators.required]
    });
  }

  private getStudentFormResetValue(): StudentFormValue {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      birthdate: null,
      enrolledCourses: []
    };
  }

  loadStudents(): void {
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students = [...data].sort((a, b) => b.id - a.id);
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load students'
        });
      }
    });
  }

  loadCourses(): void {
    this.studentService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
      }
    });
  }

  openAddDialog(): void {
    this.studentForm.reset(this.getStudentFormResetValue());
    this.displayAddDialog = true;
  }

  closeAddDialog(): void {
    this.displayAddDialog = false;
    this.studentForm.reset(this.getStudentFormResetValue());
  }

  openEditDialog(student: Student): void {
    this.selectedStudent = student;
    this.editForm.patchValue({
      enrolledCourses: student.enrolledCourses
    });
    this.displayEditDialog = true;
  }

  closeEditDialog(): void {
    this.displayEditDialog = false;
    this.selectedStudent = null;
    this.editForm.reset({
      enrolledCourses: []
    });
  }

  addStudent(): void {
    if (!this.studentForm.valid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    const formValue = this.studentForm.value as StudentFormValue;
    const firstName = (formValue.firstName ?? '').trim();
    const lastName = (formValue.lastName ?? '').trim();
    const email = (formValue.email ?? '').trim();
    const phoneNumber = (formValue.phoneNumber ?? '').trim();
    const birthdate = this.formatBirthdateForSave(formValue.birthdate);
    const enrolledCourses = this.normalizeCourseIds(formValue.enrolledCourses);

    if (!birthdate) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Birthdate format is invalid'
      });
      return;
    }

    const newStudent: Omit<Student, 'id'> = {
      firstName,
      lastName,
      email,
      phoneNumber,
      birthdate,
      enrolledCourses
    };

    this.studentService.createStudent(newStudent).subscribe({
      next: (student) => {
        this.students = [student, ...this.students];
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Student added successfully'
        });
        this.closeAddDialog();
      },
      error: (error) => {
        console.error('Error adding student:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add student'
        });
      }
    });
  }

  updateStudentCourses(): void {
    if (!this.editForm.valid || !this.selectedStudent) {
      this.editForm.markAllAsTouched();
      return;
    }

    const enrolledCourses = this.normalizeCourseIds(this.editForm.value.enrolledCourses);

    this.studentService.updateStudentCourses(this.selectedStudent.id, enrolledCourses).subscribe({
      next: (updatedStudent) => {
        const index = this.students.findIndex((s) => s.id === updatedStudent.id);
        if (index !== -1) {
          this.students = [
            ...this.students.slice(0, index),
            updatedStudent,
            ...this.students.slice(index + 1)
          ];
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Courses updated successfully'
        });
        this.closeEditDialog();
      },
      error: (error) => {
        console.error('Error updating courses:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update courses'
        });
      }
    });
  }

  deleteStudent(student: Student): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${student.firstName} ${student.lastName}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptIcon: 'pi pi-trash',
      rejectIcon: 'pi pi-times',
      accept: () => {
        this.studentService.deleteStudent(student.id).subscribe({
          next: () => {
            this.students = this.students.filter((s) => s.id !== student.id);
            const totalRecords = this.students.length;
            const maxPageIndex = totalRecords === 0 ? 0 : Math.ceil(totalRecords / this.rows) - 1;
            const maxFirst = maxPageIndex * this.rows;

            if (this.first > maxFirst) {
              this.first = maxFirst;
            }

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Student deleted successfully'
            });
          },
          error: (error) => {
            console.error('Error deleting student:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete student'
            });
          }
        });
      }
    });
  }

  getFormattedBirthdate(birthdate: string): string {
    return this.formatBirthdateForDisplay(birthdate);
  }

  getCourseNames(courseIds: number[]): string[] {
    return courseIds
      .map((id) => {
        const course = this.courses.find((c) => c.id === id);
        return course ? course.name : '';
      })
      .filter((name) => name !== '');
  }

  getFullName(student: Student): string {
    return `${student.firstName} ${student.lastName}`;
  }

  getInitials(student: Student): string {
    const firstInitial = student.firstName.charAt(0).toUpperCase();
    const lastInitial = student.lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }

  getVisibleCourses(courseIds: number[]): string[] {
    const maxVisible = 2;
    return courseIds
      .slice(0, maxVisible)
      .map((id) => {
        const course = this.courses.find((c) => c.id === id);
        return course ? course.name : '';
      })
      .filter((name) => name !== '');
  }

  getRemainingCourses(courseIds: number[]): string[] {
    return courseIds
      .slice(2)
      .map((id) => {
        const course = this.courses.find((c) => c.id === id);
        return course ? course.name : '';
      })
      .filter((name) => name !== '');
  }

  customSort(event: SortEvent): void {
    if (!event.data || !event.field) {
      return;
    }

    event.data.sort((data1, data2) => {
      const value1 = data1[event.field!];
      const value2 = data2[event.field!];
      let result = 0;

      if (event.field === 'id') {
        result = (value1 as number) - (value2 as number);
      } else if (event.field === 'birthdate') {
        result = this.parseDateForSort(value1 as string) - this.parseDateForSort(value2 as string);
      } else if (value1 == null && value2 != null) {
        result = -1;
      } else if (value1 != null && value2 == null) {
        result = 1;
      } else if (value1 == null && value2 == null) {
        result = 0;
      } else if (typeof value1 === 'string' && typeof value2 === 'string') {
        result = value1.localeCompare(value2, 'sl-SI', { sensitivity: 'base' });
      } else {
        result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
      }

      return event.order! * result;
    });
  }

  getTotalRecords(): number {
    return this.students.length;
  }

  getFirstRow(): number {
    return this.students.length === 0 ? 0 : this.first + 1;
  }

  getLastRow(): number {
    const last = this.first + this.rows;
    return last > this.students.length ? this.students.length : last;
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  get currentPage(): number {
    return Math.floor(this.first / this.rows) + 1;
  }

  get totalPages(): number {
    return Math.ceil(this.students.length / this.rows);
  }

  getPageNumbers(): (number | string)[] {
    const current = this.currentPage;
    const total = this.totalPages;
    const maxVisible = 5;
    const pages: (number | string)[] = [];

    if (total <= maxVisible + 2) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (current <= 3) {
        for (let i = 2; i <= maxVisible; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 2) {
        pages.push('...');
        for (let i = total - (maxVisible - 2); i <= total; i++) {
          pages.push(i);
        }
      } else {
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

  handlePageClick(page: number | string): void {
    if (typeof page === 'number') {
      this.goToPage(page);
    }
  }

  goToPage(page: number): void {
    this.first = (page - 1) * this.rows;
  }

  private normalizeCourseIds(courseIds: Array<number | string> | null | undefined): number[] {
    if (!courseIds) {
      return [];
    }

    return courseIds
      .map((value) => Number(value))
      .filter((value) => !Number.isNaN(value));
  }

  private formatBirthdateForSave(value: Date | string | null): string {
    if (!value) {
      return '';
    }

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return new Intl.DateTimeFormat('sl-SI', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
        .format(value)
        .replace(/\./g, '/')
        .replace(/\s/g, '');
    }

    if (typeof value !== 'string') {
      return '';
    }

    const trimmed = value.trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [year, month, day] = trimmed.split('-');
      return `${day}/${month}/${year}`;
    }

    if (/^\d{2}[\/.]\d{2}[\/.]\d{2,4}$/.test(trimmed)) {
      const normalized = trimmed.replace(/\./g, '/');
      const [day, month, yearToken] = normalized.split('/');
      const year = yearToken.length === 2 ? `20${yearToken}` : yearToken.padStart(4, '0');
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }

    return '';
  }

  private formatBirthdateForDisplay(value: string): string {
    if (!value) {
      return '-';
    }

    const trimmed = value.trim();

    if (/^\d{2}[\/.]\d{2}[\/.]\d{4}$/.test(trimmed)) {
      return trimmed.replace(/\./g, '/');
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [year, month, day] = trimmed.split('-');
      return `${day}/${month}/${year}`;
    }

    return trimmed;
  }

  private parseDateForSort(value: string): number {
    if (!value) {
      return Number.NEGATIVE_INFINITY;
    }

    const trimmed = value.trim();
    let isoString = trimmed;

    if (/^\d{2}[\/.]\d{2}[\/.]\d{4}$/.test(trimmed)) {
      const normalized = trimmed.replace(/\./g, '/');
      const [day, month, year] = normalized.split('/');
      isoString = `${year}-${month}-${day}`;
    } else if (/^\d{2}[\/.]\d{2}[\/.]\d{2}$/.test(trimmed)) {
      const normalized = trimmed.replace(/\./g, '/');
      const [day, month, yearToken] = normalized.split('/');
      isoString = `20${yearToken}-${month}-${day}`;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(isoString)) {
      return Number.NEGATIVE_INFINITY;
    }

    return new Date(`${isoString}T00:00:00Z`).getTime();
  }
}
