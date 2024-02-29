import {CheckListItem} from "./check-list-item.model";
import {Task} from "./task.model";

export class TaskCheckListItem {
  id: number;
  task: Task;
  checklistItem: CheckListItem;
  status: string;
  lastStatusChangeDate: Date;
}
