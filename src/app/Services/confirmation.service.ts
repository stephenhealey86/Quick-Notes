import { Injectable } from '@angular/core';
import { ConfirmModel } from '../Models/Confirm';
import { delay } from 'q';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  //#region Variables
  // True if Confirmation pop is active
  Active = false;
  // The result from the user
  Result = false;
  // Data to pass to confirmation view
  Data = new ConfirmModel();
  //#endregion

constructor() { }

// Shows confirmation popup, pass data to view and waits for user input
async ConfirmAsyc(title: string): Promise<boolean> {
  this.Data.Title = title;
  this.Active = true;
  while (this.Active) {
    // Do nothing
    await delay(100);
  }
  return this.Result;
}

// Sets the user result and hides popup
SetResult(res: boolean) {
  this.Active = false;
  this.Result = res;
}

}
