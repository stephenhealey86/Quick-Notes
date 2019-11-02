import { Injectable } from '@angular/core';
import { ConfirmModel } from '../Models/Confirm';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  Active: boolean;
  Data = new ConfirmModel();

constructor() { }

Confirm(title: string) {
  this.Data.Title = title;
  this.Active = true;
}

}
