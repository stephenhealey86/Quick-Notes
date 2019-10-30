import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  sideBarCollapsed = false;

  @Input() WindowState: boolean;

  constructor() { }

  ngOnInit() {
  }

  ToggleSideBar() {
    this.sideBarCollapsed = !this.sideBarCollapsed;
  }

}
