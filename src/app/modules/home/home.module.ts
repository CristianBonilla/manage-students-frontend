import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FooterComponent } from '@modules/home/components/footer/footer.component';
import { NavbarComponent } from '@modules/home/components/navbar/navbar.component';
import { SidebarWrapperComponent } from '@modules/home/components/sidebar/sidebar-wrapper/sidebar-wrapper.component';
import { SidebarComponent } from '@modules/home/components/sidebar/sidebar.component';
import { ToggleSidebarDirective } from '@modules/home/directives/toggle-sidebar/toggle-sidebar.directive';
import { HomeRoutingModule } from '@modules/home/home-routing.module';
import { HomeComponent } from '@modules/home/home.component';
import { ToggleSidebarService } from '@modules/home/services/toggle-sidebar/toggle-sidebar.service';
import { IconsModule } from '@shared/icons/icons.module';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';

@NgModule({
  declarations: [
    HomeComponent,
    ToggleSidebarDirective,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    SidebarWrapperComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    IconsModule,
    OverlayscrollbarsModule
  ],
  providers: [ToggleSidebarService]
})
export class HomeModule { }
