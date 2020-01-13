import { Component, OnInit, Output, EventEmitter, NgZone } from '@angular/core';
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

  constructor(private electronService: ElectronService, private settings: AppSettingsService, private zone: NgZone) { }

  ngOnInit() {
    if (this.isRunningInElectron()) {
      // Get electron window if running in electron
      this.window = this.electronService.remote.getCurrentWindow();
      this.window.on('maximize', this.checkMaximizeIcon.bind(this));
      this.window.on('unmaximize', this.checkMaximizeIcon.bind(this));
    }
  }

  // Returns true if running in production, Electron is assumed to be true when in production
  private isRunningInElectron(): boolean {
    return environment.production;
  }

  checkMaximizeIcon(): void {
    if (this.isRunningInElectron()) {
      if (this.window.isMaximized()) {
        this.zone.run(() => {
          this.windowIsMaximised = true;
        });
      } else {
        this.zone.run(() => {
          this.windowIsMaximised = false;
        });
      }
    }
  }

  // Emits windowIsMaximised value
  emitWindowState(): void {
    this.windowState.emit(this.windowIsMaximised);
  }

  // Saves all notes, animates close window and closes window
  closeWindow(): void {
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
  minWindow(): void {
    if (this.isRunningInElectron()) {
      this.window.minimize();
    }
  }

  // Maximize the window
  maxWindow(): void {
    if (this.isRunningInElectron()) {
      if (this.windowIsMaximised) {
        this.windowIsMaximised = false;
        this.emitWindowState();
        this.window.unmaximize();
      } else {
        this.windowIsMaximised = true;
        this.emitWindowState();
        this.window.maximize();
      }
    }
  }
}
