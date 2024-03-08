import {User} from "./user.model";
import {RealEstate} from "./real-estate.model";
import {TaskCheckListItem} from "./task-check-list-item.model";
import {Comment} from "./comment.model"

export class Task {
  id: number;
  realEstate: RealEstate;
  assignee: User = new User();
  creator: User = new User();
  comments: Comment[] = new Array();
  taskCheckListItems: TaskCheckListItem[] = new Array();
  taskDate: Date = new Date();
  createdDate: Date = new Date();
  active:boolean;

  [key: string]: any;
}
