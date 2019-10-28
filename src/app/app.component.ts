import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'QuickNotes';
  windowState = false;

  ChangeWindowState(state: boolean) {
    this.windowState = state;
  }
}
