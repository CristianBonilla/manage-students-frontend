import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TeacherService } from '@modules/teachers/services/teacher.service';
import { TeachersRoutingModule } from '@modules/teachers/teachers-routing.module';
import { TeachersComponent } from '@modules/teachers/teachers.component';

@NgModule({
  declarations: [TeachersComponent],
  imports: [
    CommonModule,
    TeachersRoutingModule
  ],
  providers: [TeacherService]
})
export class TeachersModule { }
