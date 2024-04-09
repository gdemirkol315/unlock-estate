import {Injectable} from '@angular/core';
import {DataService} from "../data/data.service";
import {HttpParams} from "@angular/common/http";
import {Task} from "../../models/task.model";
import {User} from "../../models/user.model";
import {TaskCheckListItem} from "../../models/task-check-list-item.model";
import {Comment} from "../../models/comment.model"
import {first, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TaskService extends DataService {

  private serviceUrlSuffix: string = "task"
  public isProcessFinished: Subject<boolean> = new Subject<boolean>();

  getTask(taskId: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("id", taskId);
    return this.http.get<Task>(this.hostname + this.serviceUrlSuffix + "/task", {params: queryParams});
  }

  saveTask(task: Task) {
    return this.http.post<Task>(this.hostname + this.serviceUrlSuffix + "/createTask", task)
  }

  updateTask(task: Task, toastrSuccessMessage:string) {
    this.http.post(this.hostname + this.serviceUrlSuffix + "/updateTask", task).pipe(first()).subscribe({
      next: () =>{
        this.toastr.success(toastrSuccessMessage);
        this.router.navigate(['/success'])
      }, error: err => {
        console.log(err);
        this.toastr.error("There was an unexpected error while saving task!");
      }, complete:()=>{
        this.isProcessFinished.next(true)
      }
    });
  }

  findAssignee(users: User[], taskId: number) {
    for (const user of users) {
      for (const task of user.assignedTasks) {
        if (task.id == taskId) {
          return user;
        }
      }
    }
    return new User();
  }

  findCreator(users: User[], taskId: number) {
    for (const user of users) {
      for (const task of user.createdTasks) {
        if (task.id == taskId) {
          return user;
        }
      }
    }
    return new User();
  }


  updateTaskCheckListItemStatus(item: TaskCheckListItem, taskId) {
    return this.http.post(this.hostname + this.serviceUrlSuffix + "/updateTaskChecklistItem/"+taskId, item);
  }

  addComment(currentComment: Comment) {
    return this.http.post<Comment>(this.hostname + this.serviceUrlSuffix + "/addComment", currentComment);
  }

  getComments(taskId:number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("taskId", taskId);
    return this.http.get<Comment[]>(this.hostname + this.serviceUrlSuffix + "/getComments",{params: queryParams})
  }

  getCommentAuthorDetails (commentId: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("commentId", commentId);
    return this.http.get<User>(this.hostname + this.serviceUrlSuffix + "/getAuthor",{params: queryParams})
  }
}
