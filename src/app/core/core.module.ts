import { NgModule } from '@angular/core';
import { localeIDProvider } from '@core/providers/locale.provider';
import { WINDOW_PROVIDERS } from '@core/providers/window.provider';

@NgModule({
  declarations: [],
  imports: [],
  providers: [WINDOW_PROVIDERS, localeIDProvider]
})
export class CoreModule {}
