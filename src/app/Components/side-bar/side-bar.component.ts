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

  ngOnInit(): void {
  }

  toggleSideBar(): void {
    this.sideBarCollapsed = !this.sideBarCollapsed;
  }

  // Adds a new note
  addNewNote(): void {
    this.Settings.addNewNote();
  }

  // Selects the page
  selectPage(index: number): void {
    try {
      // Set page
      const ELEMENT = document.getElementById(`pageName${index}`) as HTMLTextAreaElement;
      if (ELEMENT && ELEMENT.value === 'Rename Me!') {
        ELEMENT.setSelectionRange(0, ELEMENT.value.length);
      }
      this.Settings.selectPage(index);
    } catch (error) {
      // Implement logging
      throw error;
    }
  }

  // Adds new page
  addPage(): void {
    this.Settings.addNewPage();
    const INDEX = this.Settings.NotesPages.length - 1;
    this.selectPage(INDEX);
  }

  async deletePage(): Promise<void> {
    await this.Settings.deletePage();
  }

}
