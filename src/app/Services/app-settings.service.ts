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

  //#region Variables
  // Holds the selected page
  SelectedPage = 0;
  // Store the note pages
  NotesPages: NotePage[] = [];
  // Gets the noteframes based on selected page
  get Notes(): NoteFrame[] {
    return this.NotesPages[this.SelectedPage].Data;
  }
  // Set the noteframes based on selected page
  set Notes(value: NoteFrame[]) {
    this.NotesPages[this.SelectedPage].Data = value;
  }
  // Electron settings
  settings: typeof settings;

constructor(private electronService: ElectronService, private confirmation: ConfirmationService) {

  if (environment.production) {
    // Initialise settings if running electron
    this.settings = this.electronService.remote.require('electron-settings');
  }

  // Get stored notes
  this.getNoteFrames();
 }

// Gets the noted from storage
getNoteFrames() {
  // Get notes if running electron
  if (environment.production) {
    // Get notes from storage
    this.NotesPages = this.settings.get('notes');
    if (this.NotesPages === null || this.NotesPages === undefined) {
      this.NotesPages = [new NotePage()] as NotePage[];
    }
  } else { // Get notes if web app
    this.NotesPages = JSON.parse(localStorage.getItem('notes'));
    if (this.NotesPages === null || this.NotesPages === undefined) {
      this.NotesPages = [new NotePage()] as NotePage[];
    }
  }
}

// Saves notes to storage
setNoteFrames() {
  if (environment.production) {
    // Store notes
    this.settings.set('notes', this.NotesPages);
  } else {
    localStorage.setItem('notes', JSON.stringify(this.NotesPages));
  }
}

// Adds a new note
addNewNote() {
  this.Notes.push(new NoteFrame());
}

// Adds a new page
addNewPage() {
  this.NotesPages.push(new NotePage());
}

// Deletes page based on user selection
async deletePage() {
  if (await this.confirmation.ConfirmAsyc('Delete Page')) {
    // Delete page
    this.NotesPages.splice(this.SelectedPage, 1);
    // Add new page if empty
    if (this.NotesPages.length === 0) {
      this.addNewPage();
    }
  }
}

}
