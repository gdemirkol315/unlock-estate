import { Component } from '@angular/core';
import {RealEstate} from "../../models/real-estate.model";
import {CheckList} from "../../models/check-list.model";

@Component({
  selector: 'app-real-estate-detail',
  templateUrl: './real-estate-detail.component.html',
  styleUrl: './real-estate-detail.component.scss'
})
export class RealEstateDetailComponent {
  isEditMode: boolean = false;
  realEstate: RealEstate;
  reTypes: string[];
  newCheckListName: string;


  addChecklist() {
    let newChecklist = new CheckList(this.newCheckListName,this.realEstate);
    this.realEstate.checkLists.push(newChecklist);
  }

  onEditMode() {
    this.isEditMode = true;
  }

  onSave() {
    this.isEditMode = false
  }
}
