import { GradeResponseExtended } from '@modules/grades/models/grade.model';

export function getGradesOrganized(grades: GradeResponseExtended[]) {
  return [...grades]
    .sort((gradeA, gradeB) => gradeB.value - gradeA.value);
}

export function addAndGetGrades(gradeRequest: GradeResponseExtended, grades: GradeResponseExtended[]) {
  return getGradesOrganized([...grades, gradeRequest]);
}

export function updateAndGetGrades(
  updatedGrade: GradeResponseExtended,
  grades: GradeResponseExtended[]
) {
  return getGradesOrganized(
    grades.map(grade => grade.gradeId === updatedGrade.gradeId ? {
      ...grade,
      ...updatedGrade
    } : grade)
  );
}

export function deleteAndGetGrades(
  deletedGrade: GradeResponseExtended,
  grades: GradeResponseExtended[]
) {
  return getGradesOrganized(
    grades.filter(grade => grade.gradeId !== deletedGrade.gradeId)
  );
}
