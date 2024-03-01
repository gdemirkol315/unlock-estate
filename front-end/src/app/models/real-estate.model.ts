import {Task} from "./task.model";
import {CheckList} from "./check-list.model";
import {CheckListItem} from "./check-list-item.model";

export class RealEstate {
  id: number;
  name: string;
  country: string;
  city: string;
  address: string;
  calendarUrl: string;
  tasks: Task[] = new Array();
  checkLists: CheckList[] = new Array();
  type: string;

  addChecklist(newCheckListName: string) {
    let newChecklist = new CheckList(newCheckListName, this);
    this.checkLists.push(newChecklist);
  }

  addChecklistItem(checkListIndex: number) {
    this.checkLists[checkListIndex].checkListItems.push(new CheckListItem())
  }

  deleteCheckListItem(checkListIndex: number, checkListItemIndex: number) {
    let itemDesc: string = this.checkLists[checkListIndex].checkListItems[checkListItemIndex].description
    this.checkLists[checkListIndex].checkListItems = this.checkLists[checkListIndex].checkListItems
      .filter(item => item.description != itemDesc)
  }
}
