import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '@directives/directives.module';
import { GradesRoutingModule } from '@modules/grades/grades-routing.module';
import { GradesComponent } from '@modules/grades/grades.component';
import { GradeService } from '@modules/grades/services/grade.service';
import { gradesFeatureKey, reducer as gradesReducer } from '@modules/grades/store';
import { GradeEffects } from '@modules/grades/store/effects/grade.effects';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { IconsModule } from '@shared/icons/icons.module';
import { TEXT_FIELD_PROVIDER } from '@shared/providers/text-field.provider';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';

@NgModule({
  declarations: [GradesComponent],
  imports: [
    CommonModule,
    GradesRoutingModule,
    EffectsModule.forFeature([GradeEffects]),
    StoreModule.forFeature(gradesFeatureKey, gradesReducer),
    IconsModule,
    OverlayscrollbarsModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    NgxTrimDirectiveModule,
    DirectivesModule
  ],
  providers: [GradeService, TEXT_FIELD_PROVIDER]
})
export class GradesModule { }
