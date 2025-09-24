import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateGradeComponent } from '@modules/grades/components/create-grade/create-grade.component';
import { GradesComponent } from '@modules/grades/grades.component';

const routes: Routes = [
  {
    path: '',
    component: GradesComponent,
    children: [
      {
        path: 'create',
        component: CreateGradeComponent
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GradesRoutingModule { }
