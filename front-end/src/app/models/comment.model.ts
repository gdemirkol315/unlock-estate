import {Image} from "./image.model";
import {Task} from "./task.model";

export class Comment {
  id: number;
  content: string;
  date: Date;
  task: Task;
  image: Image;
}
