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
  NEW_NOTE_PLACEMENT_OFFSET_X = 110;
  MAX_NUMBER_OF_PAGES = 10;
  SelectedPage = 0;
  NotesPages: NotePage[] = [];
  settings: typeof settings;
  get Notes(): NoteFrame[] {
    return this.NotesPages[this.SelectedPage].Data;
  }
  set Notes(value: NoteFrame[]) {
    this.NotesPages[this.SelectedPage].Data = value;
  }

constructor(private electronService: ElectronService, private confirmation: ConfirmationService) {
  
  if (this.isRunningInElectron()) {
    this.settings = this.electronService.remote.require('electron-settings');
  }
  this.getNoteFramesFromStorage();
 }

// Returns true if running in production, Electron is assumed to be true when in production
isRunningInElectron(): boolean {
  return environment.production;
}

// Gets the notes from storage
getNoteFramesFromStorage(): void {
  // Get notes if running electron
  if (this.isRunningInElectron()) {
    this.getElectronSettings();
  } else { // Get notes if web app
    this.getWebAppSettings();
  }
}

getElectronSettings(): void {
  // Get notes from storage
  if (this.settings.has('settings')) {
    const SETTINGS = JSON.parse(this.settings.get('settings')) as SettingsModel;
    this.NotesPages = SETTINGS.Data;
    this.SelectedPage = SETTINGS.LastPage >= 0 ? SETTINGS.LastPage : 0;
  } else {
    this.NotesPages = [new NotePage()] as NotePage[];
  }
}

getWebAppSettings(): void {
  const SETTINGS  = JSON.parse(localStorage.getItem('settings'));
    if (SETTINGS === null || SETTINGS === undefined) {
      this.NotesPages = [new NotePage()] as NotePage[];
    } else {
      this.NotesPages = SETTINGS.Data;
      this.SelectedPage = SETTINGS.LastPage >= 0 ? SETTINGS.LastPage : 0;
    }
}

selectPage(index: number): void {
  if (index !== null && index !== undefined && index < this.NotesPages.length) {
    selectPageAction.call(this);
  } else {
    throw new Error('Page out of range');
  }

  function selectPageAction(): void {
    this.SelectedPage = index;
    setTimeout(() => {
      this.Notes.forEach((e, i) => {
        this.resizeTextArea(i);
      });
    }, 20);
  }
}

// Resizes the text area to suit the number of lines
resizeTextArea(index: number) {
  try {
    resizeTextAreaAction();
  } catch (error) {
    // Implement logging
    throw error;
  }

  function resizeTextAreaAction(): void {
    // Get app-main position on page
  const APP_MAIN_ELEMENT = document.getElementsByTagName('app-main')[0] as HTMLElement;
  const WINDOW_FRAME_BOUNDRY_LIMITS = APP_MAIN_ELEMENT.getBoundingClientRect();
  // Get textarea and sizes
  const TEXT_AREA_ELEMENT = document.getElementById(`textarea${index}`) as HTMLTextAreaElement;
  const TEXT_AREA_ELEMENT_HEIGHT = TEXT_AREA_ELEMENT.offsetHeight;
  // Resize textarea
  TEXT_AREA_ELEMENT.style.height = '0px';
  let textAreaScrollHeight = TEXT_AREA_ELEMENT.scrollHeight;
  textAreaScrollHeight = textAreaScrollHeight >= 97 ? textAreaScrollHeight : 97;
  TEXT_AREA_ELEMENT.style.height = `${textAreaScrollHeight}px`;
  const TEXT_AREA_BOTTOM = TEXT_AREA_ELEMENT.getBoundingClientRect().bottom;
  // Reset if out of bounds
  if (WINDOW_FRAME_BOUNDRY_LIMITS.bottom < TEXT_AREA_BOTTOM) {
    TEXT_AREA_ELEMENT.style.height = `${TEXT_AREA_ELEMENT_HEIGHT}px`;
  }
  // Show scroll is possible
  if (TEXT_AREA_ELEMENT.scrollHeight > TEXT_AREA_ELEMENT.offsetHeight) {
    TEXT_AREA_ELEMENT.classList.add('showScroll');
    TEXT_AREA_ELEMENT.scrollTo(0, TEXT_AREA_ELEMENT.selectionStart);
  } else {
    TEXT_AREA_ELEMENT.classList.remove('showScroll');
  }
  }
}

// Saves notes to storage
saveNoteFramesToStorage() {
  const SETTINGS = new SettingsModel(this.NotesPages, this.SelectedPage);
  if (this.isRunningInElectron()) {
    // Store electron notes
    this.settings.set('settings', JSON.stringify(SETTINGS));
  } else { // Store webapp notes
    localStorage.setItem('settings', JSON.stringify(SETTINGS));
  }
}

// Adds a new note
addNewNote() {
  // Create new note
  const NEW_NOTE = new NoteFrame();
  try {
    addNewNoteAction();
  } catch (error) {
    // Implement logging
  } finally {
    // Add new note to array
    this.Notes.push(NEW_NOTE);
  }

  function addNewNoteAction(): void {
    // Get side bar
    const SIDE_BAR_ELEMENT = document.getElementsByClassName('side-bar')[0];
    // Offset new note if sidebar not collapsed
    if (SIDE_BAR_ELEMENT) {
      if (!SIDE_BAR_ELEMENT.classList.contains('side-bar-collapsed')) {
        NEW_NOTE.X += this.NEW_NOTE_PLACEMENT_OFFSET_X;
      }
    }
  }
}

// Removes the selected note
deleteNote(note: NoteFrame) {
  if (note) {
    try {
      deleteNoteAction.call(this);
    } catch (error) {
      // Implement logging
    }
  } else {
    addNoteIfNoNotes();
    return;
  }

  function deleteNoteAction(): void {
    // Get Note index
    const INDEX_OF_NOTE = this.Notes.indexOf(note, 0);
    if (INDEX_OF_NOTE < 0) {
      return;
    }
    // Remove note at index
    this.Notes.splice(INDEX_OF_NOTE, 1);
    addNoteIfNoNotes();
  }
  function addNoteIfNoNotes() {
    if (this.Notes.length === 0) {
      this.addNewNote();
    }
  }
}

// Adds a new page
addNewPage() {
  // Limit number of pages to MAX_NUMBER_OF_PAGES
  if (this.NotesPages.length < this.MAX_NUMBER_OF_PAGES) {
    const NOTE_PAGE = new NotePage();
    NOTE_PAGE.Data[0].X += this.NEW_NOTE_PLACEMENT_OFFSET_X;
    this.NotesPages.push(NOTE_PAGE);
  }
}

// Deletes page based on user selection
async deletePage() {
  if (await this.confirmation.ConfirmAsyc('Delete Page')) {
    this.NotesPages.splice(this.SelectedPage, 1);
    // Add new page if empty
    if (this.NotesPages.length === 0) {
      this.addNewPage();
    }
  }
}

}
