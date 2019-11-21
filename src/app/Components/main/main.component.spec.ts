/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MainComponent } from './main.component';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AppSettingsService } from 'src/app/Services/app-settings.service';
import { ElectronService } from 'ngx-electron';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let service: AppSettingsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TooltipModule.forRoot(),
        FormsModule
      ],
      declarations: [ MainComponent ],
      providers: [
        AppSettingsService,
        ElectronService
      ],
    })
    .compileComponents();
    service = TestBed.get(AppSettingsService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('passFocusToTextArea should throw error', () => {
    expect(() => { component.passFocusToTextArea(null, null); }).toThrow();
  });
});
