import { Injectable } from '@angular/core';
import { NoteFrame, NotePage } from '../Models/Note';
import { environment } from 'src/environments/environment';
import { ElectronService } from 'ngx-electron';
import * as settings from 'electron-settings';
import { ConfirmationService } from './confirmation.service';
import { SettingsModel } from '../Models/SettingsModel';

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
    if (this.settings.has('settings')) {
      const SETTINGS = JSON.parse(this.settings.get('settings')) as SettingsModel;
      this.NotesPages = SETTINGS.Data;
      this.SelectedPage = SETTINGS.LastPage >= 0 ? SETTINGS.LastPage : 0;
    } else {
      this.NotesPages = [new NotePage()] as NotePage[];
    }
  } else { // Get notes if web app
    const SETTINGS  = JSON.parse(localStorage.getItem('settings'));
    if (SETTINGS === null || SETTINGS === undefined) {
      this.NotesPages = [new NotePage()] as NotePage[];
    } else {
      this.NotesPages = SETTINGS.Data;
      this.SelectedPage = SETTINGS.LastPage >= 0 ? SETTINGS.LastPage : 0;
    }
  }
}

selectPage(index: number) {
  this.SelectedPage = index;
  setTimeout(() => {
    this.Notes.forEach((e, i) => {
      this.ResizeTextArea(i);
    });
  }, 20);
}

// Resizes the text area to suit the number of lines
ResizeTextArea(index: number) {
  // Get app-main position on page
  const FRAME = document.getElementsByTagName('app-main')[0] as HTMLElement;
  const LIMITRECT = FRAME.getBoundingClientRect();
  // Get textarea and sizes
  const ELEMENT = document.getElementById(`textarea${index}`) as HTMLTextAreaElement;
  const HEIGHT = ELEMENT.offsetHeight;
  // Resize textarea
  ELEMENT.style.height = '0px';
  let scroll = ELEMENT.scrollHeight;
  scroll = scroll >= 97 ? scroll : 97;
  ELEMENT.style.height = `${scroll}px`;
  const bottom = ELEMENT.getBoundingClientRect().bottom;
  // Reset if out of bounds
  if (LIMITRECT.bottom < bottom) {
    ELEMENT.style.height = `${HEIGHT}px`;
  }
  // Show scroll is possible
  if (ELEMENT.scrollHeight > ELEMENT.offsetHeight) {
    ELEMENT.classList.add('showScroll');
    ELEMENT.scrollTo(0, ELEMENT.selectionStart);
  } else {
    ELEMENT.classList.remove('showScroll');
  }
}

// Saves notes to storage
setNoteFrames() {
  const SETTINGS = new SettingsModel(this.NotesPages, this.SelectedPage);
  if (environment.production) {
    // Store notes
    this.settings.set('settings', JSON.stringify(SETTINGS));
  } else {
    localStorage.setItem('settings', JSON.stringify(SETTINGS));
  }
}

// Adds a new note
addNewNote() {
  // Create new note
  const NOTE = new NoteFrame();
  // Get side bar
  const SIDE_BAR = document.getElementsByClassName('side-bar')[0];
  // Offset new note if sidebar not collapsed
  if (SIDE_BAR) {
    if (!SIDE_BAR.classList.contains('side-bar-collapsed')) {
      NOTE.X += 110;
    }
  }
  // Add new note to array
  this.Notes.push(NOTE);
}

// Removes the selected note
deleteNote(note: NoteFrame) {
  // Get Note index
  const INDEX = this.Notes.indexOf(note, 0);
  // Remove note at index
  this.Notes.splice(INDEX, 1);
  // Add new note if no notes left
  if (this.Notes.length === 0) {
    this.addNewNote();
  }
}

// Adds a new page
addNewPage() {
  // Limit number of pages to 10
  if (this.NotesPages.length <= 9) {
    // Cretae new NotePage
    const PAGE = new NotePage();
    // Offset note as side bar will be expanded
    PAGE.Data[0].X += 110;
    // Add note to array
    this.NotesPages.push(PAGE);
  }
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
