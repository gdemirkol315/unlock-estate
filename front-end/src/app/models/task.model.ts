import {User} from "./user.model";
import {RealEstate} from "./real-estate.model";
import {TaskCheckListItem} from "./task-check-list-item.model";

export class Task {
  id: number;
  realEstate: RealEstate;
  assignee: User;
  comments: Comment[];
  taskCheckListItems: TaskCheckListItem[];
  taskDate: Date;
  createdDate: Date;
}
