import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { TitleBarComponent } from './Components/title-bar/title-bar.component';
import { MainComponent } from './Components/main/main.component';
import { SideBarComponent } from './Components/side-bar/side-bar.component';
import { ConfirmComponent } from './Components/confirm/confirm.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgxElectronModule, ElectronService } from 'ngx-electron';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AppSettingsService } from './Services/app-settings.service';
import { ConfirmationService } from './Services/confirmation.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        AppRoutingModule,
        NgxElectronModule,
        FormsModule,
        TooltipModule.forRoot(),
        RouterTestingModule,
      ],
      declarations: [
        AppComponent,
        TitleBarComponent,
        MainComponent,
        SideBarComponent,
        ConfirmComponent
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'QuickNotes'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('QuickNotes');
  });
});
