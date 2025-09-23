import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TeacherService } from '@modules/teachers/services/teacher.service';
import { teachersFeatureKey, reducer as teachersReducer } from '@modules/teachers/store';
import { TeacherEffects } from '@modules/teachers/store/effects/teacher.effects';
import { TeachersRoutingModule } from '@modules/teachers/teachers-routing.module';
import { TeachersComponent } from '@modules/teachers/teachers.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [TeachersComponent],
  imports: [
    CommonModule,
    TeachersRoutingModule,
    EffectsModule.forFeature([TeacherEffects]),
    StoreModule.forFeature(teachersFeatureKey, teachersReducer),
  ],
  providers: [TeacherService]
})
export class TeachersModule { }
