import {CheckListItem} from "./check-list-item.model";
import {Task} from "./task.model";

export class TaskCheckListItem {
  task: Task;
  checklistItem: CheckListItem;
  status: string;
  lastStatusChangeDate: Date;
}
