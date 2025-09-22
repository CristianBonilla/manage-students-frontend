import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateStudentComponent } from '@modules/students/components/create-student/create-student.component';
import { DeleteStudentComponent } from '@modules/students/components/delete-student/delete-student.component';
import { UpdateStudentComponent } from '@modules/students/components/update-student/update-student.component';
import { StudentsComponent } from '@modules/students/students.component';

const routes: Routes = [
  {
    path: '',
    component: StudentsComponent,
    children: [
      {
        path: 'create',
        component: CreateStudentComponent
      },
      {
        path: 'update/:studentId',
        component: UpdateStudentComponent
      },
      {
        path: 'delete/:studentId',
        component: DeleteStudentComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule { }
