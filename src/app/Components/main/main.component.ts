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

  ngOnInit(): void {
    document.onmouseup = () => this.userStoppedDraggingNote();
    document.onmousemove = (e) => this.userIsDraggingNote(e);
    setTimeout(() => {
      this.Settings.Notes.forEach((e, i) => {
        this.resizeTextArea(i);
      });
    }, 20);
  }

  //#region Methods
  userStoppedDraggingNote(): void {
    // Clear place holder note if exists
    if (this.NoteToDrag) {
      this.NoteToDrag.Draggable = false;
      this.NoteToDrag = null;
    }
  }

  userStatedDraggingNote(note: NoteFrame): void {
    // Enable note dragging
    note.Draggable = !note.Draggable;
  }

  notePriorityChanged(note: Note): void {
    note.Priority = note.Priority >= 3 ? 0 : note.Priority + 1;
  }

  passFocusToTextArea(event: KeyboardEvent, index: number): void {
    try {
      if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault();
        const TXT = document.getElementById(`textarea${index}`) as HTMLTextAreaElement;
        TXT.focus();
      }
    } catch (error) {
      // Implement logging
      throw error;
    }
  }

  resizeNoteConstraints(e: MouseEvent): void {
    try {
      resizeNoteConstraintsAction.call(this);
    } catch (error) {
      // Implement logging
      throw error;
    }

    function resizeNoteConstraintsAction(): void {
      // Check user resizing
      const FRAME = document.getElementsByTagName('app-main')[0] as HTMLElement;
      const LIMITRECT = FRAME.getBoundingClientRect();
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
  }

  toggleMouseDownState(): void {
    this.MouseIsDown = !this.MouseIsDown;
  }
  // Resizes the text area to suit the number of lines
  resizeTextArea(index: number): void {
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

  deleteNote(note: NoteFrame): void {
    this.Settings.deleteNote(note);
  }

  bringNoteWithFocusToFront(e: MouseEvent, note: NoteFrame): void {
    // Get element
    const ELEMENT = e.target as HTMLElement;
    const DIV = ELEMENT.closest('.NoteFrame') as HTMLElement;
    // Get highest zindex
    const ZINDEX = this.Settings.Notes.map((n) => n.ZIndex).sort((a, b) => b - a)[0];
    note.ZIndex = ZINDEX + 1;
    // Set new zindex
    DIV.style.zIndex = note.ZIndex.toString();
  }

  userChooseNoteToDrag(note: NoteFrame): void {
    this.NoteToDrag = note;
    this.userStatedDraggingNote(note);
  }

  // Enables dragging of notes
  userIsDraggingNote(e: MouseEvent): void {
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
  toggleBulletPoints(note: Note, index: number): void {
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
  addBulletPoint(event: KeyboardEvent, index: number, note: Note): void {
    if (event.key === 'Enter' && note.BulletPoints) {
      event.preventDefault();
      const TXTBOX = document.getElementById(`textarea${index}`) as HTMLTextAreaElement;
      const CURSOR_POS = TXTBOX.selectionEnd;
      const TXT = TXTBOX.value;
      if (CURSOR_POS !== TXTBOX.value.length - 4) {
        const STARTTXT = TXT.slice(0, CURSOR_POS) + '\n\t\u2022 ';
        const ENDTXT = TXT.slice(CURSOR_POS, TXT.length);
        TXTBOX.value = STARTTXT + ENDTXT;
        TXTBOX.selectionEnd = CURSOR_POS + 4;
      } else {
        TXTBOX.value = TXT + '\n\t\u2022 ';
      }
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const TXTBOX = document.getElementById(`textarea${index}`) as HTMLTextAreaElement;
      const TXT = TXTBOX.value;
      TXTBOX.value = TXT + '\t';
    }
  }
  //#endregion
}
