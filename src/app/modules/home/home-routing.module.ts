import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@modules/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'students',
        loadChildren: () => import('@modules/students/students.module')
          .then(module => module.StudentsModule)
      },
      {
        path: 'teachers',
        loadChildren: () => import('@modules/teachers/teachers.module')
          .then(module => module.TeachersModule)
      },
      {
        path: '',
        redirectTo: 'students',
        pathMatch: 'prefix'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
