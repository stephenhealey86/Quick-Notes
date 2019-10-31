import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { environment } from 'src/environments/environment';
import { AppSettingsService } from 'src/app/Services/app-settings.service';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.css']
})
export class TitleBarComponent implements OnInit {

  @Output() windowState = new EventEmitter();
  windowIsMaximised = false;
  window = {} as Electron.BrowserWindow;

  constructor(private electronService: ElectronService, private settings: AppSettingsService) { }

  ngOnInit() {
    if (environment.production) {
      this.window = this.electronService.remote.getCurrentWindow();
    }
  }

  EmitWindowState() {
    this.windowState.emit(this.windowIsMaximised);
  }

  closeWindow() {
    // Store notes
    this.settings.setNoteFrames();
    if (environment.production) {
      // Close window
      this.window.close();
    }
  }

  minWindow() {
    if (environment.production) {
      this.window.minimize();
    }
  }

  maxWindow() {
    if (environment.production) {
      if (this.windowIsMaximised) {
        this.windowIsMaximised = false;
        this.EmitWindowState();
        this.window.unmaximize();
      } else {
        this.windowIsMaximised = true;
        this.EmitWindowState();
        this.window.maximize();
      }
    }
  }
}
