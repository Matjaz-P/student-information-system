import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Student } from '@models/student.model';
import { Course } from '@models/course.model';

type StudentApi = Omit<Student, 'id' | 'enrolledCourses' | 'birthdate'> & {
  id: number | string;
  enrolledCourses: Array<number | string>;
  birthdate: string | null;
};

type CourseApi = Omit<Course, 'id'> & {
  id: number | string;
};

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly apiUrl = environment.apiUrl;
  private nextId = 1;

  constructor(private http: HttpClient) {}

  private normalizeStudent(student: StudentApi): Student {
    const numericId = this.toNumericId(student.id);
    this.updateNextId(numericId);

    return {
      ...student,
      id: numericId,
      birthdate: this.toSlovenianDate(student.birthdate ?? ''),
      enrolledCourses: this.toNumericCourseIds(student.enrolledCourses)
    };
  }

  private normalizeCourse(course: CourseApi): Course {
    const numericId = this.toNumericId(course.id);
    return {
      ...course,
      id: numericId
    };
  }

  private updateNextId(candidate: number): void {
    if (candidate >= this.nextId) {
      this.nextId = candidate + 1;
    }
  }

  private toNumericId(value: number | string): number {
    const numeric = Number(value);

    if (!Number.isInteger(numeric) || numeric < 0) {
      throw new Error(`Invalid id value received: ${value}`);
    }

    return numeric;
  }

  private toNumericCourseIds(courseIds: Array<number | string> | undefined): number[] {
    if (!courseIds) {
      return [];
    }

    return courseIds.map((courseId) => this.toNumericId(courseId));
  }

  private toSlovenianDate(date: string): string {
    if (!date) {
      return '';
    }

    const trimmed = date.trim();

    if (/^\d{2}[\/.]\d{2}[\/.]\d{4}$/.test(trimmed)) {
      return trimmed.replace(/\./g, '/');
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [year, month, day] = trimmed.split('-');
      return `${day}/${month}/${year}`;
    }

    return trimmed;
  }

  private toIsoDate(date: string | Date): string {
    if (!date) {
      return '';
    }

    if (date instanceof Date) {
      return date.toISOString().slice(0, 10);
    }

    const trimmed = date.trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }

    const tokens = trimmed.split(/[\/.]/);
    if (tokens.length === 3) {
      const [day, month, yearToken] = tokens;
      const year = yearToken.length === 2 ? `20${yearToken}` : yearToken;
      const paddedDay = day.padStart(2, '0');
      const paddedMonth = month.padStart(2, '0');
      return `${year.padStart(4, '0')}-${paddedMonth}-${paddedDay}`;
    }

    return trimmed;
  }

  getStudents(): Observable<Student[]> {
    this.nextId = 1;

    return this.http.get<StudentApi[]>(`${this.apiUrl}/students`).pipe(
      map((students) => students.map((student) => this.normalizeStudent(student)))
    );
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<StudentApi>(`${this.apiUrl}/students/${id}`).pipe(
      map((student) => this.normalizeStudent(student))
    );
  }

  createStudent(student: Omit<Student, 'id'>): Observable<Student> {
    const assignedId = this.nextId++;

    const payload = {
      ...student,
      id: assignedId,
      birthdate: this.toIsoDate(student.birthdate),
      enrolledCourses: this.toNumericCourseIds(student.enrolledCourses)
    };

    return this.http.post<StudentApi>(`${this.apiUrl}/students`, payload).pipe(
      map((createdStudent) => this.normalizeStudent(createdStudent))
    );
  }

  updateStudent(id: number, student: Partial<Student>): Observable<Student> {
    const payload: Partial<StudentApi> = {
      ...student,
      ...(student.birthdate !== undefined
        ? { birthdate: this.toIsoDate(student.birthdate) }
        : {}),
      ...(student.enrolledCourses !== undefined
        ? { enrolledCourses: this.toNumericCourseIds(student.enrolledCourses) }
        : {})
    };

    return this.http.patch<StudentApi>(`${this.apiUrl}/students/${id}`, payload).pipe(
      map((updatedStudent) => this.normalizeStudent(updatedStudent))
    );
  }

  updateStudentCourses(id: number, enrolledCourses: number[]): Observable<Student> {
    const payload = {
      enrolledCourses: this.toNumericCourseIds(enrolledCourses)
    };

    return this.http.patch<StudentApi>(`${this.apiUrl}/students/${id}`, payload).pipe(
      map((updatedStudent) => this.normalizeStudent(updatedStudent))
    );
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/students/${id}`);
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<CourseApi[]>(`${this.apiUrl}/courses`).pipe(
      map((courses) => courses.map((course) => this.normalizeCourse(course)))
    );
  }
}
