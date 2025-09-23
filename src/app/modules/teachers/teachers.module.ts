import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '@directives/directives.module';
import { CreateTeacherComponent } from '@modules/teachers/components/create-teacher/create-teacher.component';
import { TeacherService } from '@modules/teachers/services/teacher.service';
import { teachersFeatureKey, reducer as teachersReducer } from '@modules/teachers/store';
import { TeacherEffects } from '@modules/teachers/store/effects/teacher.effects';
import { TeachersRoutingModule } from '@modules/teachers/teachers-routing.module';
import { TeachersComponent } from '@modules/teachers/teachers.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { IconsModule } from '@shared/icons/icons.module';
import { TEXT_FIELD_PROVIDER } from '@shared/providers/text-field.provider';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';

@NgModule({
  declarations: [
    TeachersComponent,
    CreateTeacherComponent
  ],
  imports: [
    CommonModule,
    TeachersRoutingModule,
    EffectsModule.forFeature([TeacherEffects]),
    StoreModule.forFeature(teachersFeatureKey, teachersReducer),
    IconsModule,
    OverlayscrollbarsModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    NgxTrimDirectiveModule,
    DirectivesModule
  ],
  providers: [TeacherService, TEXT_FIELD_PROVIDER]
})
export class TeachersModule { }
