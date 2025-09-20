import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HomeRoutingModule } from '@modules/home/home-routing.module';
import { HomeComponent } from '@modules/home/home.component';
import { ToggleSidebarService } from '@modules/home/services/toggle-sidebar/toggle-sidebar.service';
import { IconsModule } from '@shared/icons/icons.module';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    IconsModule,
    OverlayscrollbarsModule
  ],
  providers: [ToggleSidebarService]
})
export class HomeModule { }
