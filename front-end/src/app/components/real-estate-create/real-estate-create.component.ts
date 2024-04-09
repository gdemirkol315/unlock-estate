import { Component } from '@angular/core';
import {RealEstate} from "../../models/real-estate.model";
import {RealEstateService} from "../../services/real-estate/real-estate.service";
import {first} from "rxjs";
import {SpinnerDialogComponent} from "../spinner-dialog/spinner-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'real-estate-create',
  templateUrl: './real-estate-create.component.html',
  styleUrl: './real-estate-create.component.scss'
})
export class RealEstateCreateComponent {
  reTypes: string[] = ['apartment','villa','room'];
  realEstate: RealEstate = new RealEstate();
  newCheckListName: string;

  constructor(private realEstateService:RealEstateService,
              private matDialog:MatDialog) {
  }

  updateCheckListName() {
    this.newCheckListName = "CheckList " + this.realEstate.name
  }

  onSaveRealEstate() {
    if (this.isFormValid()) {
      this.matDialog.open(SpinnerDialogComponent)
      this.realEstateService.save(this.realEstate).pipe(first())
        .subscribe({
          next: (realEstate:RealEstate) => {
            this.realEstateService.toastr.success("Real estate " + realEstate.name + " successfully saved!");
            this.reInitForm();
          },
          error: (err) => {
            this.realEstateService.toastr.error("An unexpected error occurred while saving real estate!");
            console.log(err);
          }, complete: ()=>{
            this.matDialog.closeAll();
          }
        });
    } else {
      this.realEstateService.toastr.error("Necessary fields are not filled!")
    }
  }

  private isFormValid():boolean{
    if (this.realEstate.name != null
    && this.realEstate.address != null
    && this.realEstate.city != null
    && this.realEstate.country != null
    && this.realEstate.zipCode != null) {
      return true;
    } else {
      return false;
    }
  }

  private reInitForm(){
    this.newCheckListName =""
    this.realEstate = new RealEstate();
  }
}
