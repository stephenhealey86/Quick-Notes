/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppSettingsService } from './app-settings.service';
import { ElectronService } from 'ngx-electron';

describe('Service: AppSettings', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppSettingsService,
        ElectronService
      ]
    });
  });

  it('should ...', inject([AppSettingsService], (service: AppSettingsService) => {
    expect(service).toBeTruthy();
  }));
});
