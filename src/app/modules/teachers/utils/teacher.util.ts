import { TeacherResponse } from '@modules/teachers/models/teacher.model';
import { compareBy } from '@shared/utils/sort.util';

export function getTeachersOrganized(teachers: TeacherResponse[]) {
  return [...teachers]
    .sort((teacherA, teacherB) =>
      compareBy<TeacherResponse>('documentNumber')(teacherA, teacherB) ||
      compareBy<TeacherResponse>('firstname')(teacherA, teacherB) ||
      compareBy<TeacherResponse>('lastname')(teacherA, teacherB)
    );
}

export function addAndGetTeachers(teacherRequest: TeacherResponse, teachers: TeacherResponse[]) {
  return getTeachersOrganized([...teachers, teacherRequest]);
}

export function updateAndGetTeachers(
  updatedTeacher: TeacherResponse,
  teachers: TeacherResponse[]
) {
  return getTeachersOrganized(
    teachers.map(teacher => teacher.teacherId === updatedTeacher.teacherId ? {
      ...teacher,
      ...updatedTeacher
    } : teacher)
  );
}

export function deleteAndGetTeachers(
  deletedTeacher: TeacherResponse,
  teachers: TeacherResponse[]
) {
  return getTeachersOrganized(
    teachers.filter(teacher => teacher.teacherId !== deletedTeacher.teacherId)
  );
}
