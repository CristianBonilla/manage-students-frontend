import { StudentResponse } from '@modules/students/models/student.model';
import { compareBy } from '@shared/utils/sort.util';

export function getStudentsOrganized(students: StudentResponse[]) {
  return [...students]
    .sort((studentA, studentB) =>
      compareBy<StudentResponse>('documentNumber')(studentA, studentB) ||
      compareBy<StudentResponse>('firstname')(studentA, studentB) ||
      compareBy<StudentResponse>('lastname')(studentA, studentB)
    );
}

export function addAndGetStudents(studentRequest: StudentResponse, students: StudentResponse[]) {
  return getStudentsOrganized([...students, studentRequest]);
}

export function updateAndGetStudents(
  updatedStudent: StudentResponse,
  students: StudentResponse[]
) {
  return getStudentsOrganized(
    students.map(student => student.studentId === updatedStudent.studentId ? {
      ...student,
      ...updatedStudent
    } : student)
  );
}

export function deleteAndGetStudents(
  deletedStudent: StudentResponse,
  students: StudentResponse[]
) {
  return getStudentsOrganized(
    students.filter(student => student.studentId !== deletedStudent.studentId)
  );
}
