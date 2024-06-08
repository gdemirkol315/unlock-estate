import {User} from "./user.model";
import {RealEstate} from "./real-estate.model";
import {TaskCheckListItem} from "./task-check-list-item.model";
import {Comment} from "./comment.model"
import {Expense} from "./expense.model";

export class Task {
  id: number;
  realEstate: RealEstate = new RealEstate();
  assignee: User = new User();
  creator: User = new User();
  comments: Comment[] = new Array();
  taskCheckListItems: TaskCheckListItem[] = new Array();
  taskDate: Date = new Date();
  startTime: Date;
  finishTime: Date;
  createdDate: Date = new Date();
  status: string;
  expenses: Expense[] = new Array ();

  [key: string]: any;
}
