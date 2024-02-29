import {RealEstate} from "./real-estate.model";
import {CheckListItem} from "./check-list-item.model";

export class CheckList {
  id: number;
  name: string;
  realEstate: RealEstate;
  checkListItems: CheckListItem[];

}
