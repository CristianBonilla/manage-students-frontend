import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '@directives/directives.module';
import { StudentService } from '@modules/students/services/student.service';
import { studentsFeatureKey, reducer as studentsReducer } from '@modules/students/store';
import { StudentEffects } from '@modules/students/store/effects/student.effects';
import { StudentsRoutingModule } from '@modules/students/students-routing.module';
import { StudentsComponent } from '@modules/students/students.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { IconsModule } from '@shared/icons/icons.module';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';

@NgModule({
  declarations: [StudentsComponent],
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
  providers: [StudentService]
})
export class StudentsModule { }
