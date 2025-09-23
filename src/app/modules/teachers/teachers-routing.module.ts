import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateTeacherComponent } from '@modules/teachers/components/create-teacher/create-teacher.component';
import { DeleteTeacherComponent } from '@modules/teachers/components/delete-teacher/delete-teacher.component';
import { UpdateTeacherComponent } from '@modules/teachers/components/update-teacher/update-teacher.component';
import { TeachersComponent } from '@modules/teachers/teachers.component';

const routes: Routes = [
  {
    path: '',
    component: TeachersComponent,
    children: [
      {
        path: 'create',
        component: CreateTeacherComponent
      },
      {
        path: 'update/:teacherId',
        component: UpdateTeacherComponent
      },
      {
        path: 'delete/:teacherId',
        component: DeleteTeacherComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeachersRoutingModule { }
