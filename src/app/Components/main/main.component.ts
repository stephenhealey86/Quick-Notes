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

  ResizeTextArea(index: number) {
    const element = document.getElementById(`textarea${index}`) as HTMLTextAreaElement;
    const scroll = element.scrollHeight;
    const offset = element.offsetHeight;
    let height = (scroll - offset) + offset;
    height = height >= 97 ? height : 97;
    if (element.value === '') {
      height = 97;
    }
    element.style.height = `${height}px`;
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
      const element = e.target as HTMLElement;
      const div = element.closest('.NoteFrame') as HTMLElement;
      div.style.position = 'absolute';
      note.Y = e.clientY - 37.5;
      note.X = e.clientX - 37.5;
      div.style.top = note.Y + 'px';
      div.style.left = note.X + 'px';
    }
  }​
}
