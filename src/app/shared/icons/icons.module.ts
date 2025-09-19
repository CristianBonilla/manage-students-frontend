import { NgModule } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as iconsPack from '@shared/icons';

@NgModule({
  declarations: [],
  exports: [FontAwesomeModule]
})
export class IconsModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(iconsPack);
  }
}
