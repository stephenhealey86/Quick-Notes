import { Component, OnInit, Input } from '@angular/core';
import { AppSettingsService } from 'src/app/Services/app-settings.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  sideBarCollapsed = false;

  @Input() WindowState: boolean;

  constructor(private Settings: AppSettingsService) { }

  ngOnInit() {
  }

  ToggleSideBar() {
    this.sideBarCollapsed = !this.sideBarCollapsed;
  }

  AddNewNote() {
    this.Settings.addNewNote();
  }

}
