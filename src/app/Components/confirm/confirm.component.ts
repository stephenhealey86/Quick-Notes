import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'src/app/Services/confirmation.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  constructor(public Confirm: ConfirmationService) { }

  ngOnInit() {
  }

}
