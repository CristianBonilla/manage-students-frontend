import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StudentService } from '@modules/students/services/student.service';
import { studentsFeatureKey, reducer as studentsReducer } from '@modules/students/store';
import { StudentEffects } from '@modules/students/store/effects/student.effects';
import { StudentsRoutingModule } from '@modules/students/students-routing.module';
import { StudentsComponent } from '@modules/students/students.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [StudentsComponent],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    EffectsModule.forFeature([StudentEffects]),
    StoreModule.forFeature(studentsFeatureKey, studentsReducer)
  ],
  providers: [StudentService]
})
export class StudentsModule { }
