import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GradesRoutingModule } from '@modules/grades/grades-routing.module';
import { GradesComponent } from '@modules/grades/grades.component';


@NgModule({
  declarations: [GradesComponent],
  imports: [
    CommonModule,
    GradesRoutingModule
  ]
})
export class GradesModule { }
