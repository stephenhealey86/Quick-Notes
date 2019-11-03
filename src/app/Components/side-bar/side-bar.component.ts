import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppSettingsService } from 'src/app/Services/app-settings.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  //#region  Variables
  // Toggles side bar
  sideBarCollapsed = true;
  // True if window maximized
  @Input() WindowState: boolean;
  //#endregion

  constructor(public Settings: AppSettingsService) { }

  ngOnInit() {
    // Set the notes positons if they have been moved
    this.SetAbsolutePositions();
  }

  // Toggles the side bar collapsed feature
  ToggleSideBar() {
    this.sideBarCollapsed = !this.sideBarCollapsed;
  }

  // Adds a new note
  AddNewNote() {
    this.Settings.addNewNote();
  }

  // Selects the page, updates new notes positions
  SelectPage(index: number) {
    // Set page
    this.Settings.SelectedPage = index;
    // Update positions
    this.SetAbsolutePositions();
  }

  // Sets the notes postions if they have been moved
  SetAbsolutePositions() {
    setTimeout(() => {
      // Get note elements
      const NOTE_FRAMES = document.getElementsByClassName('NoteFrame');
      this.Settings.Notes.forEach((note, index) => {
        if (note.X > 0 || note.Y > 0) {
          // Set positions
          const DIV = NOTE_FRAMES[index] as HTMLDivElement;
          DIV.style.position = 'absolute';
          DIV.style.top = note.Y + 'px';
          DIV.style.left = note.X + 'px';
        }
      });
    }, 10);
  }

  // Adds new page
  AddPage() {
    this.Settings.addNewPage();
  }

}
