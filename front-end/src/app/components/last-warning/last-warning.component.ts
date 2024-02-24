import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-last-warning',
  templateUrl: './last-warning.component.html',
  styleUrl: './last-warning.component.scss'
})
export class LastWarningComponent implements OnInit{

  message: boolean;

  ngOnInit(): void {
    this.message = this.data.message;
  }
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private matDialogRefLastWarn:MatDialogRef<LastWarningComponent>) {
  }

  setTrue() {
    this.matDialogRefLastWarn.close(true);
  }

  setFalse() {
    this.matDialogRefLastWarn.close(false);
  }

}
