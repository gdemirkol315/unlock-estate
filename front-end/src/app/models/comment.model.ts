import {Image} from "./image.model";
import {Task} from "./task.model";
import {User} from "./user.model";
import {Observable} from "rxjs";
import {SafeUrl} from "@angular/platform-browser";

export class Comment {
  id: number;
  content: string;
  date: Date;
  author: User = new User;
  task: Task = new Task();
  images: Image[] = new Array();
  imageUrls$: Observable<SafeUrl[]>;
}
