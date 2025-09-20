import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StudentService } from '@modules/students/services/student.service';
import { StudentsRoutingModule } from '@modules/students/students-routing.module';
import { StudentsComponent } from '@modules/students/students.component';

@NgModule({
  declarations: [StudentsComponent],
  imports: [
    CommonModule,
    StudentsRoutingModule
  ],
  providers: [StudentService]
})
export class StudentsModule { }
