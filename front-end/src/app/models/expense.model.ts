import { Task } from "./task.model";
import {User} from "./user.model";

export class Expense {
  id: number;
  description: string;
  amount: number;
  task: Task = new Task();
  author: User = new User();
}
