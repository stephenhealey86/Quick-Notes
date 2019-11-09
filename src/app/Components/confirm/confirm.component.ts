import { Component, OnInit, Input } from '@angular/core';
import { ConfirmationService } from 'src/app/Services/confirmation.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  @Input() WindowState: boolean;

  constructor(public Confirm: ConfirmationService) { }

  ngOnInit() {
  }

}
