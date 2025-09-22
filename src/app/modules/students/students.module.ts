import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '@directives/directives.module';
import { CreateStudentComponent } from '@modules/students/components/create-student/create-student.component';
import { DeleteStudentComponent } from '@modules/students/components/delete-student/delete-student.component';
import { StudentInfoComponent } from '@modules/students/components/student-info/student-info.component';
import { UpdateStudentComponent } from '@modules/students/components/update-student/update-student.component';
import { StudentService } from '@modules/students/services/student.service';
import { studentsFeatureKey, reducer as studentsReducer } from '@modules/students/store';
import { StudentEffects } from '@modules/students/store/effects/student.effects';
import { StudentsRoutingModule } from '@modules/students/students-routing.module';
import { StudentsComponent } from '@modules/students/students.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { IconsModule } from '@shared/icons/icons.module';
import { TEXT_FIELD_PROVIDER } from '@shared/providers/text-field.provider';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';

@NgModule({
  declarations: [
    StudentsComponent,
    CreateStudentComponent,
    UpdateStudentComponent,
    DeleteStudentComponent,
    StudentInfoComponent
  ],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    EffectsModule.forFeature([StudentEffects]),
    StoreModule.forFeature(studentsFeatureKey, studentsReducer),
    IconsModule,
    OverlayscrollbarsModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    NgxTrimDirectiveModule,
    DirectivesModule
  ],
  providers: [StudentService, TEXT_FIELD_PROVIDER]
})
export class StudentsModule { }
