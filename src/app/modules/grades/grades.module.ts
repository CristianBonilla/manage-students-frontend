import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GradesRoutingModule } from '@modules/grades/grades-routing.module';
import { GradesComponent } from '@modules/grades/grades.component';
import { GradeService } from '@modules/grades/services/grade.service';
import { gradesFeatureKey, reducer as gradesReducer } from '@modules/grades/store';
import { GradeEffects } from '@modules/grades/store/effects/grade.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [GradesComponent],
  imports: [
    CommonModule,
    GradesRoutingModule,
    EffectsModule.forFeature([GradeEffects]),
    StoreModule.forFeature(gradesFeatureKey, gradesReducer),
  ],
  providers: [GradeService]
})
export class GradesModule { }
