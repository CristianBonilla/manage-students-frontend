import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormErrorHandlerDirective } from '@directives/form-error-handler/form-error-handler.directive';

@NgModule({
  declarations: [FormErrorHandlerDirective],
  imports: [CommonModule],
  exports: [FormErrorHandlerDirective]
})
export class DirectivesModule { }
