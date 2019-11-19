import { Component, OnInit } from '@angular/core';
import { Note, NoteFrame } from 'src/app/Models/Note';
import { AppSettingsService } from 'src/app/Services/app-settings.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  //#region Variables
  // True when the user mouse is down
  MouseIsDown = false;
  // Note for dragging
  NoteToDrag: NoteFrame;
  //#endregion

  constructor(public Settings: AppSettingsService) {}

  ngOnInit() {
    document.onmouseup = () => this.MouseUp();
    document.onmousemove = (e) => this.MouseMove(e);
    setTimeout(() => {
      this.Settings.Notes.forEach((e, i) => {
        this.resizeTextArea(i);
      });
    }, 20);
  }

  //#region Methods
  // Increments Note.Priority variable
  NotePriorityChanged(note: Note) {
    note.Priority = note.Priority >= 3 ? 0 : note.Priority + 1;
  }

  // Passes focus onto textarea from input
  KeyPressed(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      const TXT = document.getElementById(`textarea${index}`) as HTMLTextAreaElement;
      TXT.focus();
    }
  }

  // Prevents user froming resizing Note outside of page boundries
  UserresizeTextArea(e: MouseEvent) {
    // Check user resizing
    const FRAAME = document.getElementsByTagName('app-main')[0] as HTMLElement;
    const LIMITRECT = FRAAME.getBoundingClientRect();
    const ELEMENT = e.target as HTMLElement;
    const DIV = ELEMENT.closest('.NoteFrame') as HTMLElement;
    // Resizing Notes
    if (this.MouseIsDown) {
      // Mouse is down check boundries
      if ((LIMITRECT.right < DIV.getBoundingClientRect().right)) {
        // Reszie width
        const width = LIMITRECT.right - DIV.getBoundingClientRect().left - 5;
        DIV.style.width = width + 'px';
      }
      // If width is minWidth
      if ((LIMITRECT.right < DIV.getBoundingClientRect().right)) {
        DIV.style.left = (LIMITRECT.right - DIV.offsetWidth - 20) + 'px';
      }
    }
  }

  // Changes MouseIsDown state
  ToggleMouseDown() {
    this.MouseIsDown = !this.MouseIsDown;
  }
  // Resizes the text area to suit the number of lines
  resizeTextArea(index: number) {
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

  // Removes the selected note
  DeleteNote(note: NoteFrame) {
    this.Settings.deleteNote(note);
  }

  // Cancels note dragging
  MouseUp() {
    // Clear place holder note if exists
    if (this.NoteToDrag) {
      this.NoteToDrag.Draggable = false;
      this.NoteToDrag = null;
    }
  }

  // Enables note dragging
  MouseDown(note: NoteFrame) {
    // Enable note dragging
    note.Draggable = !note.Draggable;
  }

  // Sets the note with focus to front
  BringToFront(e: MouseEvent, note: NoteFrame) {
    // Get element
    const ELEMENT = e.target as HTMLElement;
    const DIV = ELEMENT.closest('.NoteFrame') as HTMLElement;
    // Get highest zindex
    const ZINDEX = this.Settings.Notes.map((n) => n.ZIndex).sort((a, b) => b - a)[0];
    note.ZIndex = ZINDEX + 1;
    // Set new zindex
    DIV.style.zIndex = note.ZIndex.toString();
  }

  SetDraggableNote(note: NoteFrame) {
    this.NoteToDrag = note;
    this.MouseDown(note);
  }

  // Enables dragging of notes
  MouseMove(e: MouseEvent) {
    if (this.NoteToDrag) {
      if (this.NoteToDrag.Draggable) {
        // Get elements
        const FRAME = document.getElementsByTagName('app-main')[0] as HTMLElement;
        const LIMITRECT = FRAME.getBoundingClientRect();
        // Get index
        const INDEX = this.Settings.Notes.indexOf(this.NoteToDrag);
        const DIV = document.getElementById(`note${INDEX}`) as HTMLElement;
        DIV.style.position = 'absolute';
        // Check constraints
        if ((LIMITRECT.left - 20 < e.clientX - 37.5) && (LIMITRECT.right - 20 > e.clientX - 37.5 + DIV.offsetWidth)) {
          this.NoteToDrag.X = e.clientX - 37.5;
        }
        if ((LIMITRECT.top - 20 < e.clientY - 37.5) && (LIMITRECT.bottom - 20 > e.clientY - 37.5 + DIV.offsetHeight)) {
          this.NoteToDrag.Y = e.clientY - 37.5;
        }
        // Set note position
        DIV.style.top = this.NoteToDrag.Y + 'px';
        DIV.style.left = this.NoteToDrag.X + 'px';
      }
    }
  }​

  // Toggles the Note bullet point boolean
  ToggleBulletPoints(note: Note, index: number) {
    note.BulletPoints = !note.BulletPoints;
    if (note.BulletPoints) {
      const TXTBOX = document.getElementById(`textarea${index}`) as HTMLTextAreaElement;
      const TXT = TXTBOX.value;
      TXTBOX.value = TXT + '\t\u2022 ';
      TXTBOX.focus();
    } else {
      const TXTBOX = document.getElementById(`textarea${index}`) as HTMLTextAreaElement;
      TXTBOX.focus();
    }
  }

  // Goto textarea newline and add bullet point
  AddBulletPoint(event: KeyboardEvent, index: number, note: Note) {
    if (event.key === 'Enter' && note.BulletPoints) {
      event.preventDefault();
      const TXTBOX = document.getElementById(`textarea${index}`) as HTMLTextAreaElement;
      const TXT = TXTBOX.value;
      TXTBOX.value = TXT + '\n\t\u2022 ';
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const TXTBOX = document.getElementById(`textarea${index}`) as HTMLTextAreaElement;
      const TXT = TXTBOX.value;
      TXTBOX.value = TXT + '\t';
    }
  }
  //#endregion
}
