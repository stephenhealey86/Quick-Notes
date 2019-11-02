import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppSettingsService } from 'src/app/Services/app-settings.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  sideBarCollapsed = true;

  @Input() WindowState: boolean;

  constructor(public Settings: AppSettingsService) { }

  ngOnInit() {
    this.SetAbsolutePositions();
  }

  ToggleSideBar() {
    this.sideBarCollapsed = !this.sideBarCollapsed;
  }

  AddNewNote() {
    this.Settings.addNewNote();
  }

  SelectPage(index: number) {
    this.Settings.SelectedPage = index;
    this.SetAbsolutePositions();
  }

  SetAbsolutePositions() {
    setTimeout(() => {
      const noteFrames = document.getElementsByClassName('NoteFrame');
      this.Settings.Notes.forEach((note, index) => {
        if (note.X > 0 || note.Y > 0) {
          const div = noteFrames[index] as HTMLDivElement;
          div.style.position = 'absolute';
          div.style.top = note.Y + 'px';
          div.style.left = note.X + 'px';
        }
      });
    }, 10);
  }

  AddPage() {
    this.Settings.addNewPage();
  }

}
