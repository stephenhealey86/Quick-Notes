import { Component, OnInit } from '@angular/core';
import { Note, NoteFrame } from 'src/app/Models/Note';
import { AppSettingsService } from 'src/app/Services/app-settings.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  Settings: AppSettingsService;
  MouseIsDown = false;

  constructor(private settings: AppSettingsService) {
    this.Settings = settings;
   }

  ngOnInit() {
    window.onload = () => {this.SetAbsolutePositions(); };
  }

  NotePriorityChanged(note: Note) {
    note.Priority = note.Priority >= 3 ? 0 : note.Priority + 1;
  }

  KeyPressed(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      const txt = document.getElementById(`textarea${index}`) as HTMLTextAreaElement;
      txt.focus();
    }
  }

  UserResizeTextArea(e: MouseEvent) {
    // Check user resizing
    const frame = document.getElementsByTagName('app-main')[0] as HTMLElement;
    const limitRect = frame.getBoundingClientRect();
    const element = e.target as HTMLElement;
    const div = element.closest('.NoteFrame') as HTMLElement;
    // Resizing Notes
    if (this.MouseIsDown || true) {
      // Mouse is down check boundries
      if ((limitRect.right < div.getBoundingClientRect().right)) {
        const width = limitRect.right - div.getBoundingClientRect().left - 5;
        div.style.width = width + 'px';
      }
    }
  }

  ToggleMouseDown() {
    this.MouseIsDown = !this.MouseIsDown;
  }

  ResizeTextArea(index: number) {
    // Get app-main position on page
    const frame = document.getElementsByTagName('app-main')[0] as HTMLElement;
    const limitRect = frame.getBoundingClientRect();
    // Get textarea and sizes
    const element = document.getElementById(`textarea${index}`) as HTMLTextAreaElement;
    const height = element.offsetHeight;
    // Resize textarea
    element.style.height = '0px';
    let scroll = element.scrollHeight;
    scroll = scroll >= 97 ? scroll : 97;
    element.style.height = `${scroll}px`;
    const bottom = element.getBoundingClientRect().bottom;
    // Reset if out of bounds
    if (limitRect.bottom < bottom) {
      element.style.height = `${height}px`;
    }
    // Show scroll is possible
    if (element.scrollHeight > element.offsetHeight) {
      element.classList.add('showScroll');
      element.scrollTo(0, element.selectionStart);
    } else {
      element.classList.remove('showScroll');
    }
  }

  SetAbsolutePositions() {
    const noteFrames = document.getElementsByClassName('NoteFrame');
    this.settings.Notes.forEach((note, index) => {
      if (note.X > 0 || note.Y > 0) {
        const div = noteFrames[index] as HTMLDivElement;
        div.style.position = 'absolute';
        div.style.top = note.Y + 'px';
        div.style.left = note.X + 'px';
      }
    });
  }

  DeleteNote(note: NoteFrame) {
    const index = this.settings.Notes.indexOf(note, 0);
    this.settings.Notes.splice(index, 1);
    if (this.settings.Notes.length === 0) {
      this.settings.addNewNote();
    }
  }

  MouseUp(note: NoteFrame) {
      note.Draggable = false;
  }

  MouseDown(note: NoteFrame) {
    // Enable not dragging
    note.Draggable = !note.Draggable;
  }

  BringToFront(e: MouseEvent, note: NoteFrame) {
    const element = e.target as HTMLElement;
    const div = element.closest('.NoteFrame') as HTMLElement;

    const zindex = this.settings.Notes.map((n) => n.ZIndex).sort((a, b) => b - a)[0];
    note.ZIndex = zindex + 1;

    div.style.zIndex = note.ZIndex.toString();
  }

  MouseMove(e: MouseEvent, note: NoteFrame) {
    if (note.Draggable) {
      const frame = document.getElementsByTagName('app-main')[0] as HTMLElement;
      const limitRect = frame.getBoundingClientRect();
      const element = e.target as HTMLElement;
      const div = element.closest('.NoteFrame') as HTMLElement;
      div.style.position = 'absolute';
      if ((limitRect.left - 20 < e.clientX - 37.5) && (limitRect.right - 20 > e.clientX - 37.5 + div.offsetWidth)) {
        note.X = e.clientX - 37.5;
      }
      if ((limitRect.top - 20 < e.clientY - 37.5) && (limitRect.bottom - 20 > e.clientY - 37.5 + div.offsetHeight)) {
        note.Y = e.clientY - 37.5;
      }
      div.style.top = note.Y + 'px';
      div.style.left = note.X + 'px';
    }
  }​
}
