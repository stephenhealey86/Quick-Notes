import { Injectable } from '@angular/core';
import { NoteFrame, NotePage } from '../Models/Note';
import { environment } from 'src/environments/environment';
import { ElectronService } from 'ngx-electron';
import * as settings from 'electron-settings';
import { ConfirmationService } from './confirmation.service';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  SelectedPage = 0;
  NotesPages: NotePage[] = [];
  // Notes: NoteFrame[] = [];
  get Notes(): NoteFrame[] {
    return this.NotesPages[this.SelectedPage].Data;
  }
  set Notes(value: NoteFrame[]) {
    this.NotesPages[this.SelectedPage].Data = value;
  }
  settings: typeof settings;

constructor(private electronService: ElectronService, private Confirmation: ConfirmationService) {

  if (environment.production) {
    this.settings = this.electronService.remote.require('electron-settings');
  }

  this.getNoteFrames();
 }

getNoteFrames() {
  // Temp get Notes
  if (environment.production) {
    // Get notes from storage
    this.NotesPages = this.settings.get('notes');
    if (this.NotesPages === null || this.NotesPages === undefined) {
      this.NotesPages = [new NotePage()] as NotePage[];
    }
  } else {
    this.NotesPages = JSON.parse(localStorage.getItem('notes'));
    if (this.NotesPages === null || this.NotesPages === undefined) {
      this.NotesPages = [new NotePage()] as NotePage[];
    }
  }
}

setNoteFrames() {
  if (environment.production) {
    // Store notes
    this.settings.set('notes', this.NotesPages);
  } else {
    localStorage.setItem('notes', JSON.stringify(this.NotesPages));
  }
}

addNewNote() {
  this.Notes.push(new NoteFrame());
}

addNewPage() {
  this.NotesPages.push(new NotePage());
}

deletePage() {
  this.Confirmation.Confirm('Delete Page');
  this.NotesPages.splice(this.SelectedPage, 1);
  if (this.NotesPages.length === 0) {
    this.addNewPage();
  }
}

}
