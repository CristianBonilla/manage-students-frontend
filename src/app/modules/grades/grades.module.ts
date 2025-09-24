import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GradesRoutingModule } from '@modules/grades/grades-routing.module';
import { GradesComponent } from '@modules/grades/grades.component';
import { GradeService } from '@modules/grades/services/grade.service';

@NgModule({
  declarations: [GradesComponent],
  imports: [
    CommonModule,
    GradesRoutingModule
  ],
  providers: [GradeService]
})
export class GradesModule { }
