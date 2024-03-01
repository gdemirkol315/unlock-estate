import {CheckListItem} from "./check-list-item.model";
import {RealEstate} from "./real-estate.model";

export class CheckList {
  id: number;
  name: string;
  realEstate: RealEstate;
  checkListItems: CheckListItem[] = new Array();


  constructor(name: string) {
    this.name = name;
  }
}
