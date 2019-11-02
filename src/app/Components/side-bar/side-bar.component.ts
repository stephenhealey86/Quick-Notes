import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppSettingsService } from 'src/app/Services/app-settings.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  sideBarCollapsed = false;

  @Input() WindowState: boolean;

  constructor(public Settings: AppSettingsService) { }

  ngOnInit() {
  }

  ToggleSideBar() {
    this.sideBarCollapsed = !this.sideBarCollapsed;
  }

  AddNewNote() {
    this.Settings.addNewNote();
  }

  SelectPage(index: number) {
    this.Settings.SelectedPage = index;
    console.log(index);
  }

  AddPage() {
    this.Settings.addNewPage();
  }

}
