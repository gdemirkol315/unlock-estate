import {Task} from "./task.model";
import {CheckList} from "./check-list.model";

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

}
