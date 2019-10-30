import { Injectable } from '@angular/core';
import { NoteFrame } from '../Models/Note';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  private Notes: NoteFrame[] = [];

constructor() {
  this.getNoteFrames();
 }

InitNotes(): NoteFrame[] {
  const notes: NoteFrame[] = [];

  notes.push({
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
  notes.push({
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

  return notes;
}

getNoteFrames(): NoteFrame[] {
  // Temp get Notes
  this.Notes = this.InitNotes();
  if (environment.production) {
    // Get notes from storage
  }
  return this.Notes;
}

setNoteFrames() {
  if (environment.production) {
    // Store notes
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
