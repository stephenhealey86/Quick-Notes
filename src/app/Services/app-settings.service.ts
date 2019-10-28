import { Injectable } from '@angular/core';
import { NoteFrame } from '../Models/Note';
// import * as settings from 'electron-settings';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  Notes: NoteFrame[] = [];

constructor() {
  this.InitNotes();
 }

InitNotes() {
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
  this.Notes.push({
    Data: {
      Title: '',
      Content: '',
      Priority: 0
    },
    X: 0,
    Y: 0,
    Draggable: false,
    ZIndex: 0
  } as NoteFrame);
}


getNoteFrames(): NoteFrame[] {
  if (environment.production) {
    this.Notes = settings.get('notes');
  }
  return this.Notes;
}

setNoteFrames() {
  if (environment.production) {
    settings.set('notes', this.Notes);
  }
}

}
