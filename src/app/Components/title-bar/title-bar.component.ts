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

  //#region Variables
  // Emits windowIsMaximized
  @Output() windowState = new EventEmitter();
  // True is window is maximized
  windowIsMaximised = false;
  // Electron window
  window = {} as Electron.BrowserWindow;
  //#endregion

  constructor(private electronService: ElectronService, private settings: AppSettingsService) { }

  ngOnInit() {
    if (environment.production) {
      // Get electron window if running in electron
      this.window = this.electronService.remote.getCurrentWindow();
    }
  }

  // Emits windowIsMaximised value
  EmitWindowState() {
    this.windowState.emit(this.windowIsMaximised);
  }

  // Saves all notes, animates close window and closes window
  closeWindow() {
    // Store notes
    this.settings.saveNoteFramesToStorage();
    // Annimate
    const DIV = document.getElementsByClassName('open-app')[0] as HTMLElement;
    DIV.style.transformOrigin = 'bottom left';
    DIV.style.transitionDuration = '500ms';
    DIV.style.transitionTimingFunction = 'linear';
    DIV.style.transform = 'scale(0,0)';
    if (environment.production) {
      // Close window after animation
      setTimeout(() => this.window.close(), 1000);
    }
  }

  // Minimize the window
  minWindow() {
    if (environment.production) {
      this.window.minimize();
    }
  }

  // Maximize the window
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
