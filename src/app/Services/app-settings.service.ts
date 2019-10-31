import { Injectable } from '@angular/core';
import { NoteFrame } from '../Models/Note';
import { environment } from 'src/environments/environment';
import { ElectronService } from 'ngx-electron';
import * as settings from 'electron-settings';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  Notes: NoteFrame[] = [];
  settings: typeof settings;

constructor(private electronService: ElectronService) {

  if (environment.production) {
    this.settings = this.electronService.remote.require('electron-settings');
  }

  this.getNoteFrames();
 }

getNoteFrames(): NoteFrame[] {
  // Temp get Notes
  if (environment.production) {
    // Get notes from storage
    this.Notes = this.settings.get('notes');
    if (this.Notes === null || this.Notes === undefined) {
      this.Notes = [] as NoteFrame[];
    }
  } else {
    this.Notes = JSON.parse(localStorage.getItem('notes'));
    if (this.Notes === null || this.Notes === undefined) {
      this.Notes = [] as NoteFrame[];
    }
  }
  return this.Notes;
}

setNoteFrames() {
  if (environment.production) {
    // Store notes
    this.settings.set('notes', this.Notes);
  } else {
    localStorage.setItem('notes', JSON.stringify(this.Notes));
  }
}

addNewNote() {
  this.Notes.push({
    Data: {
      Title: '',
      Content: '',
      Priority: 0,
    },
    X: 100,
    Y: 100,
    Draggable: false,
    ZIndex: 0
  } as NoteFrame);
}

}
