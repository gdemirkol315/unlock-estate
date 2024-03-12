import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'full-size-image-dialog',
  templateUrl: './full-size-image-dialog.component.html',
  styleUrls: ['./full-size-image-dialog.component.scss']
})
export class FullSizeImageDialogComponent implements OnInit{
  constructor(@Inject(MAT_DIALOG_DATA) public data: { secureImageUrl },
              public sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    if (typeof this.data.secureImageUrl != 'string'){
      this.data.secureImageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.secureImageUrl.changingThisBreaksApplicationSecurity);
    }

  }



}
