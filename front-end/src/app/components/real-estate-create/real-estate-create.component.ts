import { Component } from '@angular/core';
import {CheckList} from "../../models/check-list.model";
import {RealEstate} from "../../models/real-estate.model";
import {CheckListItem} from "../../models/check-list-item.model";

@Component({
  selector: 'real-estate-create',
  templateUrl: './real-estate-create.component.html',
  styleUrl: './real-estate-create.component.scss'
})
export class RealEstateCreateComponent {
  reTypes: string[] = ['apartment','villa','room'];
  realEstate: RealEstate = new RealEstate();
  newCheckListName: string;

  constructor() {
  }

  onCreateRe() {

  }

  addChecklist() {
    let newChecklist = new CheckList(this.newCheckListName,this.realEstate);
    this.realEstate.checkLists.push(newChecklist);
  }

  addChecklistItem(checkListIndex: number) {

    this.realEstate.checkLists[checkListIndex].checkListItems.push(new CheckListItem())
  }

  updateCheckListName() {
    this.newCheckListName = "CheckList " + this.realEstate.name
  }

  deleteCheckListItem(checkListIndex: number, checkListItemIndex: number) {
    let itemDesc: string = this.realEstate.checkLists[checkListIndex].checkListItems[checkListItemIndex].description
    this.realEstate.checkLists[checkListIndex].checkListItems = this.realEstate.checkLists[checkListIndex].checkListItems
      .filter(item => item.description != itemDesc)
  }
}
