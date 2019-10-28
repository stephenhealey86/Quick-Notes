import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TitleBarComponent } from 'src/app/Components/title-bar/title-bar.component';
import { NgxElectronModule } from 'ngx-electron';
import { MainComponent } from './Components/main/main.component';
import { FormsModule } from '@angular/forms';
import { AppSettingsService } from './Services/app-settings.service';

@NgModule({
  declarations: [
    AppComponent,
    TitleBarComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxElectronModule,
    FormsModule,
  ],
  providers: [
    AppSettingsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
