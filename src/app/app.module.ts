import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TitleBarComponent } from 'src/app/Components/title-bar/title-bar.component';
import { NgxElectronModule, ElectronService } from 'ngx-electron';
import { MainComponent } from './Components/main/main.component';
import { FormsModule } from '@angular/forms';
import { AppSettingsService } from './Services/app-settings.service';
import { SideBarComponent } from './Components/side-bar/side-bar.component';
import { ConfirmComponent } from './Components/confirm/confirm.component';
import { ConfirmationService } from './Services/confirmation.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    TitleBarComponent,
    MainComponent,
    SideBarComponent,
    ConfirmComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxElectronModule,
    FormsModule,
    TooltipModule.forRoot(),
  ],
  providers: [
    AppSettingsService,
    ConfirmationService,
    ElectronService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
