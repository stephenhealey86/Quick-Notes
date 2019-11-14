/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { SideBarComponent } from './side-bar.component';
import { FormsModule } from '@angular/forms';
import { AppSettingsService } from 'src/app/Services/app-settings.service';
import { ElectronService } from 'ngx-electron';

describe('SideBarComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TooltipModule.forRoot(),
        FormsModule
      ],
      declarations: [ SideBarComponent ],
      providers: [
        AppSettingsService,
        ElectronService
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
