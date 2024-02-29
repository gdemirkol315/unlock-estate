import {CheckListItem} from "./check-list-item.model";
import {RealEstate} from "./real-estate.model";

export class CheckList {
  id: number;
  name: string;
  realEstate: RealEstate = new RealEstate();
  checkListItems: CheckListItem[] = new Array();


  constructor(name: string, realEstate: RealEstate) {
    this.name = name;
    this.realEstate = realEstate;
  }
}
