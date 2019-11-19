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
  }

  // Toggles the side bar collapsed feature
  ToggleSideBar() {
    this.sideBarCollapsed = !this.sideBarCollapsed;
  }

  // Adds a new note
  AddNewNote() {
    this.Settings.addNewNote();
  }

  // Selects the page
  SelectPage(index: number) {
    // Set page
    const ELEMENT = document.getElementById(`pageName${index}`) as HTMLTextAreaElement;
    if (ELEMENT && ELEMENT.value === 'Rename Me!') {
      ELEMENT.setSelectionRange(0, ELEMENT.value.length);
    }
    this.Settings.selectPage(index);
  }

  // Adds new page
  AddPage() {
    this.Settings.addNewPage();
    const INDEX = this.Settings.NotesPages.length - 1;
    this.SelectPage(INDEX);
  }

  async DeletePage() {
    await this.Settings.deletePage();
  }

}
