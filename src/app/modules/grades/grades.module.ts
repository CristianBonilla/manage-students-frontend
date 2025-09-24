import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '@directives/directives.module';
import { CreateGradeComponent } from '@modules/grades/components/create-grade/create-grade.component';
import { UpdateGradeComponent } from '@modules/grades/components/update-grade/update-grade.component';
import { GradesRoutingModule } from '@modules/grades/grades-routing.module';
import { GradesComponent } from '@modules/grades/grades.component';
import { GradeService } from '@modules/grades/services/grade.service';
import { gradesFeatureKey, reducer as gradesReducer } from '@modules/grades/store';
import { GradeEffects } from '@modules/grades/store/effects/grade.effects';
import { StudentService } from '@modules/students/services/student.service';
import { studentsFeatureKey, reducer as studentsReducer } from '@modules/students/store';
import { StudentEffects } from '@modules/students/store/effects/student.effects';
import { TeacherService } from '@modules/teachers/services/teacher.service';
import { teachersFeatureKey, reducer as teachersReducer } from '@modules/teachers/store';
import { TeacherEffects } from '@modules/teachers/store/effects/teacher.effects';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { IconsModule } from '@shared/icons/icons.module';
import { TEXT_FIELD_PROVIDER } from '@shared/providers/text-field.provider';
import { NgxCurrencyDirective } from 'ngx-currency';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';

@NgModule({
  declarations: [
    GradesComponent,
    CreateGradeComponent,
    UpdateGradeComponent
  ],
  imports: [
    CommonModule,
    GradesRoutingModule,
    EffectsModule.forFeature([GradeEffects, TeacherEffects, StudentEffects]),
    StoreModule.forFeature(gradesFeatureKey, gradesReducer),
    StoreModule.forFeature(teachersFeatureKey, teachersReducer),
    StoreModule.forFeature(studentsFeatureKey, studentsReducer),
    IconsModule,
    OverlayscrollbarsModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    NgxTrimDirectiveModule,
    DirectivesModule,
    NgxCurrencyDirective
  ],
  providers: [
    GradeService,
    TeacherService,
    StudentService,
    TEXT_FIELD_PROVIDER
  ]
})
export class GradesModule { }
